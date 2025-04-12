import { makeBlueMonster } from "../entities/blue-monster";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";

export function LevelOne() {
  let score = 0;
  let scoreMultiplier = 0;
  const scoreText = k.add([
    k.text("SCORE : 0", { font: "mania", size: 80 }),
    k.pos(20, 20),
  ]);

  k.setGravity(3100);

  const bgPieceWidth = 1920;
  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(1920 * 2, 0),
      k.scale(2),
      k.opacity(0.8),
    ]),
  ];

  const platformWidth = 1280;
  const scaledPlatformWidth = platformWidth * 3.2;
  const platforms = [
    k.add([k.sprite("platform"), k.pos(0, 567), k.scale(3.2)]),
    k.add([k.sprite("platform"), k.pos(platformWidth, 567), k.scale(3.2)]),
  ];

  const sonic = makeSonic(k.vec2(200, 750));

  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  let isSonicRolling = false;
  k.onKeyPress("down", () => {
    isSonicRolling = true;
  });
  console.log(isSonicRolling);
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      scoreMultiplier += 1;
      score += 10 * scoreMultiplier;
      scoreText.text = `SCORE: ${score}`;
      return;
    }

    if (sonic.isGrounded() && isSonicRolling) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      scoreMultiplier += 1;
      score += 10 * scoreMultiplier;
      scoreText.text = `SCORE: ${score}`;
      setTimeout(() => {
        isSonicRolling = false;
      }, 2000);
      return;
    }
    k.play("hurt", { volume: 0.5 });
  });

  sonic.onCollide("ring", (ring) => {
    if (!sonic.isGrounded() || sonic.isGrounded()) {
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(ring);
      score++;
      scoreText.text = `SCORE: ${score}`;
      return;
    }
  });

  const spawnMotoBug = () => {
    const motobug = makeMotobug(k.vec2(1950, 815));
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }
      motobug.move(-gameSpeed, 0);
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) {
        k.destroy(motobug);
      }
    });

    const waitTime = k.rand(0.5, 2.5);
    k.wait(waitTime, spawnMotoBug);
  };

  // spawnMotoBug();

  const spawnBlueMonster = () => {
    const monster = makeBlueMonster(k.vec2(1950, 815));
    monster.onUpdate(() => {
      if (gameSpeed < 3000) {
        monster.move(-(gameSpeed + 300), 0);
        return;
      }
      monster.move(-gameSpeed, 0);
    });

    monster.onExitScreen(() => {
      if (monster.pos.x < 0) {
        k.destroy(monster);
      }
    });

    const waitTime = k.rand(0.5, 2.5);
    k.wait(waitTime, spawnBlueMonster);
  };

  spawnBlueMonster();
  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 815));
    ring.onUpdate(() => {
      if (gameSpeed < 3000) {
        ring.move(-(gameSpeed + 300), 0);
        return;
      }
    });
    ring.onExitScreen(() => {
      if (ring.pos.x < 0) k.destroy(ring);
    });

    const waitTime = k.rand(0.5, 3);

    k.wait(waitTime, spawnRing);
  };

  spawnRing();

  let gameSpeed = 0;
  k.loop(1, () => {
    if (gameSpeed <= 3000) {
      gameSpeed += 20;
    } else {
      console.log(gameSpeed);
    }
  });

  k.add([
    k.rect(1920, 200),
    k.opacity(0),
    k.area(),
    k.pos(0, 880),
    k.body({ isStatic: true }),
  ]);

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }
    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width, 567);
      platforms.push(platforms.shift());
    }
    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + scaledPlatformWidth, 567);
  });
}
