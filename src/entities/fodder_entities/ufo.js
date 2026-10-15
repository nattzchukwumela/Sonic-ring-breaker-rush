import { k } from "../../kaplayCtx";

export function makeUfo(pos) {
  return k.add([
    k.sprite("ufo-enemy"),
    k.scale(0.25),
    k.area({ shape: new k.Rect(k.vec2(-245, -165), 490, 315) }),
    k.anchor("center"),
    k.pos(pos),
    k.opacity(1),
    k.offscreen(),
    "enemy",
    "flying-enemy",
    {
      playHit() {
        this.opacity = 0.45;
      },
    },
  ]);
}
