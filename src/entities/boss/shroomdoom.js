import { k } from "../../kaplayCtx";

export function makeShroomDoom(pos) {
  const shroomdoom = k.add([
    k.sprite("shroomdoom_one", { anim: "idle" }),
    k.scale(6),
    k.area({ shape: new k.Rect(k.vec2(-14, -38), 28, 62) }),
    k.anchor("center"),
    k.pos(pos),
    k.opacity(1),
    k.z(5),
    "enemy",
    "boss",
    {
      playHit() {
        this.play("hit");
      },
      setEvent() {
        this.play("idle");
      },
    },
  ]);

  return shroomdoom;
}
