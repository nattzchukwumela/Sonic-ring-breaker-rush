import { makeWispwick } from "../entities/fodder_entities/hauntedRuinsEnemies";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

const BACKGROUND_SCALE_X = 1920 / 1672;
const BACKGROUND_SCALE_Y = 1080 / 940;
const PLATFORM_SCALE = 1920 / 2172;

export function LevelHauntedRuins(options = {}) {
  createRunnerStage(
    {
      scene: "levelHauntedRuins",
      name: "Midnight Keep",
      background: "haunted-ruins-stage-bg",
      backgroundWidth: 1920,
      backgroundScale: [BACKGROUND_SCALE_X, BACKGROUND_SCALE_Y],
      backgroundSpeed: 0,
      backgroundOpacity: 1,
      groundSprite: "haunted-ruins-platform",
      groundScale: [PLATFORM_SCALE, PLATFORM_SCALE],
      groundTileWidth: 2138,
      groundSpriteOffsetY: -239,
      groundColor: k.rgb(12, 9, 31),
      groundY: 850,
      music: "midnight-keep",
      goal: 1400,
      startSpeed: 710,
      maxSpeed: 1150,
      acceleration: 13,
      distanceDivisor: 40,
      enemyDelay: [1.05, 1.8],
      enemies: [
        {
          create: makeWispwick,
          flying: true,
          fires: true,
          points: 400,
          speedBonus: 220,
        },
      ],
      loseMessage: "Wispwick's haunted lantern ended Sonic's midnight run.",
      completeScene: "hauntedRuinsBoss",
      completeText: "THE PHANTOM BELL TOLLS!",
    },
    options,
  );
}
