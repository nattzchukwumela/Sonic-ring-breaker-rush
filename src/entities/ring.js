import { k } from "../kaplayCtx";
export function makeRing(pos) {
  return k.add([
    k.sprite("ring", { anim: "spin" }),
    k.area({ shape: new k.Rect(k.vec2(-14, -14), 28, 28) }),
    k.anchor("center"),
    k.pos(pos),
    k.scale(4),
    k.offscreen(),
    "ring",
  ]);
}
