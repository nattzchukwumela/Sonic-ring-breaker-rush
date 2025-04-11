import { k } from "../kaplayCtx";

export function makeBlueMonster(pos) {
  const blueMonster = k.add([
    k.sprite("blue-monster"),
    k.scale(0.2),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(),
    "enemy",
  ]);

  return blueMonster;
}
