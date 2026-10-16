import {
  makeFlyingParasite,
  makeWingedInvader,
} from "../entities/fodder_entities/spaceInvaders";
import { k } from "../kaplayCtx";
import { createRunnerStage } from "./stageRunner";

export function LevelSix(options = {}) {
  createRunnerStage(
    {
      scene: "levelSix",
      name: "Starfall Station",
      background: "space-nebula-bg",
      backgroundWidth: 1920,
      backgroundScale: [1, 1],
      backgroundSpeed: 72,
      backgroundOpacity: 0.98,
      groundSprite: "space-platform",
      groundScale: [1, 1],
      groundTileWidth: 1920,
      groundColor: k.rgb(4, 7, 30),
      groundY: 820,
      music: "unknown-trajectory",
      goal: 1500,
      startSpeed: 720,
      maxSpeed: 1160,
      acceleration: 13,
      distanceDivisor: 40,
      enemyDelay: [1.05, 1.85],
      enemies: [
        {
          create: makeWingedInvader,
          flying: true,
          fires: true,
          points: 325,
          speedBonus: 190,
        },
        {
          create: makeFlyingParasite,
          flying: true,
          fires: false,
          points: 275,
          speedBonus: 245,
        },
      ],
      loseMessage: "The invader swarm knocked Sonic out of orbit.",
      completeScene: "spaceBoss",
      completeText: "OVERLORD INBOUND!",
    },
    options,
  );
}
