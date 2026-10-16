import { k } from "../../kaplayCtx";

export function makeMagmaclaw(pos) {
  return k.add([
    k.sprite("magmaclaw-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.36),
    k.area({ shape: new k.Rect(k.vec2(-550, -350), 1100, 700) }),
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
