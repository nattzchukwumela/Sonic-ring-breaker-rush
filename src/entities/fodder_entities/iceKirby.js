import { k } from "../../kaplayCtx";

export function makeIceKirby(pos) {
  return k.add([
    k.sprite("ice-kirby"),
    k.scale(3.2),
    k.area({ shape: new k.Rect(k.vec2(-12, -18), 24, 36) }),
    k.anchor("center"),
    k.pos(pos),
    k.opacity(1),
    k.offscreen(),
    "enemy",
    "ice-enemy",
    {
      playHit() {
        this.opacity = 0.45;
      },
    },
  ]);
}
