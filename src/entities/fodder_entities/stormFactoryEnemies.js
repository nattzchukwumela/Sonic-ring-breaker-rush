import { k } from "../../kaplayCtx";

export function makeSparkgear(pos) {
  return k.add([
    k.sprite("sparkgear"),
    k.pos(pos.add(k.vec2(0, -35))),
    k.anchor("center"),
    k.scale(0.15),
    k.area({ shape: new k.Rect(k.vec2(-470, -390), 940, 780) }),
    k.opacity(1),
    k.z(5),
    k.offscreen(),
    "enemy",
    "storm-factory-enemy",
    {
      playHit() {
        this.opacity = 0.3;
      },
    },
  ]);
}
