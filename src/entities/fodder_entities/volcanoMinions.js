import { k } from "../../kaplayCtx";

function makeVolcanoMinion(frame, pos, scale, hitbox, tags = []) {
  return k.add([
    k.sprite("volcano-minions", { frame }),
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
    "volcano-minion",
    ...tags,
    {
      playHit() {
        this.opacity = 0.3;
      },
    },
  ]);
}

export function makeMagmaCrab(pos) {
  return makeVolcanoMinion(
    0,
    pos.add(k.vec2(0, -36)),
    0.25,
    { x: -285, y: -205, width: 570, height: 410 },
    ["ground-minion"],
  );
}

export function makeLavaBat(pos) {
  return makeVolcanoMinion(
    1,
    pos,
    0.23,
    { x: -245, y: -215, width: 490, height: 430 },
    ["flying-enemy"],
  );
}

export function makeMagmaBoulder(pos) {
  return makeVolcanoMinion(
    2,
    pos.add(k.vec2(0, -32)),
    0.23,
    { x: -245, y: -245, width: 490, height: 490 },
    ["ground-minion"],
  );
}
