import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";
import { makeSonic } from "../entities/sonic";
import { k } from "../kaplayCtx";

export function game() {
  k.setGravity(3100);
  k.play("ingame-sound", { volume: 0.5 });

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
    k.add([
      k.sprite("platform"),
      k.pos(platformWidth, 567),
      k.scale(3.2),
      // k.area(),
    ]),
  ];

  const sonic = makeSonic(k.vec2(200, 750));
  sonic.setControls();
  sonic.setEvents();
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      return;
    }
    k.play("hurt", { volume: 0.5 });
  });

  sonic.onCollide("ring", (ring) => {
    if (!sonic.isGrounded() || sonic.isGrounded()) {
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(ring);
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

  spawnMotoBug();

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
    gameSpeed += 50;
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
