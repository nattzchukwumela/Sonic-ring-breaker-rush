import { k } from "../../kaplayCtx";

export function makeIceKing(pos) {
  return k.add([
    k.sprite("ice-king"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(1.45),
    k.area({ shape: new k.Rect(k.vec2(-78, -92), 156, 184) }),
    k.opacity(1),
    k.z(6),
    "enemy",
    "boss",
    {
      playHit() {
        this.opacity = 0.35;
      },
      recover() {
        this.opacity = 1;
      },
    },
  ]);
}
