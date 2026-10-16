import { k } from "../../kaplayCtx";

export function makeWispwick(pos) {
  return k.add([
    k.sprite("wispwick"),
    k.pos(pos),
    k.anchor("center"),
    k.scale(0.15),
    k.area({ shape: new k.Rect(k.vec2(-410, -430), 820, 860) }),
    k.opacity(1),
    k.z(5),
    k.offscreen(),
    "enemy",
    "haunted-ruins-enemy",
    {
      playHit() {
        this.opacity = 0.3;
      },
    },
  ]);
}
