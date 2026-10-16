import { makePhantomBell } from "../entities/boss/phantomBell";
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

export function HauntedRuinsBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.3;
  let chargeTimer = 0;
  let direction = -1;
  let attackPattern = 0;

  k.setGravity(3100);
  const music = k.play("belfry-iron-chains", { loop: true, volume: 0.37 });

  k.add([
    k.sprite("haunted-ruins-boss-bg"),
    k.pos(0, 0),
    k.scale(1920 / 1672, 1080 / 941),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height() - GROUND_Y),
    k.pos(0, GROUND_Y),
    k.color(k.rgb(9, 7, 27)),
    k.z(-3),
  ]);
  k.add([
    k.sprite("haunted-ruins-platform"),
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
    color: k.rgb(106, 255, 210),
  });
  addHudText(
    "A / D  MOVE     SPACE / ↑  DOUBLE JUMP     ↓  SPIN",
    k.vec2(960, 1030),
    { size: 30, anchor: "bot" },
  );

  const updateBossHud = () => {
    bossText.text = `PHANTOM BELL  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 730), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const bossBaseY = 570;
  const boss = makePhantomBell(k.vec2(1510, bossBaseY));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "hauntedRuinsBoss",
      retryData: { score, rings },
      stageName: "Phantom Bell's Belfry",
      score,
      reason: "The Phantom Bell trapped Sonic in its haunted toll.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const spawnGhostImpact = (position) => {
    k.add([
      k.sprite("phantom-bell-attacks", { anim: "impact" }),
      k.pos(position),
      k.anchor("center"),
      k.scale(0.4),
      k.opacity(1),
      k.z(8),
      k.lifespan(0.42),
    ]);
  };

  const fireGhostAttack = (attackType, verticalOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 175, -30));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const rage = bossHealth <= BOSS_RAGE_HEALTH;
    const speed = attackType === "spirit" ? (rage ? 930 : 790) : rage ? 780 : 650;
    const attackAngle = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
    const halfWidth = attackType === "spirit" ? 118 : 100;
    const halfHeight = attackType === "spirit" ? 66 : 100;
    const attack = k.add([
      k.sprite("phantom-bell-attacks", { anim: attackType }),
      k.pos(origin),
      k.anchor("center"),
      k.scale(attackType === "spirit" ? 0.4 : 0.36),
      k.rotate(attackAngle),
      k.area({
        shape: new k.Rect(
          k.vec2(-halfWidth, -halfHeight),
          halfWidth * 2,
          halfHeight * 2,
        ),
      }),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      {
        showGhostImpact: true,
        velocity: k.vec2((dx / length) * speed, (dy / length) * speed),
      },
    ]);
    attack.flipX = dx > 0;
    attack.onUpdate(() => attack.move(attack.velocity));
  };

  sonic.onCollide("hazard", (hazard) => {
    if (!battleActive) return;
    const sourceX = hazard.pos.x;
    if (hazard.showGhostImpact) spawnGhostImpact(hazard.pos.clone());
    if (hazard.exists()) k.destroy(hazard);
    playerHealth.damage(sourceX);
  });

  const defeatBoss = () => {
    battleActive = false;
    music.stop();
    k.destroyAll("hazard");
    boss.opacity = 0.2;
    score += 4250 + rings * 25;
    scoreText.text = `SCORE  ${score}`;
    saveBestScore(score);
    unlockStage(10);

    addHudText("PHANTOM BELL DEFEATED!", k.vec2(960, 315), {
      font: "nise-sega-font",
      size: 68,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "THE CURSE IS BROKEN!",
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
    score += 600;
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
          ? 270
          : 185;
    boss.move(direction * speed, 0);
    boss.pos.y = bossBaseY + Math.sin(k.time() * 2.3) * 75;

    if (boss.pos.x < 820) {
      boss.pos.x = 820;
      direction = 1;
    } else if (boss.pos.x > 1640) {
      boss.pos.x = 1640;
      direction = -1;
    }

    if (attackTimer <= 0) {
      direction = sonic.pos.x < boss.pos.x ? -1 : 1;
      chargeTimer = 0.62;
      const attackType = attackPattern % 2 === 0 ? "spirit" : "portal";
      attackPattern += 1;
      fireGhostAttack(attackType);

      if (bossHealth <= BOSS_RAGE_HEALTH) {
        k.wait(0.25, () => fireGhostAttack(attackType, -115));
        k.wait(0.5, () => fireGhostAttack(attackType, 95));
      }

      attackTimer = bossHealth <= BOSS_RAGE_HEALTH ? 1.35 : 2;
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
