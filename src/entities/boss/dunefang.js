import { k } from "../../kaplayCtx";

export function makeDunefang(pos) {
  return k.add([
    k.sprite("dunefang-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.38),
    k.area({ shape: new k.Rect(k.vec2(-460, -310), 920, 620) }),
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
