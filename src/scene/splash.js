import { addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

const SPLASH_WIDTH = 1448;
const SPLASH_HEIGHT = 1086;
const MINIMUM_DISPLAY_TIME = 2;

export default function Splash() {
  k.setGravity(0);

  const splashScale = Math.min(
    k.width() / SPLASH_WIDTH,
    k.height() / SPLASH_HEIGHT,
  );

  k.add([
    k.sprite("intro-splash"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(splashScale),
    k.z(-10),
  ]);

  k.add([
    k.rect(k.width(), 92),
    k.pos(0, k.height() - 92),
    k.color(k.rgb(4, 12, 35)),
    k.opacity(0.76),
    k.z(10),
  ]);

  const prompt = addHudText("GET READY...", k.vec2(960, 1034), {
    size: 38,
    anchor: "center",
    color: k.rgb(255, 220, 48),
    z: 20,
  });

  let canContinue = false;

  k.wait(MINIMUM_DISPLAY_TIME, () => {
    canContinue = true;
    prompt.text = "CLICK TO CONTINUE";
  });

  k.onClick(() => {
    if (canContinue) k.go("main-menu");
  });
}
