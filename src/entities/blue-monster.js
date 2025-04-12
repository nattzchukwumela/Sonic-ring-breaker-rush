import { k } from "../kaplayCtx";

export function makeBlueMonster(pos) {
  const blueMonster = k.add([
    k.sprite("blue-monster", { anim: "idle" }),
    k.scale(0.8),
    k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(),
    "enemy",
    // {
    //   setEvents() {
    //     play("idle");
    //   },
    // },
  ]);

  return blueMonster;
}
