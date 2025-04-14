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
  const ground_platform_width = 3.45;
  function generate_plateforms() {
    k.add([
      k.sprite("forest_upfrontLeft_platform"),
      k.pos(3, 900),
      k.scale(ground_platform_width, 3),
      k.opacity(1),
      k.body({ isStatic: true }),
      k.area(),
    ]);
    for (let i = 0; i <= 6; i++) {
      k.add([
        k.sprite("forest_middle_platform"),
        k.pos(platform_position, 900),
        k.scale(ground_platform_width, 3),
        k.body({ isStatic: true }),
        k.area(),
        k.opacity(1),
      ]);
      platform_position += 220;
    }
    k.add([
      k.sprite("forest_upfrontRight_platform"),
      k.pos(1750, 900),
      k.scale(ground_platform_width, 3),
      k.body({ isStatic: true }),
      k.area(),
      k.opacity(1),
    ]);
  }

  function generateFloatingPlatform(x, y = 400) {
    k.add([
      k.sprite("forest_upfrontHalfLeft_platform"),
      k.scale(3),
      k.pos(x, y),
      k.opacity(1),
      k.area(),
      k.z(1),
      "oneway",
    ]);

    k.add([
      k.sprite("forest_upfrontHalfRight_platform"),
      k.scale(3),
      k.pos(x + 190, y),
      k.opacity(1),
      k.area(),
      k.z(1),
      "oneway",
    ]);
  }

  generateFloatingPlatform(30);
  generateFloatingPlatform(1510);
  generate_plateforms();

  function makeGroundCollision() {
    k.add([
      k.rect(1920, 200),
      k.opacity(0),
      k.area(),
      k.pos(0, 880),
      k.body({ isStatic: true }),
    ]);
  }

  const sonic = makeSonic(k.vec2(350, 750), 2000);
  sonic.setJump();
  sonic.setEvents();
  sonic.setMoveForward();
  sonic.setRoll();

  // k.onUpdate(() => {
  //   k.get("oneway").forEach((plat) => {
  //     const platTop = plat.pos.y;
  //     const sonicFeet = sonic.pos.y + sonic.height / 2;

  //     // If Sonic is falling and above the platform
  //     if (sonic.vel.y >= 0 && sonicFeet < platTop + 10) {
  //       if (!plat.isStatic) {
  //         plat.use(k.body({ isStatic: true }));
  //       }
  //     } else {
  //       // Disable the collider if Sonic is below or jumping
  //       if (plat.isStatic) {
  //         plat.use(
  //           k.body({ isStatic: true, collisionFilter: { ignored: true } }),
  //         );
  //         plat.removeTag("body"); // This disables collision
  //       }
  //     }
  //   });
  // });
}
