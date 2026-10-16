import { LevelOne } from "./gameLevels/level_01";
import LevelSelect from "./gameLevels/levelSelect";
import { k } from "./kaplayCtx";
import { LevelFour } from "./gameLevels/Level_04";
import MainMenu from "./scene/mainMenu";
import { BossLevelOne } from "./bossFights/Boss_01";
import GameOver from "./scene/gameover";
import Victory from "./scene/victory";
import { LevelThree } from "./gameLevels/level_03";
import { LevelFourFinal } from "./gameLevels/level_04_final";
import { LevelFive } from "./gameLevels/level_05_desert";
import { DesertBoss } from "./bossFights/DesertBoss";
import { LevelSix } from "./gameLevels/level_06_space";
import { SpaceBoss } from "./bossFights/SpaceBoss";
import { IceBoss } from "./bossFights/IceBoss";
import Splash from "./scene/splash";

// game assets

// game background and platform sprites
k.loadSprite("chemical-bg", "/graphics/backgrounds/chemical-bg.png");
k.loadSprite("forest-bg", "/graphics/backgrounds/forest.png");
k.loadSprite("forest-day-bg", "/graphics/backgrounds/forest-day.jpg");
k.loadSprite(
  "sky-islands-bg",
  "/graphics/backgrounds/Pixel Sky Islands and Waterfalls.png",
);
k.loadSprite("desert-day-bg", "/graphics/backgrounds/desert-day.jpg");
k.loadSprite("desert-sunset-bg", "/graphics/backgrounds/desert-sunset.jpg");
k.loadSprite("space-nebula-bg", "/graphics/backgrounds/space-nebula.jpg");
k.loadSprite(
  "frozen-glacier-bg",
  "/graphics/backgrounds/Frozen Glacier Valley.png",
);
k.loadSprite(
  "ice-cap-boss-bg",
  "/graphics/backgrounds/boss_backgrounds/ice-cap-zone.png",
);
k.loadSprite(
  "intro-splash",
  "/graphics/backgrounds/Sonic’s Forest-to-Space Boss Rush.png",
);
k.loadSprite("platform", "/graphics/platform/platforms.png");
k.loadSprite("zigzag-grass", "/graphics/platform/zigzag_grass_platform.png");
k.loadSprite("zigzag-snow", "/graphics/platform/zigzag_snow_platform.png");
k.loadSprite("sky-large-platform", "/graphics/platform/sky-large-platform.png");
k.loadSprite("sky-short-platform", "/graphics/platform/sky-short-platform.png");
k.loadSprite("ice-boss-platform", "/graphics/platform/ice-boss-platform.png");
k.loadSprite("space-platform", "/graphics/platform/space-platform.png");

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
k.loadSprite("ufo-enemy", "/graphics/enemy/ufo_game_enemy.png");
k.loadSprite("desert-hound", "/graphics/enemy/desert/desert-hound.png");
k.loadSprite("desert-raider", "/graphics/enemy/desert/desert-raider.png");
k.loadSprite("desert-brute", "/graphics/enemy/desert/desert-brute.png");
k.loadSprite("blackheart-boss", "/graphics/enemy/desert/blackheart-boss.png");
k.loadSprite("ice-kirby", "/graphics/enemy/ice/ice-kirby.png");
k.loadSprite("ice-king", "/graphics/enemy/boss/ice-king/ice-king.png");
k.loadSprite("winged-invader", "/graphics/enemy/space/winged-invader.png");
k.loadSprite("flying-parasite", "/graphics/enemy/space/flying-parasite.png");
k.loadSprite("invader-overlord", "/graphics/enemy/space/invader-overlord.png");

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
k.loadSound("chemical-rush", "sounds/Claws_in_the_Hangar.mp3");
k.loadSound("sky-patrol", "sounds/Emerald_Glade_Dash.mp3");
k.loadSound("glacier-velocity", "sounds/Glacier_Velocity.mp3");
k.loadSound("ice-boss", "sounds/Velocity_at_Midnight.mp3");
k.loadSound("unknown-trajectory", "sounds/Trajectory_Unknown.mp3");
k.loadSound("ingame-sound", "sounds/game-sound.mp3");
k.loadSound("roll", "sounds/roll.wav");
k.loadSound("shroomdoom", "sounds/shroomdoom.mp3");
k.loadSound("demon-dunes", "sounds/dune/Mirage_Peak_Run.mp3");
k.loadSound(
  "desert-boss",
  "sounds/dune/Steel_Teeth_of_the_Titan (boss fight).mp3",
);
k.loadSound("final-boss", "sounds/Last_Stand_at_Zenith.mp3");

// game scenes
k.scene("splash", Splash);
k.scene("level-select", LevelSelect);
k.scene("levelOne", LevelOne);
k.scene("levelFour", LevelFour);
k.scene("levelThree", LevelThree);
k.scene("levelFourFinal", LevelFourFinal);
k.scene("levelFive", LevelFive);
k.scene("levelSix", LevelSix);
k.scene("main-menu", MainMenu);
k.scene("levelOneBoss", BossLevelOne);
k.scene("iceBoss", IceBoss);
k.scene("desertBoss", DesertBoss);
k.scene("spaceBoss", SpaceBoss);
k.scene("game-over", GameOver);
k.scene("victory", Victory);
k.go("splash");
