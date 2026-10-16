import { k } from "../../kaplayCtx";

function makeSpaceEnemy(sprite, pos, hitbox) {
  return k.add([
    k.sprite(sprite),
    k.pos(pos),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(hitbox.x, hitbox.y), hitbox.w, hitbox.h) }),
    k.opacity(1),
    k.z(5),
    k.offscreen(),
    "enemy",
    "flying-enemy",
    "space-enemy",
    {
      playHit() {
        this.opacity = 0.35;
      },
    },
  ]);
}

export function makeWingedInvader(pos) {
  return makeSpaceEnemy("winged-invader", pos, {
    x: -60,
    y: -45,
    w: 120,
    h: 90,
  });
}

export function makeFlyingParasite(pos) {
  return makeSpaceEnemy("flying-parasite", pos, {
    x: -42,
    y: -38,
    w: 84,
    h: 76,
  });
}
