import { makeMotobug } from "../entities/fodder_entities/motobug";
import { makeUfo } from "../entities/fodder_entities/ufo";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

export function LevelFourFinal(options = {}) {
  createRunnerStage(
    {
      scene: "levelFourFinal",
      name: "Frozen Glacier Valley",
      background: "frozen-glacier-bg",
      backgroundWidth: 1920,
      backgroundScale: [1920 / 1672, 1080 / 941],
      backgroundSpeed: 145,
      backgroundOpacity: 0.98,
      groundSprite: "zigzag-snow",
      groundColor: k.rgb(18, 45, 78),
      groundY: 840,
      music: "city",
      goal: 900,
      startSpeed: 760,
      maxSpeed: 1250,
      acceleration: 14,
      distanceDivisor: 40,
      enemyDelay: [1.05, 1.9],
      enemies: [
        {
          create: makeMotobug,
          flying: false,
          fires: false,
          points: 175,
          speedBonus: 150,
        },
        {
          create: makeUfo,
          flying: true,
          fires: true,
          points: 300,
          speedBonus: 180,
        },
      ],
      loseMessage: "The frozen valley stopped Sonic in his tracks.",
      unlockStage: 5,
      nextScene: "levelFive",
      victoryTitle: "GLACIER CROSSED!",
      victoryMessage: "Demon Dunes unlocked",
    },
    options,
  );
}
