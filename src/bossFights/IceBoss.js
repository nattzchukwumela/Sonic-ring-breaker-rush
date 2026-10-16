import { makeFrostmaw } from "../entities/boss/frostmaw";
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

export function IceBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.5;
  let chargeTimer = 0;
  let direction = -1;
  let attackPattern = 0;

  k.setGravity(3100);
  const music = k.play("ice-boss", { loop: true, volume: 0.36 });

  k.add([
    k.sprite("ice-cap-boss-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(6),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height() - 840),
    k.pos(0, 840),
    k.color(k.rgb(18, 45, 78)),
    k.z(-3),
  ]);
  const icePlatformWidth = 259 * 3;
  for (let x = 0; x < k.width() + icePlatformWidth; x += icePlatformWidth) {
    k.add([
      k.sprite("ice-boss-platform"),
      k.pos(x, 840),
      k.scale(3),
      k.z(-1),
    ]);
  }
  addGround(840 - SONIC_FOOT_OFFSET);

  const healthText = addHudText("", k.vec2(34, 28), {
    color: k.rgb(255, 220, 48),
  });
  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 82));
  const bossText = addHudText("", k.vec2(1880, 28), {
    anchor: "topright",
    color: k.rgb(130, 235, 255),
  });
  addHudText("A / D  MOVE     SPACE / ↑  DOUBLE JUMP     ↓  SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const updateBossHud = () => {
    bossText.text = `FROSTMAW  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 720), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeFrostmaw(k.vec2(1510, 670));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "iceBoss",
      retryData: { score, rings },
      stageName: "Frostmaw's Glacier",
      score,
      reason: "Frostmaw froze Sonic's run.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const spawnFrostImpact = (position) => {
    k.add([
      k.sprite("frostmaw-attacks", { anim: "impact" }),
      k.pos(position),
      k.anchor("center"),
      k.scale(0.42),
      k.opacity(1),
      k.z(8),
      k.lifespan(0.38),
    ]);
  };

  const fireFrostmawAttack = (attackType, verticalOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 125, -55));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= BOSS_RAGE_HEALTH ? 830 : 680;
    const attackAngle = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
    const attack = k.add([
      k.sprite("frostmaw-attacks", { anim: attackType }),
      k.pos(origin),
      k.anchor("center"),
      k.scale(0.34),
      k.rotate(attackAngle),
      k.area({ shape: new k.Rect(k.vec2(-74, -74), 148, 148) }),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      {
        showFrostImpact: true,
        velocity: k.vec2((dx / length) * speed, (dy / length) * speed),
      },
    ]);
    attack.flipX = dx > 0;
    attack.onUpdate(() => attack.move(attack.velocity));
  };

  sonic.onCollide("hazard", (hazard) => {
    if (!battleActive) return;
    const sourceX = hazard.pos.x;
    if (hazard.showFrostImpact) spawnFrostImpact(hazard.pos.clone());
    if (hazard.exists()) k.destroy(hazard);
    playerHealth.damage(sourceX);
  });

  const defeatBoss = () => {
    battleActive = false;
    music.stop();
    k.destroyAll("hazard");
    boss.opacity = 0.22;
    score += 3000 + rings * 25;
    scoreText.text = `SCORE  ${score}`;
    saveBestScore(score);
    unlockStage(5);

    addHudText("FROSTMAW DEFEATED!", k.vec2(960, 325), {
      font: "nise-sega-font",
      size: 72,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "GLACIER LIBERATED!",
        message: `Demon Dunes unlocked • Ring bonus: ${rings * 25}`,
        score,
        nextScene: "levelFive",
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
        ? 620
        : bossHealth <= BOSS_RAGE_HEALTH
          ? 260
          : 180;
    boss.move(direction * speed, 0);

    if (boss.pos.x < 760) {
      boss.pos.x = 760;
      direction = 1;
    } else if (boss.pos.x > 1630) {
      boss.pos.x = 1630;
      direction = -1;
    }

    if (attackTimer <= 0) {
      direction = sonic.pos.x < boss.pos.x ? -1 : 1;
      chargeTimer = 0.68;
      const attackType = attackPattern % 2 === 0 ? "shard" : "orb";
      attackPattern += 1;
      fireFrostmawAttack(attackType);
      if (bossHealth <= BOSS_RAGE_HEALTH) {
        k.wait(0.24, () => fireFrostmawAttack(attackType, -115));
        k.wait(0.48, () => fireFrostmawAttack(attackType, 90));
      }
      attackTimer = bossHealth <= BOSS_RAGE_HEALTH ? 1.5 : 2.15;
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
