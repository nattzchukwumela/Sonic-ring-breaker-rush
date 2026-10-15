import { k } from "../../kaplayCtx";

export function makeBlackheart(pos) {
  return k.add([
    k.sprite("blackheart-boss"),
    k.pos(pos),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(-175, -118), 350, 236) }),
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
