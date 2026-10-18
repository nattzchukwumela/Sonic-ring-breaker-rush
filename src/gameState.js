import { k } from "./kaplayCtx";

const PROGRESS_KEY = "ringbreaker-progress";
const BEST_SCORE_KEY = "best-score";
const CHARACTER_KEY = "selected-character";

export const playableCharacters = {
  sonic: {
    id: "sonic",
    name: "Sonic",
    sprite: "sonic-player",
  },
  tails: {
    id: "tails",
    name: "Tails",
    sprite: "tails-player",
  },
};

export const stages = [
  {
    id: 1,
    name: "Emerald Woods",
    subtitle: "Reach the mushroom lair",
    scene: "levelOne",
  },
  {
    id: 2,
    name: "Chemical Rush",
    subtitle: "Outrun the Badnik factory",
    scene: "levelFour",
  },
  {
    id: 3,
    name: "Sky Patrol",
    subtitle: "Climb the collapsing sky islands",
    scene: "levelThree",
  },
  {
    id: 4,
    name: "Frozen Glacier Valley",
    subtitle: "Race across the frozen wilderness",
    scene: "levelFourFinal",
  },
  {
    id: 5,
    name: "Demon Dunes",
    subtitle: "Break the desert guard at sunset",
    scene: "levelFive",
  },
  {
    id: 6,
    name: "Obsidian Overdrive",
    subtitle: "Outrun the eruption and reach the crater",
    scene: "levelVolcano",
  },
  {
    id: 7,
    name: "Underwater Ruins",
    subtitle: "Cross the sunken temple and wake its guardian",
    scene: "levelUnderwater",
  },
  {
    id: 8,
    name: "High Voltage Requiem",
    subtitle: "Break through the lightning factory",
    scene: "levelStormFactory",
  },
  {
    id: 9,
    name: "Midnight Keep",
    subtitle: "Break the curse of the haunted ruins",
    scene: "levelHauntedRuins",
  },
  {
    id: 10,
    name: "Starfall Station",
    subtitle: "Stop the invaders beyond the stars",
    scene: "levelSix",
  },
];

export function getUnlockedStage() {
  const progress = Number(k.getData(PROGRESS_KEY) ?? 1);
  return Math.max(1, Math.min(stages.length, progress));
}

export function unlockStage(stageNumber) {
  const nextProgress = Math.max(getUnlockedStage(), stageNumber);
  k.setData(PROGRESS_KEY, Math.min(stages.length, nextProgress));
}

export function getBestScore() {
  return Number(k.getData(BEST_SCORE_KEY) ?? 0);
}

export function saveBestScore(score) {
  const best = Math.max(getBestScore(), Math.max(0, Math.floor(score)));
  k.setData(BEST_SCORE_KEY, best);
  return best;
}

export function getSelectedCharacter() {
  const selected = k.getData(CHARACTER_KEY) ?? "sonic";
  return playableCharacters[selected] ?? playableCharacters.sonic;
}

export function setSelectedCharacter(characterId) {
  if (!playableCharacters[characterId]) return getSelectedCharacter();
  k.setData(CHARACTER_KEY, characterId);
  return playableCharacters[characterId];
}
