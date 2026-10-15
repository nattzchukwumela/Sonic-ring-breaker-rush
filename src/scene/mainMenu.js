import { makeSonic } from "../entities/sonic";
import { getBestScore } from "../gameState";
import { addActionButton, addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

export default function MainMenu() {
  k.setGravity(0);

  k.add([
    k.sprite("forest-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(0.72),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.rgb(4, 27, 74)),
    k.opacity(0.34),
    k.z(-9),
  ]);

  addHudText("SONIC", k.vec2(960, 145), {
    font: "nise-sega-font",
    size: 118,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });
  addHudText("RINGBREAKER RUSH", k.vec2(960, 265), {
    font: "nise-sega-font",
    size: 72,
    anchor: "center",
  });
  addHudText("RUN  •  SPIN  •  BREAK THE CURSE", k.vec2(960, 350), {
    size: 34,
    anchor: "center",
    color: k.rgb(192, 229, 255),
  });

  const mascot = makeSonic(k.vec2(960, 555));
  mascot.scale = k.vec2(6, 6);

  const start = () => k.go("level-select");
  addActionButton({
    label: "START RUN",
    position: k.vec2(960, 790),
    onPress: start,
  });
  addHudText("SPACE / ENTER", k.vec2(960, 865), {
    size: 30,
    anchor: "center",
    color: k.rgb(210, 231, 255),
  });
  addHudText(`BEST SCORE  ${getBestScore()}`, k.vec2(960, 960), {
    size: 40,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });

  k.onKeyPress("space", start);
  k.onKeyPress("enter", start);
}
