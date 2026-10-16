import { k } from "./kaplayCtx";

const PROGRESS_KEY = "ringbreaker-progress";
const BEST_SCORE_KEY = "best-score";

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
