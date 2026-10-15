import { LevelOne } from "./gameLevels/level_01";
import LevelSelect from "./gameLevels/levelSelect";
import { k } from "./kaplayCtx";
import { LevelFour } from "./gameLevels/Level_04";
import MainMenu from "./scene/mainMenu";
import { BossLevelOne } from "./bossFights/Boss_01";
import GameOver from "./scene/gameover";
import Victory from "./scene/victory";

// game assets

// game background and platform sprites
k.loadSprite("chemical-bg", "/graphics/backgrounds/chemical-bg.png");
k.loadSprite("forest-bg", "/graphics/backgrounds/forest.png");
k.loadSprite("platform", "/graphics/platform/platforms.png");

// forest wave platforms
k.loadSprite(
  "forest_middle_platform",
  "/graphics/platform/WaveForest_Square.png",
);
k.loadSprite(
  "forest_upfrontLeft_platform",
  "/graphics/platform/WaveForest_UpRoundLeft.png",
);
k.loadSprite(
  "forest_upfrontRight_platform",
  "/graphics/platform/WaveForest_UpRoundRight.png",
);
k.loadSprite(
  "forest_upfrontHalfLeft_platform",
  "/graphics/platform/WaveForest_Half_2RoundLeft.png",
);
k.loadSprite(
  "forest_upfrontHalfRight_platform",
  "/graphics/platform/WaveForest_Half_2RoundRight.png",
);
k.loadSprite("grass-planes", "/graphics/platform/2dplatform.png");

// enemy backgrounds
k.loadSprite(
  "shroomdoom_bg",
  "/graphics/backgrounds/boss_backgrounds/shroomdoom_bg.jpg",
);

// sonic sprite
k.loadSprite("sonic", "/graphics/sonic.png", {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 30 },
    jump: { from: 8, to: 15, loop: true, speed: 100 },
    roll: { from: 8, to: 15, loop: true, speed: 100 },
  },
});

// boss sprites
// level one boss / shroomdoom
k.loadSprite(
  "shroomdoom_one",
  "/graphics/enemy/boss/shroomdoom/shroomdoom_one.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      death: { from: 0, to: 3, loop: false, speed: 5 },
      idle: { from: 4, to: 7, loop: true, speed: 5 },
      hit: { from: 8, to: 11, loop: true, speed: 5 },
    },
  },
);

// fodder enemy sprite
k.loadSprite(
  "blue-monster",
  "/graphics/enemy/fodder/blue_monster/Blue-Monster.png",
  {
    sliceX: 2,
    sliceY: 2,
    anims: {
      hit: { from: 0, to: 1, loop: true, speed: 5 },
      idle: { from: 2, to: 3, loop: true, speed: 5 },
    },
  },
);

k.loadSprite("motobug", "graphics/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});

// rings sprite
k.loadSprite("ring", "graphics/ring.png", {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});

// game fonts
k.loadFont("mania", "fonts/mania.ttf");
k.loadFont("nise-sega-font", "fonts/nise-sega-sonic/NiseSegaSonic.TTF");

// game sounds
k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("city", "sounds/city.mp3");
k.loadSound("ingame-sound", "sounds/game-sound.mp3");
k.loadSound("roll", "sounds/roll.wav");
k.loadSound("shroomdoom", "sounds/shroomdoom.mp3");

// game scenes
k.scene("level-select", LevelSelect);
k.scene("levelOne", LevelOne);
k.scene("levelFour", LevelFour);
k.scene("main-menu", MainMenu);
k.scene("levelOneBoss", BossLevelOne);
k.scene("game-over", GameOver);
k.scene("victory", Victory);
k.go("main-menu");
