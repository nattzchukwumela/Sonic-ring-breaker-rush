import { k } from "../../kaplayCtx";

export function makeShroomDoom(pos) {
  const shroomdoom = k.add([
    k.sprite("shroomdoom_one", { anim: "idle" }),
    k.scale(8),
    k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(),
    "enemy",
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
