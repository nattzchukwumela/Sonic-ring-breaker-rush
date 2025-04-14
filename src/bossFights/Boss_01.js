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

  let platform_position = 220;
  function generate_plateforms() {
    k.add([
      k.sprite("forest_platform"),
      k.pos(3, 900),
      k.scale(3.5),
      k.opacity(1),
    ]);
    for (let i = 0; i <= 7; i++) {
      console.log(i);
      k.add([
        k.sprite("forest_platform"),
        k.pos(platform_position, 900),
        k.scale(3.5, 3),
        k.opacity(1),
      ]);
      platform_position += 220;
    }
    console.log(platform_position);
  }

  generate_plateforms();
}
