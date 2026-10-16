import { getBestScore, saveBestScore } from "../gameState";
import { addActionButton, addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

export default function Victory(options = {}) {
  const score = Number(options.score ?? 0);
  let leaving = false;
  saveBestScore(score);
  k.setGravity(0);
  const completionMusic = k.play("level-complete", {
    loop: true,
    volume: 0.42,
  });

  const leaveVictory = (scene, data) => {
    if (leaving) return;
    leaving = true;
    completionMusic.stop();
    k.go(scene, data);
  };

  const goToStageSelect = () => leaveVictory("level-select");

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
  addHudText("PRESS ENTER / SPACE OR CHOOSE AN OPTION", k.vec2(960, 645), {
    size: 25,
    anchor: "center",
    color: k.rgb(190, 228, 255),
  });

  let primaryAction;
  if (options.nextScene) {
    primaryAction = () => leaveVictory(options.nextScene, { score });
    addActionButton({
      label: "NEXT STAGE",
      position: k.vec2(960, 730),
      onPress: primaryAction,
    });
  } else {
    primaryAction = goToStageSelect;
    addActionButton({
      label: "PLAY AGAIN",
      position: k.vec2(960, 730),
      onPress: primaryAction,
    });
  }

  addActionButton({
    label: "STAGE SELECT",
    position: k.vec2(960, 855),
    width: 380,
    onPress: goToStageSelect,
  });
  k.onKeyPress(["space", "enter"], primaryAction);
  k.onKeyPress("escape", goToStageSelect);
  k.onSceneLeave(() => completionMusic.stop());
}
