import {
  makeDesertBrute,
  makeDesertHound,
  makeDesertRaider,
} from "../entities/fodder_entities/desertFighters";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

export function LevelFive(options = {}) {
  createRunnerStage(
    {
      scene: "levelFive",
      name: "Demon Dunes",
      background: "desert-day-bg",
      backgroundWidth: 1920,
      backgroundScale: [1, 1],
      backgroundSpeed: 88,
      backgroundOpacity: 0.98,
      groundSprite: "zigzag-snow",
      groundSpriteColor: k.rgb(246, 170, 67),
      groundColor: k.rgb(151, 76, 32),
      groundY: 850,
      music: "ingame-sound",
      goal: 850,
      startSpeed: 680,
      maxSpeed: 1080,
      acceleration: 12,
      distanceDivisor: 39,
      enemyDelay: [1.15, 2.05],
      enemies: [
        {
          create: makeDesertHound,
          flying: false,
          fires: false,
          points: 225,
          speedBonus: 220,
        },
        {
          create: makeDesertRaider,
          flying: false,
          fires: false,
          points: 275,
          speedBonus: 145,
        },
        {
          create: makeDesertBrute,
          flying: false,
          fires: false,
          points: 350,
          speedBonus: 90,
        },
      ],
      loseMessage: "The desert guard stopped Sonic before the demon gate.",
      completeScene: "desertBoss",
      completeText: "DEMON AT SUNSET!",
    },
    options,
  );
}
