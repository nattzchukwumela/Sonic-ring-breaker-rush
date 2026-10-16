import { k } from "../../kaplayCtx";

export function makeShroomDoom(pos) {
  const shroomdoom = k.add([
    k.sprite("shroomdoom-boss"),
    k.scale(0.3),
    k.area({ shape: new k.Rect(k.vec2(-420, -500), 840, 1000) }),
    k.anchor("center"),
    k.pos(pos),
    k.opacity(1),
    k.z(5),
    "enemy",
    "boss",
    {
      playHit() {
        this.opacity = 0.55;
      },
      setEvent() {
        this.opacity = 1;
      },
      playDeath() {
        this.opacity = 0.18;
      },
    },
  ]);

  return shroomdoom;
}
