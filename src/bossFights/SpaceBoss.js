import { makeInvaderOverlord } from "../entities/boss/invaderOverlord";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore } from "../gameState";
import {
  addGround,
  addHudText,
  addPauseFeature,
  createPlayerHealth,
  FINAL_BOSS_MAX_HEALTH,
} from "../gameplay";
import { k } from "../kaplayCtx";

const BOSS_MAX_HEALTH = FINAL_BOSS_MAX_HEALTH;
const BOSS_RAGE_HEALTH = Math.floor(BOSS_MAX_HEALTH / 2);

export function SpaceBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.4;
  let chargeTimer = 0;
  let direction = -1;

  k.setGravity(3100);
  const music = k.play("final-boss", { loop: true, volume: 0.34 });

  k.add([
    k.sprite("space-nebula-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(1),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height() - 820),
    k.pos(0, 820),
    k.color(k.rgb(4, 7, 30)),
    k.z(-3),
  ]);
  k.add([
    k.sprite("space-platform"),
    k.pos(0, 820),
    k.z(-1),
  ]);
  addGround(820 - SONIC_FOOT_OFFSET);

  const healthText = addHudText("", k.vec2(34, 28), {
    color: k.rgb(255, 220, 48),
  });
  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 82));
  const bossText = addHudText("", k.vec2(1880, 28), {
    anchor: "topright",
    color: k.rgb(75, 238, 255),
  });
  addHudText("A / D  MOVE     SPACE / ↑  DOUBLE JUMP     ↓  SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const updateBossHud = () => {
    bossText.text = `INVADER OVERLORD  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 700), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeInvaderOverlord(k.vec2(1550, 685));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "spaceBoss",
      retryData: { score, rings },
      stageName: "Orbital Throne",
      score,
      reason: "The Invader Overlord controls the station.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const fireLaser = (verticalOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 110, -45));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= BOSS_RAGE_HEALTH ? 900 : 740;
    const laser = k.add([
      k.rect(72, 18, { radius: 9 }),
      k.pos(origin),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(75, 238, 255)),
      k.outline(6, k.rgb(145, 45, 255)),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      { velocity: k.vec2((dx / length) * speed, (dy / length) * speed) },
    ]);
    laser.onUpdate(() => laser.move(laser.velocity));
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
    score += 4000 + rings * 25;
    scoreText.text = `SCORE  ${score}`;
    saveBestScore(score);

    addHudText("OVERLORD DEFEATED!", k.vec2(960, 320), {
      font: "nise-sega-font",
      size: 72,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "GALAXY SAVED!",
        message: `All seven stages complete • Ring bonus: ${rings * 25}`,
        score,
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
        ? 660
        : bossHealth <= BOSS_RAGE_HEALTH
          ? 280
          : 190;
    boss.move(direction * speed, 0);

    if (boss.pos.x < 760) {
      boss.pos.x = 760;
      direction = 1;
    } else if (boss.pos.x > 1660) {
      boss.pos.x = 1660;
      direction = -1;
    }

    if (attackTimer <= 0) {
      direction = sonic.pos.x < boss.pos.x ? -1 : 1;
      chargeTimer = 0.62;
      fireLaser();
      if (bossHealth <= BOSS_RAGE_HEALTH) {
        k.wait(0.28, () => fireLaser(-110));
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
