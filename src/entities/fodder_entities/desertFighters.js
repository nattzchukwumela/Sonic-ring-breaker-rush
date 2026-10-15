import { k } from "../../kaplayCtx";

function makeDesertFighter(sprite, pos, hitbox) {
  return k.add([
    k.sprite(sprite),
    k.pos(pos),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(hitbox.x, hitbox.y), hitbox.w, hitbox.h) }),
    k.opacity(1),
    k.z(4),
    k.offscreen(),
    "enemy",
    "desert-fighter",
    {
      playHit() {
        this.opacity = 0.35;
      },
    },
  ]);
}

export function makeDesertHound(pos) {
  return makeDesertFighter("desert-hound", pos, {
    x: -55,
    y: -42,
    w: 110,
    h: 80,
  });
}

export function makeDesertRaider(pos) {
  return makeDesertFighter("desert-raider", pos, {
    x: -38,
    y: -52,
    w: 76,
    h: 102,
  });
}

export function makeDesertBrute(pos) {
  return makeDesertFighter("desert-brute", pos, {
    x: -44,
    y: -52,
    w: 88,
    h: 102,
  });
}
