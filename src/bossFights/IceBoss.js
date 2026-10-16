import { makeIceKing } from "../entities/boss/iceKing";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import { addGround, addHudText, createPlayerHealth } from "../gameplay";
import { k } from "../kaplayCtx";

const BOSS_MAX_HEALTH = 8;

export function IceBoss(options = {}) {
  let score = Number(options.score ?? 0);
  const rings = Number(options.rings ?? 0);
  let bossHealth = BOSS_MAX_HEALTH;
  let bossInvulnerable = false;
  let battleActive = true;
  let attackTimer = 1.5;
  let chargeTimer = 0;
  let direction = -1;

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
  addHudText("A / D  MOVE     SPACE / ↑  JUMP     ↓  SPIN", k.vec2(960, 1030), {
    size: 30,
    anchor: "bot",
  });

  const updateBossHud = () => {
    bossText.text = `ICE KING  ${"●".repeat(bossHealth)}${"○".repeat(
      BOSS_MAX_HEALTH - bossHealth,
    )}`;
  };
  updateBossHud();

  const sonic = makeSonic(k.vec2(285, 720), 1850);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward();

  const boss = makeIceKing(k.vec2(1510, 670));

  const loseBattle = () => {
    if (!battleActive) return;
    battleActive = false;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "iceBoss",
      retryData: { score, rings },
      stageName: "Ice King's Glacier",
      score,
      reason: "The Ice King froze Sonic's run.",
    });
  };

  const playerHealth = createPlayerHealth({
    sonic,
    healthText,
    onDeath: loseBattle,
  });

  const fireIceBolt = (verticalOffset = 0) => {
    if (!battleActive || !boss.exists()) return;
    const origin = boss.pos.add(k.vec2(direction * 125, -55));
    const dx = sonic.pos.x - origin.x;
    const dy = sonic.pos.y - origin.y + verticalOffset;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = bossHealth <= 4 ? 830 : 680;
    const iceBolt = k.add([
      k.circle(25),
      k.pos(origin),
      k.anchor("center"),
      k.area(),
      k.color(k.rgb(185, 245, 255)),
      k.outline(8, k.rgb(28, 126, 245)),
      k.opacity(1),
      k.z(7),
      k.lifespan(5),
      "hazard",
      { velocity: k.vec2((dx / length) * speed, (dy / length) * speed) },
    ]);
    iceBolt.onUpdate(() => iceBolt.move(iceBolt.velocity));
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
    unlockStage(5);

    addHudText("ICE KING DEFEATED!", k.vec2(960, 325), {
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
    const speed = chargeTimer > 0 ? 620 : bossHealth <= 4 ? 260 : 180;
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
      fireIceBolt();
      if (bossHealth <= 4) {
        k.wait(0.24, () => fireIceBolt(-115));
        k.wait(0.48, () => fireIceBolt(90));
      }
      attackTimer = bossHealth <= 4 ? 1.5 : 2.15;
    }
  });

  k.onKeyPress("escape", () => {
    music.stop();
    k.go("level-select");
  });
}
