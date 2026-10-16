import { makeRing } from "../entities/ring";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import {
  addGround,
  addHudText,
  addPauseFeature,
  createPlayerHealth,
} from "../gameplay";
import { k } from "../kaplayCtx";

export function createRunnerStage(config, options = {}) {
  let score = Number(options.score ?? 0);
  let rings = 0;
  let distance = 0;
  let gameSpeed = config.startSpeed;
  let running = true;

  k.setGravity(3200);
  const music = k.play(config.music, { loop: true, volume: 0.3 });

  const backgrounds = [0, config.backgroundWidth].map((x) =>
    k.add([
      k.sprite(config.background),
      k.pos(x, 0),
      k.scale(config.backgroundScale[0], config.backgroundScale[1]),
      k.opacity(config.backgroundOpacity ?? 0.88),
      k.z(-10),
    ]),
  );

  if (config.tint) {
    k.add([
      k.rect(k.width(), k.height()),
      k.color(config.tint.color),
      k.opacity(config.tint.opacity),
      k.z(-8),
    ]);
  }

  k.add([
    k.rect(k.width(), k.height() - config.groundY),
    k.pos(0, config.groundY),
    k.color(config.groundColor),
    k.z(-3),
  ]);

  const groundScale = config.groundScale ?? [4, 4];
  const tileWidth = (config.groundTileWidth ?? 64) * groundScale[0];
  const tileCount = Math.ceil(k.width() / tileWidth) + 2;
  const groundTiles = Array.from({ length: tileCount }, (_, index) =>
    k.add([
      k.sprite(config.groundSprite),
      k.pos(index * tileWidth, config.groundY),
      k.scale(groundScale[0], groundScale[1]),
      config.groundSpriteColor ? k.color(config.groundSpriteColor) : null,
      k.z(-1),
    ].filter(Boolean)),
  );
  addGround(config.groundY - SONIC_FOOT_OFFSET);

  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 28));
  const ringText = addHudText("RINGS  0", k.vec2(34, 82));
  const healthText = addHudText("", k.vec2(34, 136), {
    color: k.rgb(255, 220, 48),
  });
  const goalText = addHudText(`GOAL  ${config.goal}m`, k.vec2(1880, 32), {
    anchor: "topright",
  });
  addHudText(`${config.name.toUpperCase()}  •  SPACE / ↑ DOUBLE JUMP  •  ↓ SPIN`, k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const sonic = makeSonic(k.vec2(330, config.groundY - 120));
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();

  const loseStage = () => {
    if (!running) return;
    running = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: config.scene,
      stageName: config.name,
      score,
      reason: config.loseMessage,
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseStage,
  });

  sonic.onCollide("enemy", (enemy) => {
    if (!running || playerHealth.isDead() || enemy.defeated) return;
    if (sonic.isAttacking()) {
      enemy.defeated = true;
      enemy.playHit?.();
      sonic.bounce();
      k.play("destroy", { volume: 0.5 });
      score += enemy.points ?? 150;
      scoreText.text = `SCORE  ${score}`;
      k.wait(0.12, () => {
        if (enemy.exists()) k.destroy(enemy);
      });
      return;
    }
    playerHealth.damage(enemy.pos.x);
  });

  sonic.onCollide("hazard", (hazard) => {
    if (!running || playerHealth.isDead()) return;
    const sourceX = hazard.pos.x;
    if (hazard.exists()) k.destroy(hazard);
    playerHealth.damage(sourceX);
  });

  sonic.onCollide("ring", (ring) => {
    if (!running) return;
    k.destroy(ring);
    k.play("ring", { volume: 0.45 });
    rings += 1;
    score += 10;
    scoreText.text = `SCORE  ${score}`;
    ringText.text = `RINGS  ${rings}`;
  });

  const fireAtSonic = (enemy) => {
    if (!running || !enemy.exists() || playerHealth.isDead()) return;
    const dx = sonic.pos.x - enemy.pos.x;
    const dy = sonic.pos.y - enemy.pos.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const shotSpeed = 670;
    const velocity = k.vec2((dx / length) * shotSpeed, (dy / length) * shotSpeed);
    const shot = k.add([
      k.circle(22),
      k.pos(enemy.pos),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(255, 118, 35)),
      k.outline(6, k.rgb(255, 231, 72)),
      k.opacity(1),
      k.z(5),
      k.lifespan(5),
      "hazard",
      { velocity },
    ]);
    shot.onUpdate(() => shot.move(shot.velocity));
  };

  const spawnEnemy = () => {
    if (!running) return;
    const enemyType = config.enemies[Math.floor(k.rand(0, config.enemies.length))];
    const spawnY = enemyType.flying
      ? k.rand(config.groundY - 300, config.groundY - 155)
      : config.groundY - 60;
    const enemy = enemyType.create(k.vec2(2070, spawnY));
    enemy.points = enemyType.points;
    const baseY = spawnY;
    const phase = k.rand(0, Math.PI * 2);

    enemy.onUpdate(() => {
      if (!running || enemy.defeated) return;
      enemy.move(-(gameSpeed + enemyType.speedBonus), 0);
      if (enemyType.flying) {
        enemy.pos.y = baseY + Math.sin(k.time() * 3.5 + phase) * 32;
      }
    });
    enemy.onExitScreen(() => {
      if (enemy.pos.x < -220) k.destroy(enemy);
    });

    if (enemyType.fires) {
      k.wait(k.rand(0.65, 1.1), () => fireAtSonic(enemy));
    }
    k.wait(k.rand(config.enemyDelay[0], config.enemyDelay[1]), spawnEnemy);
  };

  const spawnRingTrail = () => {
    if (!running) return;
    const count = Math.round(k.rand(4, 7));
    const high = k.rand(0, 1) > 0.45;
    for (let index = 0; index < count; index += 1) {
      const arc = high
        ? Math.sin((index / Math.max(1, count - 1)) * Math.PI) * 135
        : 0;
      const ring = makeRing(
        k.vec2(1980 + index * 82, config.groundY - 55 - arc),
      );
      ring.onUpdate(() => {
        if (running) ring.move(-(gameSpeed + 100), 0);
      });
      ring.onExitScreen(() => {
        if (ring.pos.x < -80) k.destroy(ring);
      });
    }
    k.wait(k.rand(1.8, 3.2), spawnRingTrail);
  };

  k.wait(1.1, spawnRingTrail);
  k.wait(1.8, spawnEnemy);

  k.onUpdate(() => {
    if (!running) return;
    gameSpeed = Math.min(config.maxSpeed, gameSpeed + config.acceleration * k.dt());
    distance = Math.min(
      config.goal,
      distance + (gameSpeed * k.dt()) / config.distanceDivisor,
    );
    goalText.text = `GOAL  ${Math.ceil(config.goal - distance)}m`;

    for (const background of backgrounds) {
      background.move(-config.backgroundSpeed, 0);
      if (background.pos.x <= -config.backgroundWidth) {
        background.pos.x += config.backgroundWidth * 2;
      }
    }
    for (const tile of groundTiles) {
      tile.move(-gameSpeed, 0);
      if (tile.pos.x <= -tileWidth) tile.pos.x += tileWidth * tileCount;
    }

    if (distance >= config.goal) {
      running = false;
      music.stop();
      k.destroyAll("hazard");

      if (config.completeScene) {
        addHudText(config.completeText ?? "BOSS AHEAD!", k.vec2(960, 350), {
          font: "nise-sega-font",
          size: 78,
          anchor: "center",
          color: k.rgb(255, 220, 48),
          z: 50,
        });
        saveBestScore(score);
        k.wait(1.5, () => k.go(config.completeScene, { score, rings }));
        return;
      }

      score += rings * 25;
      saveBestScore(score);
      if (config.unlockStage) unlockStage(config.unlockStage);
      k.go("victory", {
        title: config.victoryTitle,
        message: `${config.victoryMessage} • Ring bonus: ${rings * 25}`,
        score,
        nextScene: config.nextScene,
      });
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
