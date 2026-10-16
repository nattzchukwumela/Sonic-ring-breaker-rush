import {
  makeHydroTorpedo,
  makeHydroVortex,
} from "../entities/fodder_entities/underwaterHazards";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

const BACKGROUND_SCALE_X = 1920 / 1672;
const BACKGROUND_SCALE_Y = 1080 / 941;
const PLATFORM_SCALE = 1920 / 2172;

export function LevelUnderwater(options = {}) {
  createRunnerStage(
    {
      scene: "levelUnderwater",
      name: "Underwater Ruins",
      background: "underwater-stage-bg",
      backgroundWidth: 1920,
      backgroundScale: [BACKGROUND_SCALE_X, BACKGROUND_SCALE_Y],
      backgroundSpeed: 0,
      backgroundOpacity: 1,
      groundSprite: "underwater-platform",
      groundScale: [PLATFORM_SCALE, PLATFORM_SCALE],
      groundTileWidth: 2138,
      groundSpriteOffsetY: -239,
      groundColor: k.rgb(5, 42, 65),
      groundY: 850,
      gravity: 2100,
      jumpPower: 1480,
      music: "currents-sleep",
      goal: 1200,
      startSpeed: 640,
      maxSpeed: 1040,
      acceleration: 11,
      distanceDivisor: 40,
      enemyDelay: [1.1, 1.9],
      enemies: [
        {
          create: makeHydroVortex,
          flying: false,
          fires: false,
          points: 325,
          speedBonus: 120,
        },
        {
          create: makeHydroTorpedo,
          flying: true,
          fires: false,
          points: 375,
          speedBonus: 240,
        },
      ],
      loseMessage: "The ancient currents swept Sonic out of the ruins.",
      completeScene: "underwaterBoss",
      completeText: "ABYSSFANG AWAKENS!",
    },
    options,
  );
}
