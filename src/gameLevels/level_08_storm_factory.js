import { makeSparkgear } from "../entities/fodder_entities/stormFactoryEnemies";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

const BACKGROUND_SCALE_X = 1920 / 1672;
const BACKGROUND_SCALE_Y = 1080 / 941;
const PLATFORM_SCALE = 1920 / 2172;

export function LevelStormFactory(options = {}) {
  createRunnerStage(
    {
      scene: "levelStormFactory",
      name: "High Voltage Requiem",
      background: "storm-factory-stage-bg",
      backgroundWidth: 1920,
      backgroundScale: [BACKGROUND_SCALE_X, BACKGROUND_SCALE_Y],
      backgroundSpeed: 0,
      backgroundOpacity: 1,
      groundSprite: "storm-factory-platform",
      groundScale: [PLATFORM_SCALE, PLATFORM_SCALE],
      groundTileWidth: 2138,
      groundSpriteOffsetY: -239,
      groundColor: k.rgb(12, 17, 35),
      groundY: 850,
      music: "high-voltage-requiem",
      goal: 1350,
      startSpeed: 700,
      maxSpeed: 1140,
      acceleration: 13,
      distanceDivisor: 40,
      enemyDelay: [1.05, 1.75],
      enemies: [
        {
          create: makeSparkgear,
          flying: false,
          fires: true,
          points: 375,
          speedBonus: 175,
        },
      ],
      loseMessage: "Sparkgear and the charged conveyors stopped Sonic's run.",
      completeScene: "stormFactoryBoss",
      completeText: "GEARGRIND ONLINE!",
    },
    options,
  );
}
