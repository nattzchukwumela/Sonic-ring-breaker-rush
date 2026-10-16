import { k } from "../../kaplayCtx";

export function makeInvaderOverlord(pos) {
  return k.add([
    k.sprite("invader-overlord"),
    k.pos(pos),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(-105, -108), 210, 216) }),
    k.opacity(1),
    k.z(6),
    "enemy",
    "boss",
    {
      playHit() {
        this.opacity = 0.3;
      },
      recover() {
        this.opacity = 1;
      },
    },
  ]);
}
