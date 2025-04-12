import { makeBlueMonster } from "../entities/blue-monster";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";
import { k } from "../kaplayCtx";

export function LevelOne() {
  // Score management
  let score = 0;
  let scoreMultiplier = 0;
  const scoreText = k.add([
    k.text("SCORE: 0", { font: "mania", size: 80 }),
    k.pos(20, 20),
  ]);

  // Game physics
  k.setGravity(3100);
  let gameSpeed = 0;

  // Background setup
  const bgPieceWidth = 2304;
  const bgPieces = [
    k.add([k.sprite("forest-bg"), k.pos(0, 0), k.scale(1), k.opacity(0.8)]),
    k.add([
      k.sprite("forest-bg"),
      k.pos(1920 * 2, 0),
      k.scale(2),
      k.opacity(0.8),
    ]),
  ];

  // Platform configuration
  const platformWidth = 1310;
  const scale = 1.2;
  const yAxisPosition = 540;
  const scaledPlatformWidth = platformWidth * scale;
  const platforms = [
    k.add([k.sprite("grass-planes"), k.pos(0, yAxisPosition), k.scale(scale)]),
    k.add([
      k.sprite("grass-planes"),
      k.pos(platformWidth, yAxisPosition),
      k.scale(scale),
    ]),
    k.add([
      k.sprite("grass-planes"),
      k.pos(platformWidth, yAxisPosition),
      k.scale(scale),
    ]),
  ];

  // Initialize Sonic character
  const sonic = makeSonic(k.vec2(200, 750));
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();

  // Rolling state tracking
  let isSonicRolling = false;
  k.onKeyPress("down", () => {
    isSonicRolling = true;
  });

  // Collision handlers
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      // Jump attack collision
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
      // Roll attack collision
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

    // Hurt collision (no attack)
    k.play("hurt", { volume: 0.5 });
  });

  sonic.onCollide("ring", (ring) => {
    // Collect ring
    k.play("hyper-ring", { volume: 0.5 });
    k.destroy(ring);
    score++;
    scoreText.text = `SCORE: ${score}`;
  });

  // Enemy spawning system
  const spawnBlueMonster = () => {
    const monster = makeBlueMonster(k.vec2(1950, 815));

    monster.onUpdate(() => {
      const moveSpeed = gameSpeed < 3000 ? -(gameSpeed + 300) : -gameSpeed;
      monster.move(moveSpeed, 0);
      // monster.setEvents();
    });

    monster.onExitScreen(() => {
      if (monster.pos.x < 0) {
        k.destroy(monster);
      }
      return monster;
    });

    const waitTime = k.rand(0.5, 2.5);
    k.wait(waitTime, spawnBlueMonster);
  };

  // Ring spawning system
  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 815));

    ring.onUpdate(() => {
      if (gameSpeed < 3000) {
        ring.move(-(gameSpeed + 300), 0);
      }
    });

    ring.onExitScreen(() => {
      if (ring.pos.x < 0) k.destroy(ring);
    });

    const waitTime = k.rand(0.5, 3);
    k.wait(waitTime, spawnRing);
  };

  // Start spawning enemies and rings
  spawnBlueMonster();
  spawnRing();

  // Speed progression
  k.loop(1, () => {
    if (gameSpeed <= 3000) {
      gameSpeed += 20;
    }
  });

  // Ground collision
  k.add([
    k.rect(1920, 200),
    k.opacity(0),
    k.area(),
    k.pos(0, 880),
    k.body({ isStatic: true }),
  ]);

  // Game update loop - handles parallax scrolling
  k.onUpdate(() => {
    // Background parallax
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }
    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    // Platform scrolling
    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(
        platforms[1].pos.x + platforms[1].width,
        yAxisPosition,
      );
      platforms.push(platforms.shift());
    }

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(
      platforms[0].pos.x + scaledPlatformWidth,
      yAxisPosition,
    );
    platforms[1].move(-gameSpeed, 0);
    platforms[2].moveTo(
      platforms[1].pos.x + scaledPlatformWidth,
      yAxisPosition,
    );
  });
}
