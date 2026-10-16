import {
  makeLavaBat,
  makeMagmaBoulder,
  makeMagmaCrab,
} from "../entities/fodder_entities/volcanoMinions";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

const BACKGROUND_SCALE_X = 1920 / 1672;
const BACKGROUND_SCALE_Y = 1080 / 940;
const PLATFORM_SCALE = 1920 / 2172;

export function LevelVolcano(options = {}) {
  createRunnerStage(
    {
      scene: "levelVolcano",
      name: "Obsidian Overdrive",
      background: "volcano-stage-bg",
      backgroundWidth: 1920,
      backgroundScale: [BACKGROUND_SCALE_X, BACKGROUND_SCALE_Y],
      backgroundSpeed: 0,
      backgroundOpacity: 1,
      groundSprite: "volcano-platform",
      groundScale: [PLATFORM_SCALE, PLATFORM_SCALE],
      groundTileWidth: 2138,
      groundSpriteOffsetY: -239,
      groundColor: k.rgb(35, 10, 18),
      groundY: 850,
      music: "obsidian-overdrive",
      goal: 1100,
      startSpeed: 720,
      maxSpeed: 1180,
      acceleration: 13,
      distanceDivisor: 40,
      enemyDelay: [1.05, 1.85],
      enemies: [
        {
          create: makeMagmaCrab,
          flying: false,
          fires: false,
          points: 300,
          speedBonus: 150,
        },
        {
          create: makeLavaBat,
          flying: true,
          fires: true,
          points: 325,
          speedBonus: 210,
        },
        {
          create: makeMagmaBoulder,
          flying: false,
          fires: false,
          points: 350,
          speedBonus: 95,
        },
      ],
      loseMessage: "The volcano minions knocked Sonic into the lava valley.",
      completeScene: "volcanoBoss",
      completeText: "MAGMACLAW ERUPTS!",
    },
    options,
  );
}
