import { makeBlueMonster } from "../entities/fodder_entities/blue-monster";
import { makeRing } from "../entities/ring";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore } from "../gameState";
import {
  addGround,
  addHudText,
  addPauseFeature,
  addScrollingBackdrop,
  createPlayerHealth,
} from "../gameplay";
import { k } from "../kaplayCtx";

const GOAL_DISTANCE = 500;

export function LevelOne(options = {}) {
  let score = Number(options.score ?? 0);
  let rings = Number(options.rings ?? 0);
  let distance = 0;
  let gameSpeed = 480;
  let running = true;

  k.setGravity(3100);
  const music = k.play("ingame-sound", { volume: 0.28, loop: true });
  const moveBackdrop = addScrollingBackdrop("forest-bg");

  const platformWidth = 1514 * 1.25;
  const platforms = [0, platformWidth].map((x) =>
    k.add([
      k.sprite("grass-planes"),
      k.pos(x, 540),
      k.scale(1.25),
      k.z(-2),
    ]),
  );

  k.add([
    k.rect(k.width(), 210),
    k.pos(0, 870),
    k.color(k.rgb(139, 82, 50)),
    k.z(-3),
  ]);
  k.add([
    k.rect(k.width(), 18),
    k.pos(0, 870),
    k.color(k.rgb(31, 170, 77)),
    k.z(-2),
  ]);

  addGround(870 - SONIC_FOOT_OFFSET);

  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 28));
  const ringText = addHudText(`RINGS  ${rings}`, k.vec2(34, 82));
  const healthText = addHudText("", k.vec2(34, 136), {
    color: k.rgb(255, 220, 48),
  });
  const goalText = addHudText(`LAIR  ${GOAL_DISTANCE}m`, k.vec2(1880, 32), {
    anchor: "topright",
  });
  addHudText("SPACE / ↑  DOUBLE JUMP     ↓  SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
    color: k.rgb(225, 242, 255),
  });

  const sonic = makeSonic(k.vec2(350, 760));
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();

  const endRun = (reason) => {
    if (!running) return;
    running = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "levelOne",
      stageName: "Emerald Woods",
      score,
      reason,
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: () => endRun("Shroom Doom's scouts stopped the run."),
  });

  sonic.onCollide("enemy", (enemy) => {
    if (!running || playerHealth.isDead() || enemy.defeated) return;

    if (sonic.isAttacking()) {
      enemy.defeated = true;
      sonic.bounce();
      enemy.playHit?.();
      k.play("destroy", { volume: 0.5 });
      score += 100;
      scoreText.text = `SCORE  ${score}`;
      k.wait(0.25, () => {
        if (enemy.exists()) k.destroy(enemy);
      });
      return;
    }

    playerHealth.damage(enemy.pos.x);
  });

  sonic.onCollide("ring", (ring) => {
    if (!running) return;
    k.play("ring", { volume: 0.45 });
    k.destroy(ring);
    rings += 1;
    score += 10;
    scoreText.text = `SCORE  ${score}`;
    ringText.text = `RINGS  ${rings}`;
  });

  const spawnEnemy = () => {
    if (!running) return;
    const monster = makeBlueMonster(k.vec2(2020, 810));
    monster.onUpdate(() => {
      if (!running || monster.defeated) return;
      monster.move(-(gameSpeed + 140), 0);
    });
    monster.onExitScreen(() => {
      if (monster.pos.x < -150) k.destroy(monster);
    });
    k.wait(k.rand(1.7, 3.1), spawnEnemy);
  };

  const spawnRingTrail = () => {
    if (!running) return;
    const count = Math.round(k.rand(3, 6));
    const height = k.rand(0, 1) > 0.55 ? 650 : 805;

    for (let index = 0; index < count; index += 1) {
      const ring = makeRing(k.vec2(1980 + index * 86, height));
      ring.onUpdate(() => {
        if (running) ring.move(-(gameSpeed + 140), 0);
      });
      ring.onExitScreen(() => {
        if (ring.pos.x < -80) k.destroy(ring);
      });
    }

    k.wait(k.rand(2.1, 3.8), spawnRingTrail);
  };

  k.wait(1.4, spawnRingTrail);
  k.wait(2.4, spawnEnemy);

  k.onUpdate(() => {
    if (!running) return;

    gameSpeed = Math.min(900, gameSpeed + 8 * k.dt());
    distance = Math.min(GOAL_DISTANCE, distance + (gameSpeed * k.dt()) / 34);
    goalText.text = `LAIR  ${Math.ceil(GOAL_DISTANCE - distance)}m`;

    moveBackdrop(75);
    for (const platform of platforms) {
      platform.move(-gameSpeed, 0);
      if (platform.pos.x <= -platformWidth) platform.pos.x += platformWidth * 2;
    }

    if (distance >= GOAL_DISTANCE) {
      running = false;
      music.stop();
      saveBestScore(score);
      addHudText("SHROOM DOOM AHEAD!", k.center(), {
        size: 86,
        anchor: "center",
        color: k.rgb(255, 220, 48),
        z: 50,
      });
      k.wait(1.5, () => k.go("levelOneBoss", { score, rings }));
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
