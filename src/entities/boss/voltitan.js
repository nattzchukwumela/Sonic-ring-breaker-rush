import { k } from "../../kaplayCtx";

export function makeVoltitan(pos) {
  return k.add([
    k.sprite("voltitan-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.36),
    k.area({ shape: new k.Rect(k.vec2(-470, -520), 940, 1040) }),
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
