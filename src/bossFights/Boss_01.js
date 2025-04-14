import { makeShroomDoom } from "../entities/boss/shroomdoom";
import { makeSonic } from "../entities/sonic";
import { k } from "../kaplayCtx";

export function BossLevelOne() {
  let bossLive = 0;

  k.setGravity(3100);

  const bossLiveText = k.add([
    k.text("ShroomDooom: 0", { font: "nise-sega-font", size: 30 }),
    k.color(k.rgb(255, 255, 255)),
    k.pos(1560, 20),
    k.z(2),
  ]);
  const SonicLiveText = k.add([
    k.text("Sonic: 0", { font: "nise-sega-font", size: 30 }),
    k.color(k.rgb(255, 255, 255)),
    k.pos(20, 20),
    k.z(2),
  ]);

  k.add([
    k.sprite("shroomdoom_bg"),
    k.pos(k.center().x, k.center().y),
    k.scale(1, 1),
    k.anchor("center"),
    k.opacity(0.8),
  ]);
}
