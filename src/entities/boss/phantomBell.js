import { k } from "../../kaplayCtx";

export function makePhantomBell(pos) {
  return k.add([
    k.sprite("phantom-bell-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.34),
    k.area({ shape: new k.Rect(k.vec2(-520, -350), 1040, 700) }),
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
