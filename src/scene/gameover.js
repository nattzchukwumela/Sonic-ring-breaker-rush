import { getSelectedCharacter, saveBestScore } from "../gameState";
import { addActionButton, addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

export default function GameOver(options = {}) {
  const score = Number(options.score ?? 0);
  const retryScene = options.retryScene ?? "levelOne";
  const retryData = options.retryData ?? {};
  const best = saveBestScore(score);
  const character = getSelectedCharacter();

  k.setGravity(0);
  k.add([
    k.sprite("chemical-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(0.2),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.rgb(35, 5, 22)),
    k.opacity(0.75),
    k.z(-9),
  ]);

  addHudText(`${character.name.toUpperCase()} IS DOWN`, k.vec2(960, 245), {
    font: "nise-sega-font",
    size: 88,
    anchor: "center",
    color: k.rgb(255, 92, 92),
  });
  addHudText(options.stageName ?? "The run", k.vec2(960, 350), {
    size: 48,
    anchor: "center",
  });
  addHudText(options.reason ?? "Try the stage again.", k.vec2(960, 420), {
    size: 34,
    anchor: "center",
    color: k.rgb(220, 228, 240),
  });
  addHudText(`SCORE  ${score}     BEST  ${best}`, k.vec2(960, 525), {
    size: 48,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });

  const retry = () => k.go(retryScene, retryData);
  addActionButton({
    label: "TRY AGAIN",
    position: k.vec2(960, 680),
    onPress: retry,
  });
  addActionButton({
    label: "STAGE SELECT",
    position: k.vec2(960, 805),
    onPress: () => k.go("level-select"),
  });

  addHudText("SPACE / ENTER TO RETRY", k.vec2(960, 920), {
    size: 30,
    anchor: "center",
  });
  k.onKeyPress("space", retry);
  k.onKeyPress("enter", retry);
  k.onKeyPress("escape", () => k.go("level-select"));
}
