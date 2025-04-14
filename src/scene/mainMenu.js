import { makeSonic } from "../entities/sonic";
import { k } from "../kaplayCtx";

export default function MainMenu() {
  if (!k.getData("best-score")) k.setData("best-score", 0);
  k.onButtonPress("jump", () => {
    k.play("ingame-sound", { volume: 0.5, loop: true });
    k.go("levelOneBoss");
  });

  // for parallax infinite scroll
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
  const platforms = [
    k.add([k.sprite("platform"), k.pos(0, 520), k.scale(3.5), k.area()]),
    k.add([
      k.sprite("platform"),
      k.pos(platformWidth, 520),
      k.scale(3.5),
      k.area(),
    ]),
  ];

  k.add([
    k.text("Sonic: Ringbreaker Rush", { font: "nise-sega-font", size: 80 }),
    k.pos(k.center().x, 200),
    k.anchor("center"),
  ]);

  k.add([
    k.text("Click anywhere to start", { font: "nise-sega-font", size: 80 }),
    k.pos(k.center().x, k.center().y - 200),
    k.anchor("center"),
  ]);

  makeSonic(k.vec2(200, 768));

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }
    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 2, 520);
      platforms.push(platforms.shift());
    }
    platforms[0].move(-3000, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 2, 520);
  });

  // game scenes;
  k.add([
    k.text("Press S to select stage", { font: "mania", size: 40 }),
    k.color(k.rgb(255, 255, 255)),
    k.pos(k.center().x, k.center().y + 150),
    k.anchor("center"),
  ]);

  k.onKeyPress("s", () => {
    k.go("level-select");
  });
}
