import { makeShroomDoom } from "../entities/boss/shroomdoom";
import { makeSonic } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import { addGround, addHudText, createPlayerHealth } from "../gameplay";
import { k } from "../kaplayCtx";

const BOSS_MAX_HEALTH = 6;

export function BossLevelOne(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.6;
  let chargeTimer = 0;
  let direction = -1;

  k.setGravity(3100);
  const music = k.play("shroomdoom", { loop: true, volume: 0.38 });

  k.add([
    k.sprite("shroomdoom_bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(0.82),
    k.z(-10),
  ]);

  const floorScale = 3.45;
  for (let x = 0; x < 1920; x += 220) {
    k.add([
      k.sprite("forest_middle_platform"),
      k.pos(x, 875),
      k.scale(floorScale, 3),
      k.opacity(1),
      k.z(-1),
    ]);
  }
  addGround(875);

  const addFloatingPlatform = (x, y) => {
    k.add([
      k.sprite("forest_upfrontHalfLeft_platform"),
      k.scale(3),
      k.pos(x, y),
      k.opacity(1),
      k.z(0),
    ]);
    k.add([
      k.sprite("forest_upfrontHalfRight_platform"),
      k.scale(3),
      k.pos(x + 190, y),
      k.opacity(1),
      k.z(0),
    ]);
    k.add([
      k.rect(390, 24),
      k.pos(x, y + 20),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "platform",
    ]);
  };

  addFloatingPlatform(45, 500);
  addFloatingPlatform(1485, 500);

  const healthText = addHudText("", k.vec2(34, 28), {
    color: k.rgb(255, 220, 48),
  });
  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 82));
  const bossText = addHudText("", k.vec2(1880, 28), {
    anchor: "topright",
    color: k.rgb(255, 118, 83),
  });
  addHudText("A / D  MOVE     SPACE / ↑  JUMP     ↓  SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const updateBossHud = () => {
    bossText.text = `SHROOMDOOM  ${"●".repeat(bossHealth)}${"○".repeat(
      BOSS_MAX_HEALTH - bossHealth,
    )}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(300, 760), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeShroomDoom(k.vec2(1550, 700));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "levelOneBoss",
      retryData: { score, rings },
      stageName: "Shroomdoom's Lair",
      score,
      reason: "Shroomdoom wins this round.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const spawnSpore = () => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 90, -120));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= 3 ? 720 : 600;
    const velocity = k.vec2((dx / length) * speed, (dy / length) * speed);

    const spore = k.add([
      k.circle(30),
      k.pos(origin),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(159, 235, 72)),
      k.outline(8, k.rgb(70, 40, 110)),
      k.opacity(1),
      k.z(6),
      k.lifespan(5),
      "hazard",
      { velocity },
    ]);
    spore.onUpdate(() => spore.move(spore.velocity));
  };

  sonic.onCollide("hazard", (hazard) => {
    if (!battleActive) return;
    if (hazard.exists()) k.destroy(hazard);
    playerHealth.damage(hazard.pos.x);
  });

  const defeatBoss = () => {
    battleActive = false;
    music.stop();
    k.destroyAll("hazard");
    boss.play("death");
    boss.opacity = 1;
    score += 2000;
    scoreText.text = `SCORE  ${score}`;
    saveBestScore(score);
    unlockStage(2);

    addHudText("SHROOMDOOM DEFEATED!", k.vec2(960, 350), {
      size: 78,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "FOREST SAVED!",
        message: "Chemical Rush is now unlocked.",
        score,
        nextScene: "levelFour",
      }),
    );
  };

  const hitBoss = () => {
    if (!battleActive || bossInvulnerable || bossHealth <= 0) return;
    bossInvulnerable = true;
    bossHealth -= 1;
    score += 500;
    scoreText.text = `SCORE  ${score}`;
    updateBossHud();
    k.play("destroy", { volume: 0.55 });
    boss.playHit();
    boss.opacity = 0.55;
    sonic.bounce();

    if (bossHealth <= 0) {
      defeatBoss();
      return;
    }

    k.wait(0.75, () => {
      if (!boss.exists() || !battleActive) return;
      bossInvulnerable = false;
      boss.opacity = 1;
      boss.setEvent();
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
    const speed = chargeTimer > 0 ? 560 : bossHealth <= 3 ? 220 : 150;
    boss.move(direction * speed, 0);

    if (boss.pos.x < 720) {
      boss.pos.x = 720;
      direction = 1;
    } else if (boss.pos.x > 1690) {
      boss.pos.x = 1690;
      direction = -1;
    }

    if (attackTimer <= 0) {
      direction = sonic.pos.x < boss.pos.x ? -1 : 1;
      chargeTimer = 0.65;
      spawnSpore();
      if (bossHealth <= 3) k.wait(0.28, spawnSpore);
      attackTimer = bossHealth <= 3 ? 1.45 : 2.2;
    }
  });

  k.onKeyPress("escape", () => {
    music.stop();
    k.go("level-select");
  });
}
