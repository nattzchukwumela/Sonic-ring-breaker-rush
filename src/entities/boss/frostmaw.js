import { k } from "../../kaplayCtx";

export function makeFrostmaw(pos) {
  return k.add([
    k.sprite("frostmaw-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.3),
    k.area({ shape: new k.Rect(k.vec2(-500, -400), 1000, 800) }),
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
