import { makeIceKirby } from "../entities/fodder_entities/iceKirby";
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
      music: "glacier-velocity",
      goal: 900,
      startSpeed: 760,
      maxSpeed: 1250,
      acceleration: 14,
      distanceDivisor: 40,
      enemyDelay: [1.05, 1.9],
      enemies: [
        {
          create: makeIceKirby,
          flying: false,
          fires: false,
          points: 225,
          speedBonus: 150,
        },
      ],
      loseMessage: "The frozen valley stopped Sonic in his tracks.",
      completeScene: "iceBoss",
      completeText: "FROSTMAW AWAITS!",
    },
    options,
  );
}
