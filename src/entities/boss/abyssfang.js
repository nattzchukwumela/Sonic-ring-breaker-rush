import { k } from "../../kaplayCtx";

export function makeAbyssfang(pos) {
  return k.add([
    k.sprite("abyssfang-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.35),
    k.area({ shape: new k.Rect(k.vec2(-560, -300), 1120, 600) }),
    k.opacity(1),
    k.z(6),
    "enemy",
    "boss",
    {
      playHit() {
        this.opacity = 0.34;
      },
      recover() {
        this.opacity = 1;
      },
    },
  ]);
}
