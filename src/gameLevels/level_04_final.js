import { makeMotobug } from "../entities/fodder_entities/motobug";
import { makeUfo } from "../entities/fodder_entities/ufo";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

export function LevelFourFinal(options = {}) {
  createRunnerStage(
    {
      scene: "levelFourFinal",
      name: "Chaos Circuit",
      background: "chemical-bg",
      backgroundWidth: 1920,
      backgroundScale: [1, 1],
      backgroundSpeed: 145,
      backgroundOpacity: 0.88,
      tint: { color: k.rgb(90, 8, 88), opacity: 0.2 },
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
      loseMessage: "The Chaos Circuit overwhelmed Sonic.",
      victoryTitle: "CHAOS CONQUERED!",
      victoryMessage: "All four stages complete",
    },
    options,
  );
}
