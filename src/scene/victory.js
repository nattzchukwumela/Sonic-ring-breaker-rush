import { getBestScore, saveBestScore } from "../gameState";
import { addActionButton, addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

export default function Victory(options = {}) {
  const score = Number(options.score ?? 0);
  saveBestScore(score);
  k.setGravity(0);

  k.add([
    k.sprite("forest-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(0.6),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.rgb(4, 38, 88)),
    k.opacity(0.45),
    k.z(-9),
  ]);

  addHudText(options.title ?? "STAGE CLEAR!", k.vec2(960, 250), {
    font: "nise-sega-font",
    size: 88,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });
  addHudText(options.message ?? "The rush is complete.", k.vec2(960, 380), {
    size: 42,
    anchor: "center",
  });
  addHudText(`SCORE  ${score}`, k.vec2(960, 500), {
    size: 58,
    anchor: "center",
  });
  addHudText(`BEST  ${getBestScore()}`, k.vec2(960, 575), {
    size: 40,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });

  if (options.nextScene) {
    const next = () => k.go(options.nextScene, { score });
    addActionButton({
      label: "NEXT STAGE",
      position: k.vec2(960, 730),
      onPress: next,
    });
    k.onKeyPress("space", next);
    k.onKeyPress("enter", next);
  } else {
    addActionButton({
      label: "PLAY AGAIN",
      position: k.vec2(960, 730),
      onPress: () => k.go("level-select"),
    });
  }

  addActionButton({
    label: "STAGE SELECT",
    position: k.vec2(960, 855),
    width: 380,
    onPress: () => k.go("level-select"),
  });
  k.onKeyPress("escape", () => k.go("level-select"));
}
