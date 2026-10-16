import { k } from "../../kaplayCtx";

function makeUnderwaterHazard(animation, pos, scale, hitbox) {
  return k.add([
    k.sprite("abyssfang-attacks", { anim: animation }),
    k.pos(pos),
    k.anchor("center"),
    k.scale(scale),
    k.area({
      shape: new k.Rect(
        k.vec2(hitbox.x, hitbox.y),
        hitbox.width,
        hitbox.height,
      ),
    }),
    k.opacity(1),
    k.z(5),
    k.offscreen(),
    "enemy",
    "underwater-hazard",
    {
      playHit() {
        this.opacity = 0.3;
      },
    },
  ]);
}

export function makeHydroVortex(pos) {
  return makeUnderwaterHazard("vortex", pos, 0.38, {
    x: -112,
    y: -92,
    width: 224,
    height: 184,
  });
}

export function makeHydroTorpedo(pos) {
  return makeUnderwaterHazard("torpedo", pos, 0.4, {
    x: -125,
    y: -70,
    width: 250,
    height: 140,
  });
}
