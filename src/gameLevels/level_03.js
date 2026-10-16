import { makeUfo } from "../entities/fodder_entities/ufo";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

export function LevelThree(options = {}) {
  createRunnerStage(
    {
      scene: "levelThree",
      name: "Sky Patrol",
      background: "forest-day-bg",
      backgroundWidth: 1920,
      backgroundScale: [1, 1],
      backgroundSpeed: 105,
      backgroundOpacity: 0.92,
      groundSprite: "zigzag-grass",
      groundColor: k.rgb(102, 66, 38),
      groundY: 840,
      music: "sky-patrol",
      goal: 700,
      startSpeed: 610,
      maxSpeed: 980,
      acceleration: 10,
      distanceDivisor: 37,
      enemyDelay: [1.55, 2.75],
      enemies: [
        {
          create: makeUfo,
          flying: true,
          fires: true,
          points: 250,
          speedBonus: 120,
        },
      ],
      loseMessage: "The UFO squadron knocked Sonic out of the sky.",
      unlockStage: 4,
      nextScene: "levelFourFinal",
      victoryTitle: "SKY PATROL CLEAR!",
      victoryMessage: "Chaos Circuit unlocked",
    },
    options,
  );
}
