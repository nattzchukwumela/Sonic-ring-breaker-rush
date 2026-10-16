import { makeVoltitan } from "../entities/boss/voltitan";
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

export function ChemicalBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.4;
  let chargeTimer = 0;
  let direction = -1;
  let attackPattern = 0;

  k.setGravity(3100);
  const music = k.play("chemical-rush", { loop: true, volume: 0.36 });

  k.add([
    k.sprite("chemical-bg"),
    k.pos(0, 0),
    k.opacity(0.92),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height() - 875),
    k.pos(0, 875),
    k.color(k.rgb(22, 56, 88)),
    k.z(-3),
  ]);
  for (const x of [0, 1920]) {
    k.add([
      k.sprite("platform"),
      k.pos(x, 760),
      k.scale(1.5),
      k.z(-1),
    ]);
  }
  k.add([
    k.rect(k.width(), 18),
    k.pos(0, 875),
    k.color(k.rgb(64, 238, 255)),
    k.z(-2),
  ]);
  addGround(875 - SONIC_FOOT_OFFSET);

  const healthText = addHudText("", k.vec2(34, 28), {
    color: k.rgb(255, 220, 48),
  });
  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 82));
  const bossText = addHudText("", k.vec2(1880, 28), {
    anchor: "topright",
    color: k.rgb(88, 235, 255),
  });
  addHudText(
    "A / D  MOVE     SPACE / ↑  DOUBLE JUMP     ↓  SPIN",
    k.vec2(960, 1030),
    { size: 30, anchor: "bot" },
  );

  const updateBossHud = () => {
    bossText.text = `VOLTITAN  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 760), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeVoltitan(k.vec2(1500, 650));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "chemicalBoss",
      retryData: { score, rings },
      stageName: "Voltitan's Chemical Core",
      score,
      reason: "Voltitan overloaded Sonic's run.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const spawnImpact = (position) => {
    k.add([
      k.sprite("voltitan-attacks", { anim: "impact" }),
      k.pos(position),
      k.anchor("center"),
      k.scale(0.34),
      k.z(8),
      k.lifespan(0.38),
    ]);
  };

  const addHazard = ({ animation, position, velocity, scale = 0.31 }) => {
    const hazard = k.add([
      k.sprite("voltitan-attacks", { anim: animation }),
      k.pos(position),
      k.anchor("center"),
      k.scale(scale),
      k.rotate(0),
      k.area({ shape: new k.Rect(k.vec2(-76, -76), 152, 152) }),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      { showImpact: true, velocity },
    ]);
    hazard.flipX = velocity.x > 0;
    hazard.onUpdate(() => hazard.move(hazard.velocity));
    return hazard;
  };

  const fireEnergyOrb = (verticalOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 175, -75));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= BOSS_RAGE_HEALTH ? 870 : 710;
    const hazard = addHazard({
      animation: "energy",
      position: origin,
      velocity: k.vec2((dx / length) * speed, (dy / length) * speed),
    });
    hazard.angle = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
  };

  const fireGroundSurge = (delay = 0) => {
    k.wait(delay, () => {
      if (!battleActive || !boss.exists()) return;
      const travelDirection = sonic.pos.x < boss.pos.x ? -1 : 1;
      addHazard({
        animation: "surge",
        position: k.vec2(boss.pos.x + travelDirection * 150, 790),
        velocity: k.vec2(
          travelDirection * (bossHealth <= BOSS_RAGE_HEALTH ? 920 : 760),
          0,
        ),
        scale: 0.36,
      });
    });
  };

  sonic.onCollide("hazard", (hazard) => {
    if (!battleActive) return;
    const sourceX = hazard.pos.x;
    if (hazard.showImpact) spawnImpact(hazard.pos.clone());
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
    unlockStage(3);

    addHudText("VOLTITAN DEFEATED!", k.vec2(960, 325), {
      font: "nise-sega-font",
      size: 72,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "FACTORY SHUT DOWN!",
        message: `Sky Patrol unlocked • Ring bonus: ${rings * 25}`,
        score,
        nextScene: "levelThree",
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
        ? 590
        : bossHealth <= BOSS_RAGE_HEALTH
          ? 235
          : 165;
    boss.move(direction * speed, 0);

    if (boss.pos.x < 850) {
      boss.pos.x = 850;
      direction = 1;
    } else if (boss.pos.x > 1640) {
      boss.pos.x = 1640;
      direction = -1;
    }

    if (attackTimer <= 0) {
      direction = sonic.pos.x < boss.pos.x ? -1 : 1;
      chargeTimer = 0.65;

      if (attackPattern % 2 === 0) {
        fireEnergyOrb();
        if (bossHealth <= BOSS_RAGE_HEALTH) {
          k.wait(0.28, () => fireEnergyOrb(-115));
          k.wait(0.52, () => fireEnergyOrb(95));
        }
      } else {
        fireGroundSurge();
        if (bossHealth <= BOSS_RAGE_HEALTH) fireGroundSurge(0.42);
      }

      attackPattern += 1;
      attackTimer = bossHealth <= BOSS_RAGE_HEALTH ? 1.45 : 2.05;
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
