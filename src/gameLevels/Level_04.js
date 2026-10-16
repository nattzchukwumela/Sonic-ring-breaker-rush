import { makeMotobug } from "../entities/fodder_entities/motobug";
import { makeRing } from "../entities/ring";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import { addGround, addHudText, createPlayerHealth } from "../gameplay";
import { k } from "../kaplayCtx";

const GOAL_DISTANCE = 650;

export function LevelFour(options = {}) {
  let score = Number(options.score ?? 0);
  let rings = Number(options.rings ?? 0);
  let distance = 0;
  let gameSpeed = 620;
  let running = true;

  k.setGravity(3200);
  const music = k.play("chemical-rush", { loop: true, volume: 0.32 });

  const backgrounds = [0, 1920].map((x) =>
    k.add([
      k.sprite("chemical-bg"),
      k.pos(x, 0),
      k.opacity(0.86),
      k.z(-10),
    ]),
  );
  const platformWidth = 1920;
  const platforms = [0, platformWidth].map((x) =>
    k.add([
      k.sprite("platform"),
      k.pos(x, 760),
      k.scale(1.5),
      k.z(-1),
    ]),
  );
  k.add([
    k.rect(k.width(), 205),
    k.pos(0, 875),
    k.color(k.rgb(22, 56, 88)),
    k.z(-3),
  ]);
  k.add([
    k.rect(k.width(), 18),
    k.pos(0, 875),
    k.color(k.rgb(34, 188, 212)),
    k.z(-2),
  ]);
  addGround(875 - SONIC_FOOT_OFFSET);

  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 28));
  const ringText = addHudText(`RINGS  ${rings}`, k.vec2(34, 82));
  const healthText = addHudText("", k.vec2(34, 136), {
    color: k.rgb(255, 220, 48),
  });
  const goalText = addHudText(`GOAL  ${GOAL_DISTANCE}m`, k.vec2(1880, 32), {
    anchor: "topright",
  });
  addHudText("CHEMICAL RUSH  •  SPACE / ↑ JUMP  •  ↓ SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const sonic = makeSonic(k.vec2(330, 760));
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();

  const finishWithLoss = () => {
    if (!running) return;
    running = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "levelFour",
      stageName: "Chemical Rush",
      score,
      reason: "The Badniks ended the final run.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: finishWithLoss,
  });

  sonic.onCollide("enemy", (enemy) => {
    if (!running || playerHealth.isDead() || enemy.defeated) return;
    if (sonic.isAttacking()) {
      enemy.defeated = true;
      sonic.bounce();
      k.play("destroy", { volume: 0.5 });
      score += 150;
      scoreText.text = `SCORE  ${score}`;
      k.destroy(enemy);
      return;
    }
    playerHealth.damage(enemy.pos.x);
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

  const spawnMotobug = () => {
    if (!running) return;
    const motobug = makeMotobug(k.vec2(2020, 815));
    motobug.onUpdate(() => {
      if (running && !motobug.defeated) motobug.move(-(gameSpeed + 120), 0);
    });
    motobug.onExitScreen(() => {
      if (motobug.pos.x < -150) k.destroy(motobug);
    });
    k.wait(k.rand(1.35, 2.55), spawnMotobug);
  };

  const spawnRings = () => {
    if (!running) return;
    const count = Math.round(k.rand(3, 7));
    const high = k.rand(0, 1) > 0.5;
    for (let index = 0; index < count; index += 1) {
      const arc = high ? Math.sin((index / Math.max(1, count - 1)) * Math.PI) * 120 : 0;
      const ring = makeRing(k.vec2(1980 + index * 82, 805 - arc));
      ring.onUpdate(() => {
        if (running) ring.move(-(gameSpeed + 120), 0);
      });
      ring.onExitScreen(() => {
        if (ring.pos.x < -80) k.destroy(ring);
      });
    }
    k.wait(k.rand(1.9, 3.3), spawnRings);
  };

  k.wait(1.2, spawnRings);
  k.wait(2.2, spawnMotobug);

  k.onUpdate(() => {
    if (!running) return;
    gameSpeed = Math.min(1120, gameSpeed + 11 * k.dt());
    distance = Math.min(GOAL_DISTANCE, distance + (gameSpeed * k.dt()) / 38);
    goalText.text = `GOAL  ${Math.ceil(GOAL_DISTANCE - distance)}m`;

    for (const background of backgrounds) {
      background.move(-90, 0);
      if (background.pos.x <= -1920) background.pos.x += 3840;
    }
    for (const platform of platforms) {
      platform.move(-gameSpeed, 0);
      if (platform.pos.x <= -platformWidth) platform.pos.x += platformWidth * 2;
    }

    if (distance >= GOAL_DISTANCE) {
      running = false;
      music.stop();
      score += rings * 25;
      saveBestScore(score);
      unlockStage(3);
      k.go("victory", {
        title: "FACTORY CLEARED!",
        message: `Sky Patrol unlocked • Ring bonus: ${rings * 25}`,
        score,
        nextScene: "levelThree",
      });
    }
  });

  k.onKeyPress("escape", () => {
    music.stop();
    k.go("level-select");
  });
}
