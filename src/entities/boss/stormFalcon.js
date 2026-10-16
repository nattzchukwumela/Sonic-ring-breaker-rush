import { k } from "../../kaplayCtx";

export function makeStormFalcon(pos) {
  return k.add([
    k.sprite("storm-falcon"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.34),
    k.area({ shape: new k.Rect(k.vec2(-500, -250), 1000, 500) }),
    k.opacity(1),
    k.z(6),
    "sky-boss",
    {
      playHit() {
        this.opacity = 0.28;
      },
      recover() {
        this.opacity = 1;
      },
    },
  ]);
}
