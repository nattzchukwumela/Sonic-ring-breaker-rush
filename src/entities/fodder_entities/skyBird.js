import { k } from "../../kaplayCtx";

export function makeSkyBird(pos) {
  return k.add([
    k.sprite("sky-bird", { anim: "fly" }),
    k.pos(pos),
    k.anchor("center"),
    k.scale(2),
    k.area({ shape: new k.Rect(k.vec2(-21, -18), 42, 36) }),
    k.opacity(1),
    k.z(5),
    "enemy",
    "sky-bird",
    {
      defeated: false,
      playHit() {
        this.opacity = 0.35;
      },
    },
  ]);
}
