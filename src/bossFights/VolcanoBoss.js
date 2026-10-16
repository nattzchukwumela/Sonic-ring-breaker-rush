import { makeMagmaclaw } from "../entities/boss/magmaclaw";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import {
  addGround,
  addHudText,
  addPauseFeature,
  createPlayerHealth,
  STANDARD_BOSS_MAX_HEALTH,
} from "../gameplay";
import { k } from "../kaplayCtx";

const BOSS_MAX_HEALTH = STANDARD_BOSS_MAX_HEALTH;
const BOSS_RAGE_HEALTH = Math.floor(BOSS_MAX_HEALTH / 2);
const GROUND_Y = 850;
const PLATFORM_SCALE = 1920 / 2172;

export function VolcanoBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.35;
  let chargeTimer = 0;
  let direction = -1;
  let attackPattern = 0;

  k.setGravity(3100);
  const music = k.play("target-locked", { loop: true, volume: 0.37 });

  k.add([
    k.sprite("volcano-boss-bg"),
    k.pos(0, 0),
    k.scale(1920 / 1672, 1080 / 941),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height() - GROUND_Y),
    k.pos(0, GROUND_Y),
    k.color(k.rgb(35, 8, 14)),
    k.z(-3),
  ]);
  k.add([
    k.sprite("volcano-platform"),
    k.pos(0, GROUND_Y - 239),
    k.scale(PLATFORM_SCALE),
    k.z(-1),
  ]);
  addGround(GROUND_Y - SONIC_FOOT_OFFSET);

  const healthText = addHudText("", k.vec2(34, 28), {
    color: k.rgb(255, 220, 48),
  });
  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 82));
  const bossText = addHudText("", k.vec2(1880, 28), {
    anchor: "topright",
    color: k.rgb(255, 105, 42),
  });
  addHudText(
    "A / D  MOVE     SPACE / ↑  DOUBLE JUMP     ↓  SPIN",
    k.vec2(960, 1030),
    { size: 30, anchor: "bot" },
  );

  const updateBossHud = () => {
    bossText.text = `MAGMACLAW  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 730), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeMagmaclaw(k.vec2(1510, 665));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "volcanoBoss",
      retryData: { score, rings },
      stageName: "Magmaclaw's Crater",
      score,
      reason: "Magmaclaw buried Sonic beneath the eruption.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const addLavaHazard = (components, lifetime = 5) =>
    k.add([
      ...components,
      k.area(),
      k.opacity(1),
      k.z(7),
      k.lifespan(lifetime),
      "hazard",
    ]);

  const fireLavaShot = (verticalOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 190, -50));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= BOSS_RAGE_HEALTH ? 900 : 740;
    const shot = addLavaHazard([
      k.rect(68, 68, { radius: 30 }),
      k.pos(origin),
      k.anchor("center"),
      k.color(k.rgb(255, 92, 18)),
      k.outline(8, k.rgb(255, 221, 52)),
      {
        velocity: k.vec2((dx / length) * speed, (dy / length) * speed),
      },
    ]);
    shot.onUpdate(() => shot.move(shot.velocity));
  };

  const summonEruption = (horizontalOffset = 0) => {
    if (!battleActive) return;
    const targetX = k.clamp(sonic.pos.x + horizontalOffset, 100, 1820);
    k.add([
      k.rect(150, 20, { radius: 10 }),
      k.pos(targetX, GROUND_Y - SONIC_FOOT_OFFSET - 8),
      k.anchor("center"),
      k.color(k.rgb(255, 217, 48)),
      k.opacity(0.8),
      k.z(6),
      k.lifespan(0.48),
    ]);

    k.wait(0.48, () => {
      if (!battleActive) return;
      addLavaHazard(
        [
          k.rect(118, 270, { radius: 34 }),
          k.pos(targetX, GROUND_Y - SONIC_FOOT_OFFSET - 135),
          k.anchor("center"),
          k.color(k.rgb(255, 76, 15)),
          k.outline(10, k.rgb(255, 210, 46)),
        ],
        0.58,
      );
    });
  };

  sonic.onCollide("hazard", (hazard) => {
    if (!battleActive) return;
    const sourceX = hazard.pos.x;
    if (hazard.exists()) k.destroy(hazard);
    playerHealth.damage(sourceX);
  });

  const defeatBoss = () => {
    battleActive = false;
    music.stop();
    k.destroyAll("hazard");
    boss.opacity = 0.2;
    score += 3500 + rings * 25;
    scoreText.text = `SCORE  ${score}`;
    saveBestScore(score);
    unlockStage(7);

    addHudText("MAGMACLAW DEFEATED!", k.vec2(960, 325), {
      font: "nise-sega-font",
      size: 72,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "VOLCANO CONQUERED!",
        message: `Starfall Station unlocked • Ring bonus: ${rings * 25}`,
        score,
        nextScene: "levelSix",
      }),
    );
  };

  const hitBoss = () => {
    if (!battleActive || bossInvulnerable || bossHealth <= 0) return;
    bossInvulnerable = true;
    bossHealth -= 1;
    score += 550;
    scoreText.text = `SCORE  ${score}`;
    updateBossHud();
    k.play("destroy", { volume: 0.58 });
    boss.playHit();
    sonic.bounce();

    if (bossHealth <= 0) {
      defeatBoss();
      return;
    }

    k.wait(0.7, () => {
      if (!boss.exists() || !battleActive) return;
      bossInvulnerable = false;
      boss.recover();
    });
  };

  sonic.onCollide("boss", () => {
    if (!battleActive || playerHealth.isDead()) return;
    if (sonic.isAttacking()) hitBoss();
    else playerHealth.damage(boss.pos.x);
  });

  k.onUpdate(() => {
    if (!battleActive || playerHealth.isDead()) return;

    attackTimer -= k.dt();
    chargeTimer = Math.max(0, chargeTimer - k.dt());
    const speed =
      chargeTimer > 0
        ? 640
        : bossHealth <= BOSS_RAGE_HEALTH
          ? 260
          : 180;
    boss.move(direction * speed, 0);

    if (boss.pos.x < 820) {
      boss.pos.x = 820;
      direction = 1;
    } else if (boss.pos.x > 1640) {
      boss.pos.x = 1640;
      direction = -1;
    }

    if (attackTimer <= 0) {
      direction = sonic.pos.x < boss.pos.x ? -1 : 1;
      chargeTimer = 0.68;

      if (attackPattern % 2 === 0) {
        fireLavaShot();
        if (bossHealth <= BOSS_RAGE_HEALTH) {
          k.wait(0.24, () => fireLavaShot(-115));
          k.wait(0.48, () => fireLavaShot(90));
        }
      } else {
        summonEruption();
        if (bossHealth <= BOSS_RAGE_HEALTH) {
          summonEruption(direction * 230);
        }
      }

      attackPattern += 1;
      attackTimer = bossHealth <= BOSS_RAGE_HEALTH ? 1.4 : 2.05;
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
