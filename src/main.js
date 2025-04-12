import { LevelOne } from "./gameLevels/level_01";
import { k } from "./kaplayCtx";
import { game } from "./scene/game";
import MainMenu from "./scene/mainmenu";

// game sprites
k.loadSprite("chemical-bg", "/graphics/backgrounds/chemical-bg.png");
k.loadSprite("forest-bg", "/graphics/backgrounds/forest.png");
k.loadSprite("platform", "/graphics/platform/platforms.png");
k.loadSprite("blue-monster", "/graphics/enemy/idle01.png");
k.loadSprite("grass_platform", "/graphics/platform/zigzag_grass_platform.png");
k.loadSprite("grass-planes", "/graphics/platform/2dplatform.png");

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

k.loadSprite("ring", "graphics/ring.png", {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});

k.loadSprite("motobug", "graphics/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});

// game assets
k.loadFont("mania", "fonts/mania.ttf");
k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("city", "sounds/city.mp3");
k.loadSound("ingame-sound", "sounds/game-sound.mp3");
k.loadSound("roll", "sounds/roll.wav");

// game scenes
// 5233 pin
// k.scene("disclaimer", disclaimer);
k.scene("main-menu", MainMenu);
k.scene("game", game);
k.scene("levelOne", LevelOne);
// k.scene("gameover", gameover);

k.go("main-menu");
