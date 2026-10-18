import { makeSonic } from "../entities/sonic";
import {
  getBestScore,
  getSelectedCharacter,
  playableCharacters,
  setSelectedCharacter,
} from "../gameState";
import { addActionButton, addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

export default function MainMenu() {
  k.setGravity(0);
  const selectedCharacter = getSelectedCharacter();

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

  const mascot = makeSonic(k.vec2(960, 510));
  mascot.scale = k.vec2(6, 6);

  addHudText("CHOOSE YOUR HERO", k.vec2(960, 650), {
    size: 28,
    anchor: "center",
    color: k.rgb(190, 228, 255),
  });

  const chooseCharacter = (characterId) => {
    if (characterId === selectedCharacter.id) return;
    setSelectedCharacter(characterId);
    k.go("main-menu");
  };

  addActionButton({
    label: selectedCharacter.id === "sonic" ? "> SONIC <" : "SONIC",
    position: k.vec2(760, 715),
    width: 320,
    onPress: () => chooseCharacter("sonic"),
  });
  addActionButton({
    label: selectedCharacter.id === "tails" ? "> TAILS <" : "TAILS",
    position: k.vec2(1160, 715),
    width: 320,
    onPress: () => chooseCharacter("tails"),
  });

  const start = () => k.go("level-select");
  addActionButton({
    label: "START RUN",
    position: k.vec2(960, 830),
    onPress: start,
  });
  addHudText("← / → SELECT     SPACE / ENTER START", k.vec2(960, 900), {
    size: 26,
    anchor: "center",
    color: k.rgb(210, 231, 255),
  });
  addHudText(`BEST SCORE  ${getBestScore()}`, k.vec2(960, 980), {
    size: 36,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });

  const characterIds = Object.keys(playableCharacters);
  const cycleCharacter = (direction) => {
    const currentIndex = characterIds.indexOf(selectedCharacter.id);
    const nextIndex =
      (currentIndex + direction + characterIds.length) % characterIds.length;
    chooseCharacter(characterIds[nextIndex]);
  };
  k.onKeyPress("left", () => cycleCharacter(-1));
  k.onKeyPress("right", () => cycleCharacter(1));
  k.onKeyPress("space", start);
  k.onKeyPress("enter", start);
}
