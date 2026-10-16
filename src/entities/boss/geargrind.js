import { k } from "../../kaplayCtx";

export function makeGeargrind(pos) {
  return k.add([
    k.sprite("geargrind-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.34),
    k.area({ shape: new k.Rect(k.vec2(-560, -400), 1120, 800) }),
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
