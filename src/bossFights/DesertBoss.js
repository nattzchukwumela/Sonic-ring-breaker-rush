import { makeDunefang } from "../entities/boss/dunefang";
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

export function DesertBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.5;
  let chargeTimer = 0;
  let direction = -1;

  k.setGravity(3100);
  const music = k.play("desert-boss", { loop: true, volume: 0.36 });

  k.add([
    k.sprite("desert-sunset-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(0.98),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height() - 850),
    k.pos(0, 850),
    k.color(k.rgb(113, 53, 31)),
    k.z(-3),
  ]);
  k.add([
    k.rect(k.width(), 18),
    k.pos(0, 850),
    k.color(k.rgb(249, 177, 65)),
    k.z(-2),
  ]);
  addGround(850 - SONIC_FOOT_OFFSET);

  const healthText = addHudText("", k.vec2(34, 28), {
    color: k.rgb(255, 220, 48),
  });
  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 82));
  const bossText = addHudText("", k.vec2(1880, 28), {
    anchor: "topright",
    color: k.rgb(255, 103, 64),
  });
  addHudText("A / D  MOVE     SPACE / ↑  DOUBLE JUMP     ↓  SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const updateBossHud = () => {
    bossText.text = `DUNEFANG  HP ${bossHealth} / ${BOSS_MAX_HEALTH}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 730), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeDunefang(k.vec2(1510, 650));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "desertBoss",
      retryData: { score, rings },
      stageName: "Dunefang's Dunes",
      score,
      reason: "Dunefang claimed the desert.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const spawnFireball = (angleOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 135, -60));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + angleOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= BOSS_RAGE_HEALTH ? 790 : 650;
    const fireball = k.add([
      k.circle(28),
      k.pos(origin),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(70, 10, 83)),
      k.outline(9, k.rgb(255, 94, 35)),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      { velocity: k.vec2((dx / length) * speed, (dy / length) * speed) },
    ]);
    fireball.onUpdate(() => fireball.move(fireball.velocity));
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
    boss.opacity = 0.22;
    score += 3000 + rings * 25;
    scoreText.text = `SCORE  ${score}`;
    saveBestScore(score);
    unlockStage(6);

    addHudText("DUNEFANG DEFEATED!", k.vec2(960, 325), {
      font: "nise-sega-font",
      size: 72,
      anchor: "center",
      color: k.rgb(255, 220, 48),
      z: 50,
    });

    k.wait(2.2, () =>
      k.go("victory", {
        title: "DESERT RESTORED!",
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
        ? 610
        : bossHealth <= BOSS_RAGE_HEALTH
          ? 250
          : 175;
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
      chargeTimer = 0.7;
      spawnFireball();
      if (bossHealth <= BOSS_RAGE_HEALTH) {
        k.wait(0.24, () => spawnFireball(-120));
        k.wait(0.48, () => spawnFireball(95));
      }
      attackTimer = bossHealth <= BOSS_RAGE_HEALTH ? 1.55 : 2.2;
    }
  });

  addPauseFeature({
    onExit: () => {
      music.stop();
      k.go("level-select");
    },
  });
}
