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
k.loadSprite("chemical-bg", "/graphics/backgrounds/stages/chemical-rush.png");
k.loadSprite("forest-bg", "/graphics/backgrounds/stages/forest.png");
k.loadSprite("forest-day-bg", "/graphics/backgrounds/stages/forest-day.jpg");
k.loadSprite("sky-islands-bg", "/graphics/backgrounds/stages/sky-islands.png");
k.loadSprite("desert-day-bg", "/graphics/backgrounds/stages/desert-day.jpg");
k.loadSprite("desert-sunset-bg", "/graphics/backgrounds/stages/desert-sunset.jpg");
k.loadSprite("space-nebula-bg", "/graphics/backgrounds/stages/space-nebula.jpg");
k.loadSprite("frozen-glacier-bg", "/graphics/backgrounds/stages/frozen-glacier.png");
k.loadSprite(
  "ice-cap-boss-bg",
  "/graphics/backgrounds/bosses/ice-cap-zone.png",
);
k.loadSprite("intro-splash", "/graphics/backgrounds/splash/title-card.png");
k.loadSprite("platform", "/graphics/platforms/common/chemical-platform.png");
k.loadSprite("zigzag-grass", "/graphics/platforms/common/zigzag-grass.png");
k.loadSprite("zigzag-snow", "/graphics/platforms/common/zigzag-snow.png");
k.loadSprite("sky-large-platform", "/graphics/platforms/sky/large.png");
k.loadSprite("sky-short-platform", "/graphics/platforms/sky/short.png");
k.loadSprite("ice-boss-platform", "/graphics/platforms/ice/boss-platform.png");
k.loadSprite("space-platform", "/graphics/platforms/space/platform.png");

// forest wave platforms
k.loadSprite(
  "forest_middle_platform",
  "/graphics/platforms/forest/square.png",
);
k.loadSprite(
  "forest_upfrontLeft_platform",
  "/graphics/platforms/forest/upper-left.png",
);
k.loadSprite(
  "forest_upfrontRight_platform",
  "/graphics/platforms/forest/upper-right.png",
);
k.loadSprite(
  "forest_upfrontHalfLeft_platform",
  "/graphics/platforms/forest/half-left.png",
);
k.loadSprite(
  "forest_upfrontHalfRight_platform",
  "/graphics/platforms/forest/half-right.png",
);
k.loadSprite("grass-planes", "/graphics/platforms/common/grass-plane.png");

// enemy backgrounds
k.loadSprite(
  "shroomdoom_bg",
  "/graphics/backgrounds/bosses/shroomdoom.jpg",
);

// sonic sprite
k.loadSprite("sonic", "/graphics/characters/sonic.png", {
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
  "/graphics/enemies/bosses/shroomdoom.png",
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
  "/graphics/enemies/common/blue-monster.png",
  {
    sliceX: 2,
    sliceY: 2,
    anims: {
      hit: { from: 0, to: 1, loop: true, speed: 5 },
      idle: { from: 2, to: 3, loop: true, speed: 5 },
    },
  },
);

k.loadSprite("motobug", "/graphics/enemies/common/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});
k.loadSprite("ufo-enemy", "/graphics/enemies/common/ufo.png");
k.loadSprite("desert-hound", "/graphics/enemies/desert/hound.png");
k.loadSprite("desert-raider", "/graphics/enemies/desert/raider.png");
k.loadSprite("desert-brute", "/graphics/enemies/desert/brute.png");
k.loadSprite("blackheart-boss", "/graphics/enemies/desert/blackheart.png");
k.loadSprite("ice-kirby", "/graphics/enemies/ice/ice-kirby.png");
k.loadSprite("ice-king", "/graphics/enemies/bosses/ice-king.png");
k.loadSprite("winged-invader", "/graphics/enemies/space/winged-invader.png");
k.loadSprite("flying-parasite", "/graphics/enemies/space/flying-parasite.png");
k.loadSprite("invader-overlord", "/graphics/enemies/space/invader-overlord.png");

// rings sprite
k.loadSprite("ring", "/graphics/collectibles/ring.png", {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});

// game fonts
k.loadFont("mania", "/fonts/mania.ttf");
k.loadFont("nise-sega-font", "/fonts/nise-sega/nise-sega-sonic.ttf");

// game sounds
k.loadSound("destroy", "/sounds/sfx/destroy.wav");
k.loadSound("hurt", "/sounds/sfx/hurt.wav");
k.loadSound("hyper-ring", "/sounds/sfx/hyper-ring.wav");
k.loadSound("jump", "/sounds/sfx/jump.wav");
k.loadSound("ring", "/sounds/sfx/ring.wav");
k.loadSound("roll", "/sounds/sfx/roll.wav");
k.loadSound("ingame-sound", "/sounds/music/stages/emerald-woods.mp3");
k.loadSound("chemical-rush", "/sounds/music/stages/chemical-rush.mp3");
k.loadSound("sky-patrol", "/sounds/music/stages/sky-patrol.mp3");
k.loadSound("glacier-velocity", "/sounds/music/stages/frozen-glacier.mp3");
k.loadSound("demon-dunes", "/sounds/music/stages/demon-dunes.mp3");
k.loadSound("unknown-trajectory", "/sounds/music/stages/starfall-station.mp3");
k.loadSound("shroomdoom", "/sounds/music/bosses/shroomdoom.mp3");
k.loadSound("ice-boss", "/sounds/music/bosses/ice-king.mp3");
k.loadSound("desert-boss", "/sounds/music/bosses/blackheart.mp3");
k.loadSound("final-boss", "/sounds/music/bosses/final-boss.mp3");

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
