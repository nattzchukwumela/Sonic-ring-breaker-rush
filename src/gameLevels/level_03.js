import { makeStormFalcon } from "../entities/boss/stormFalcon";
import { makeSkyBird } from "../entities/fodder_entities/skyBird";
import { makeRing } from "../entities/ring";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import {
  addHudText,
  addPauseFeature,
  createPlayerHealth,
  STANDARD_BOSS_MAX_HEALTH,
} from "../gameplay";
import { k } from "../kaplayCtx";

const LARGE_PLATFORM_SCALE = 0.28;
const SHORT_PLATFORM_SCALE = 0.22;
const LARGE_PLATFORM_WIDTH = 2172 * LARGE_PLATFORM_SCALE;
const SHORT_PLATFORM_WIDTH = 1346 * SHORT_PLATFORM_SCALE;
const START_PLATFORM_Y = 940;
const SUMMIT_PLATFORM_Y = -4080;
const SUMMIT_DISTANCE = START_PLATFORM_Y - SUMMIT_PLATFORM_Y;
const BOSS_MAX_HEALTH = STANDARD_BOSS_MAX_HEALTH;
const BOSS_RAGE_HEALTH = Math.floor(BOSS_MAX_HEALTH / 2);
const ARENA_UPPER_PLATFORM_Y = SUMMIT_PLATFORM_Y - 300;
const ARENA_CAMERA_Y = SUMMIT_PLATFORM_Y - 350;
const BOSS_TRIGGER_Y = SUMMIT_PLATFORM_Y - SONIC_FOOT_OFFSET;
const BOSS_Y = ARENA_UPPER_PLATFORM_Y - SONIC_FOOT_OFFSET - 225;
const BOSS_LOWEST_Y = ARENA_UPPER_PLATFORM_Y - SONIC_FOOT_OFFSET - 180;
const BOSS_LEFT_BOUND = 330;
const BOSS_RIGHT_BOUND = 1590;

const platformRoute = [
  { x: 560, y: 700 },
  { x: 900, y: 460, falling: true },
  { x: 1230, y: 220 },
  { x: 900, y: -20, falling: true },
  { x: 540, y: -260 },
  { x: 210, y: -500, falling: true },
  { x: 550, y: -740 },
  { x: 900, y: -980, falling: true },
  { x: 1230, y: -1220 },
  { x: 900, y: -1460, falling: true },
  { x: 540, y: -1700 },
  { x: 800, y: -1940, falling: true },
  { x: 1190, y: -2180 },
  { x: 900, y: -2420, falling: true },
  { x: 560, y: -2660 },
  { x: 220, y: -2900, falling: true },
  { x: 560, y: -3140 },
  { x: 900, y: -3380, falling: true },
  { x: 1230, y: -3620 },
  { x: 1320, y: -3860, falling: true },
];

const birdRoute = [
  { x: 1510, y: 500, minX: 1320, maxX: 1740 },
  { x: 260, y: -170, minX: 140, maxX: 520 },
  { x: 1490, y: -820, minX: 1260, maxX: 1740 },
  { x: 270, y: -1400, minX: 120, maxX: 520 },
  { x: 1480, y: -1880, minX: 1260, maxX: 1740 },
  { x: 320, y: -2540, minX: 130, maxX: 570 },
  { x: 1480, y: -3260, minX: 1250, maxX: 1760 },
  { x: 280, y: -3720, minX: 120, maxX: 540 },
];

export function LevelThree(options = {}) {
  let score = Number(options.score ?? 0);
  let rings = 0;
  let stageActive = true;
  let cameraY = 540;
  let bossActive = false;
  let bossDefeated = false;
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let bossDirection = -1;
  let bossAttackTimer = 1.2;
  let bossAttackPattern = 0;

  k.setGravity(2800);
  k.camPos(k.center());
  const music = k.play("sky-patrol", { loop: true, volume: 0.3 });

  k.add([
    k.sprite("sky-islands-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(1920 / 1672, 1080 / 941),
    k.fixed(),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.rgb(28, 102, 205)),
    k.opacity(0.08),
    k.fixed(),
    k.z(-9),
  ]);

  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 28));
  const ringText = addHudText("RINGS  0", k.vec2(34, 82));
  const healthText = addHudText("", k.vec2(34, 136), {
    color: k.rgb(255, 220, 48),
  });
  const summitText = addHudText(`SUMMIT  ${SUMMIT_DISTANCE}m`, k.vec2(1880, 32), {
    anchor: "topright",
    color: k.rgb(255, 220, 48),
  });
  addHudText(
    "SKY PATROL  •  A / D MOVE  •  SPACE / ↑ DOUBLE JUMP  •  USE THE HIGH PLATFORMS TO STRIKE FROM ABOVE",
    k.vec2(960, 1030),
    {
      size: 26,
      anchor: "bot",
    },
  );

  const addPlatform = ({ sprite, x, y, scale, width, falling = false }) => {
    const visual = k.add([
      k.sprite(sprite),
      k.pos(x, y),
      k.scale(scale),
      k.opacity(1),
      k.z(1),
    ]);
    const surface = k.add([
      k.rect(width, 26),
      k.pos(x, y - SONIC_FOOT_OFFSET),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "sky-platform",
      falling ? "falling-platform" : null,
      {
        visual,
        armed: false,
        dropping: false,
        fallSpeed: 0,
      },
    ].filter(Boolean));

    surface.onUpdate(() => {
      if (!surface.exists() || !visual.exists()) return;

      if (surface.dropping) {
        surface.fallSpeed += 1750 * k.dt();
        surface.pos.y += surface.fallSpeed * k.dt();
        visual.pos.x = surface.pos.x;
        visual.pos.y = surface.pos.y + SONIC_FOOT_OFFSET;

        if (surface.pos.y > cameraY + 900) {
          k.destroy(visual);
          k.destroy(surface);
        }
        return;
      }

      if (surface.armed) {
        visual.pos.x = surface.pos.x + Math.sin(k.time() * 52) * 8;
        visual.opacity = 0.72 + Math.sin(k.time() * 30) * 0.2;
      }
    });

    return surface;
  };

  addPlatform({
    sprite: "sky-large-platform",
    x: 0,
    y: START_PLATFORM_Y,
    scale: LARGE_PLATFORM_SCALE,
    width: LARGE_PLATFORM_WIDTH,
  });

  for (const platform of platformRoute) {
    addPlatform({
      sprite: "sky-short-platform",
      x: platform.x,
      y: platform.y,
      scale: SHORT_PLATFORM_SCALE,
      width: SHORT_PLATFORM_WIDTH,
      falling: platform.falling,
    });
    makeRing(
      k.vec2(
        platform.x + SHORT_PLATFORM_WIDTH / 2,
        platform.y - SONIC_FOOT_OFFSET - 95,
      ),
    );
  }

  addPlatform({
    sprite: "sky-large-platform",
    x: 650,
    y: SUMMIT_PLATFORM_Y,
    scale: LARGE_PLATFORM_SCALE,
    width: LARGE_PLATFORM_WIDTH,
  });

  addPlatform({
    sprite: "sky-short-platform",
    x: 170,
    y: ARENA_UPPER_PLATFORM_Y,
    scale: SHORT_PLATFORM_SCALE,
    width: SHORT_PLATFORM_WIDTH,
  });

  addPlatform({
    sprite: "sky-short-platform",
    x: k.width() - 170 - SHORT_PLATFORM_WIDTH,
    y: ARENA_UPPER_PLATFORM_Y,
    scale: SHORT_PLATFORM_SCALE,
    width: SHORT_PLATFORM_WIDTH,
  });

  const goalY = SUMMIT_PLATFORM_Y - SONIC_FOOT_OFFSET - 78;
  const boss = makeStormFalcon(k.vec2(1190, BOSS_Y));
  let goalSpawned = false;

  const spawnExit = () => {
    if (goalSpawned) return;
    goalSpawned = true;
    k.add([
      k.circle(58),
      k.pos(950, goalY),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(255, 225, 55)),
      k.outline(12, k.rgb(55, 150, 255)),
      k.opacity(0.82),
      k.z(3),
      "sky-goal",
    ]);
    k.add([
      k.text("EXIT", { font: "mania", size: 28 }),
      k.pos(950, goalY),
      k.anchor("center"),
      k.color(k.rgb(255, 255, 255)),
      k.outline(4, k.rgb(10, 28, 56)),
      k.z(4),
    ]);
  };

  const sonic = makeSonic(k.vec2(250, 700), 1500);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward({ speed: 560 });

  const resetCamera = () => k.camPos(k.center());

  const loseStage = (reason = "Sonic fell below the floating islands.") => {
    if (!stageActive) return;
    stageActive = false;
    sonic.isDead = true;
    music.stop();
    saveBestScore(score);
    resetCamera();
    k.go("game-over", {
      retryScene: "levelThree",
      stageName: "Sky Patrol",
      score,
      reason,
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: () =>
      loseStage("The Storm Falcon and its flock knocked Sonic out of the clouds."),
  });

  const updateBossHud = () => {
    summitText.text = `STORM FALCON  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };

  const spawnStormImpact = (position) => {
    k.add([
      k.sprite("storm-falcon-attacks", { anim: "impact" }),
      k.pos(position),
      k.anchor("center"),
      k.scale(0.42),
      k.opacity(1),
      k.z(8),
      k.lifespan(0.38),
    ]);
  };

  const fireStormAttack = (attackType, verticalOffset = 0) => {
    if (!stageActive || !bossActive || bossDefeated || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(bossDirection * 150, 35));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= BOSS_RAGE_HEALTH ? 820 : 690;
    const attackAngle = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
    const attack = k.add([
      k.sprite("storm-falcon-attacks", { anim: attackType }),
      k.pos(origin),
      k.anchor("center"),
      k.scale(0.34),
      k.rotate(attackAngle),
      k.area({ shape: new k.Circle(k.vec2(0), 68) }),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      {
        showStormImpact: true,
        velocity: k.vec2((dx / length) * speed, (dy / length) * speed),
      },
    ]);
    attack.flipX = dx > 0;
    attack.onUpdate(() => attack.move(attack.velocity));
  };

  const defeatBoss = () => {
    bossDefeated = true;
    bossActive = false;
    k.destroyAll("hazard");
    score += 2500;
    scoreText.text = `SCORE  ${score}`;
    summitText.text = "STORM FALCON DEFEATED";
    boss.opacity = 0.15;
    k.play("destroy", { volume: 0.7 });

    k.wait(0.45, () => {
      if (boss.exists()) k.destroy(boss);
      spawnExit();
    });
  };

  const hitBoss = () => {
    if (!bossActive || bossInvulnerable || bossDefeated) return;
    bossInvulnerable = true;
    bossHealth -= 1;
    score += 500;
    scoreText.text = `SCORE  ${score}`;
    updateBossHud();
    boss.playHit();
    sonic.bounce();
    k.play("destroy", { volume: 0.55 });

    if (bossHealth <= 0) {
      defeatBoss();
      return;
    }

    k.wait(0.7, () => {
      if (!stageActive || !boss.exists()) return;
      bossInvulnerable = false;
      boss.recover();
    });
  };

  const fireFeather = (bird) => {
    if (!stageActive || !bird.exists() || playerHealth.isDead()) return;
    const dx = sonic.pos.x - bird.pos.x;
    const dy = sonic.pos.y - bird.pos.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = 610;
    const feather = k.add([
      k.circle(18),
      k.pos(bird.pos),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(35, 35, 68)),
      k.outline(6, k.rgb(160, 210, 255)),
      k.opacity(1),
      k.z(4),
      k.lifespan(6),
      "hazard",
      { velocity: k.vec2((dx / length) * speed, (dy / length) * speed) },
    ]);
    feather.onUpdate(() => feather.move(feather.velocity));
  };

  birdRoute.forEach((route, index) => {
    const bird = makeSkyBird(k.vec2(route.x, route.y));
    bird.patrolDirection = index % 2 === 0 ? 1 : -1;
    bird.shotTimer = 1.2 + index * 0.25;

    bird.onUpdate(() => {
      if (!stageActive || bird.defeated) return;

      bird.move(bird.patrolDirection * 125, 0);
      if (bird.pos.x <= route.minX) bird.patrolDirection = 1;
      else if (bird.pos.x >= route.maxX) bird.patrolDirection = -1;

      if (Math.abs(bird.pos.y - sonic.pos.y) > 620) return;
      bird.shotTimer -= k.dt();
      if (bird.shotTimer <= 0) {
        fireFeather(bird);
        bird.shotTimer = 2.15;
      }
    });
  });

  sonic.onCollide("enemy", (enemy) => {
    if (!stageActive || playerHealth.isDead() || enemy.defeated) return;

    if (sonic.isAttacking()) {
      enemy.defeated = true;
      enemy.playHit?.();
      sonic.bounce();
      k.play("destroy", { volume: 0.5 });
      score += 250;
      scoreText.text = `SCORE  ${score}`;
      k.wait(0.12, () => {
        if (enemy.exists()) k.destroy(enemy);
      });
      return;
    }

    playerHealth.damage(enemy.pos.x);
  });

  sonic.onCollide("hazard", (hazard) => {
    if (!stageActive || playerHealth.isDead()) return;
    const sourceX = hazard.pos.x;
    if (hazard.showStormImpact) spawnStormImpact(hazard.pos.clone());
    if (hazard.exists()) k.destroy(hazard);
    playerHealth.damage(sourceX);
  });

  sonic.onCollide("sky-boss", () => {
    if (!stageActive || !bossActive || playerHealth.isDead()) return;
    if (sonic.isAttacking()) hitBoss();
    else playerHealth.damage(boss.pos.x);
  });

  sonic.onCollide("falling-platform", (platform) => {
    if (!stageActive || platform.armed) return;
    platform.armed = true;

    k.wait(0.85, () => {
      if (!stageActive || !platform.exists()) return;
      platform.dropping = true;
      platform.visual.opacity = 1;
    });
  });

  sonic.onCollide("ring", (ring) => {
    if (!stageActive || !ring.exists()) return;
    k.destroy(ring);
    k.play("ring", { volume: 0.45 });
    rings += 1;
    score += 10;
    scoreText.text = `SCORE  ${score}`;
    ringText.text = `RINGS  ${rings}`;
  });

  sonic.onCollide("sky-goal", () => {
    if (!stageActive) return;
    stageActive = false;
    music.stop();
    k.destroyAll("hazard");
    score += rings * 25;
    saveBestScore(score);
    unlockStage(4);
    resetCamera();
    k.go("victory", {
      title: "SKY PATROL CLEAR!",
      message: `Frozen Glacier Valley unlocked • Ring bonus: ${rings * 25}`,
      score,
      nextScene: "levelFourFinal",
    });
  });

  k.onUpdate(() => {
    if (!stageActive) return;

    cameraY = Math.max(
      ARENA_CAMERA_Y,
      Math.min(cameraY, sonic.pos.y - 150),
    );
    k.camPos(960, cameraY);

    if (!bossActive && !bossDefeated) {
      const climbed = k.clamp(START_PLATFORM_Y - sonic.pos.y, 0, SUMMIT_DISTANCE);
      summitText.text = `SUMMIT  ${Math.ceil(SUMMIT_DISTANCE - climbed)}m`;
    }

    if (!bossActive && !bossDefeated && sonic.pos.y < BOSS_TRIGGER_Y) {
      bossActive = true;
      updateBossHud();
    }

    if (bossActive && !playerHealth.isDead()) {
      bossAttackTimer -= k.dt();
      const bossSpeed = bossHealth <= BOSS_RAGE_HEALTH ? 245 : 175;
      boss.move(bossDirection * bossSpeed, 0);
      boss.pos.y = Math.min(
        BOSS_Y + Math.sin(k.time() * 2.8) * 45,
        BOSS_LOWEST_Y,
      );

      if (boss.pos.x < BOSS_LEFT_BOUND) {
        boss.pos.x = BOSS_LEFT_BOUND;
        bossDirection = 1;
      } else if (boss.pos.x > BOSS_RIGHT_BOUND) {
        boss.pos.x = BOSS_RIGHT_BOUND;
        bossDirection = -1;
      }
      boss.flipX = sonic.pos.x > boss.pos.x;

      if (bossAttackTimer <= 0) {
        bossDirection = sonic.pos.x < boss.pos.x ? -1 : 1;
        const attackType = bossAttackPattern % 2 === 0 ? "energy" : "missile";
        bossAttackPattern += 1;
        fireStormAttack(attackType);
        if (bossHealth <= BOSS_RAGE_HEALTH) {
          k.wait(0.28, () => fireStormAttack(attackType, -115));
        }
        bossAttackTimer = bossHealth <= BOSS_RAGE_HEALTH ? 1.3 : 1.9;
      }
    }

    if (sonic.pos.y > cameraY + 760) loseStage();
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      resetCamera();
      k.go("level-select");
    },
  });
}
