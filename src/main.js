import "./style.css";
import { LevelOne } from "./gameLevels/level_01";
import LevelSelect from "./gameLevels/levelSelect";
import { k } from "./kaplayCtx";
import { setupMobileExperience } from "./mobileExperience";
import { setupPwaExperience } from "./pwa";
import { LevelFour } from "./gameLevels/Level_04";
import MainMenu from "./scene/mainMenu";
import { BossLevelOne } from "./bossFights/Boss_01";
import { ChemicalBoss } from "./bossFights/ChemicalBoss";
import GameOver from "./scene/gameover";
import Victory from "./scene/victory";
import { LevelThree } from "./gameLevels/level_03";
import { LevelFourFinal } from "./gameLevels/level_04_final";
import { LevelFive } from "./gameLevels/level_05_desert";
import { LevelVolcano } from "./gameLevels/level_06_volcano";
import { LevelUnderwater } from "./gameLevels/level_07_underwater";
import { LevelStormFactory } from "./gameLevels/level_08_storm_factory";
import { LevelHauntedRuins } from "./gameLevels/level_09_haunted_ruins";
import { DesertBoss } from "./bossFights/DesertBoss";
import { VolcanoBoss } from "./bossFights/VolcanoBoss";
import { UnderwaterBoss } from "./bossFights/UnderwaterBoss";
import { StormFactoryBoss } from "./bossFights/StormFactoryBoss";
import { HauntedRuinsBoss } from "./bossFights/HauntedRuinsBoss";
import { LevelSix } from "./gameLevels/level_06_space";
import { SpaceBoss } from "./bossFights/SpaceBoss";
import { IceBoss } from "./bossFights/IceBoss";
import Splash from "./scene/splash";

setupMobileExperience();
setupPwaExperience();

// game assets

// game background and platform sprites
k.loadSprite("chemical-bg", "/graphics/backgrounds/stages/chemical-rush.png");
k.loadSprite("forest-bg", "/graphics/backgrounds/stages/forest.png");
k.loadSprite("forest-day-bg", "/graphics/backgrounds/stages/forest-day.jpg");
k.loadSprite("sky-islands-bg", "/graphics/backgrounds/stages/sky-islands.png");
k.loadSprite("desert-day-bg", "/graphics/backgrounds/stages/desert-day.jpg");
k.loadSprite("desert-sunset-bg", "/graphics/backgrounds/stages/desert-sunset.jpg");
k.loadSprite(
  "volcano-stage-bg",
  "/graphics/backgrounds/stages/Erupting%20Volcano%20Over%20a%20Lava%20Valley.png",
);
k.loadSprite(
  "volcano-boss-bg",
  "/graphics/backgrounds/bosses/Molten%20Basalt%20Crater%20Arena.png",
);
k.loadSprite(
  "underwater-stage-bg",
  "/graphics/backgrounds/stages/Mystic%20Sunken%20Temple%20Ruins.png",
);
k.loadSprite(
  "underwater-boss-bg",
  "/graphics/backgrounds/bosses/Underwater%20Ruins%20Throne%20Chamber-1.png",
);
k.loadSprite(
  "storm-factory-stage-bg",
  "/graphics/backgrounds/stages/Violet%20Lightning%20Storm%20Factory-1.png",
);
k.loadSprite(
  "storm-factory-boss-bg",
  "/graphics/backgrounds/bosses/Storm%20Factory%20Turbine%20Chamber-2.png",
);
k.loadSprite(
  "haunted-ruins-stage-bg",
  "/graphics/backgrounds/stages/Moonlit%20Haunted%20Ruins-1.png",
);
k.loadSprite(
  "haunted-ruins-boss-bg",
  "/graphics/backgrounds/bosses/Haunted%20Bell%20Tower%20Arena-2.png",
);
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
k.loadSprite(
  "volcano-platform",
  "/graphics/platforms/volcanoe/Molten%20basalt%20volcanic%20running%20platform.png",
);
k.loadSprite(
  "underwater-platform",
  "/graphics/platforms/underwater%20ruins/Submerged%20Temple%20Ruins%20Platform.png",
);
k.loadSprite(
  "storm-factory-platform",
  "/graphics/platforms/storm%20factory/Storm%20Factory%20Steel%20Conveyor%20Platform-3.png",
);
k.loadSprite(
  "haunted-ruins-platform",
  "/graphics/platforms/huanted%20ruins/Haunted%20Gothic%20Ruins%20Platform%20Strip-3.png",
);

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

// playable character sprites
k.loadSprite("sonic-player", "/graphics/characters/sonic-player.png", {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 22 },
    jump: { from: 8, to: 15, loop: true, speed: 18 },
    roll: { from: 8, to: 15, loop: true, speed: 24 },
  },
});
k.loadSprite("tails-player", "/graphics/characters/tails-player.png", {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 22 },
    jump: { from: 8, to: 13, loop: true, speed: 18 },
    roll: { from: 8, to: 13, loop: true, speed: 24 },
  },
});

// boss sprites
// level one boss / Shroom Doom
k.loadSprite(
  "shroomdoom-boss",
  "/graphics/enemies/bosses/Shroom%20Doom,%20Crimson-Eyed%20Forest%20Boss-1.png",
);
k.loadSprite(
  "shroomdoom-attacks",
  "/graphics/attacks/Shroom%20Doom%20attack%20sprite%20sheet-2.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      spore: { from: 0, to: 3, loop: true, speed: 12 },
      roots: { from: 4, to: 7, loop: false, speed: 8 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite(
  "voltitan-boss",
  "/graphics/enemies/bosses/Neon%20City%20Robot%20Enforcer.png",
);
k.loadSprite(
  "voltitan-attacks",
  "/graphics/attacks/Voltitan's%20Neon%20Attack%20Sprite%20Sheet.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      energy: { from: 0, to: 3, loop: true, speed: 12 },
      surge: { from: 4, to: 7, loop: true, speed: 12 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
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
k.loadSprite(
  "volcano-minions",
  "/graphics/enemies/volcanoe/Magmaclaw%E2%80%99s%20Volcano%20Minions.png",
  { sliceX: 3 },
);
k.loadSprite(
  "magmaclaw-boss",
  "/graphics/enemies/bosses/Magmaclaw_%20Molten%20Basalt%20Crab%20Boss.png",
);
k.loadSprite(
  "abyssfang-boss",
  "/graphics/enemies/bosses/Abyssfang,%20the%20robotic%20sea%20serpent-2.png",
);
k.loadSprite(
  "abyssfang-attacks",
  "/graphics/attacks/Abyssfang%20Hydro%20Attack%20Sprite%20Sheet-3.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      vortex: { from: 0, to: 3, loop: true, speed: 12 },
      torpedo: { from: 4, to: 7, loop: true, speed: 12 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite(
  "sparkgear",
  "/graphics/enemies/storm%20factory/Sparkgear,%20the%20orange-eyed%20cogwheel%20bot-4.png",
);
k.loadSprite(
  "geargrind-boss",
  "/graphics/enemies/bosses/Geargrind,%20the%20Spinning%20Gear%20Boss-5.png",
);
k.loadSprite(
  "geargrind-attacks",
  "/graphics/attacks/Geargrind%20robot%20boss%20attack%20sprites-6.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      saw: { from: 0, to: 3, loop: true, speed: 13 },
      lightning: { from: 4, to: 7, loop: true, speed: 13 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite(
  "wispwick",
  "/graphics/enemies/huanted%20ruins/Wispwick,%20the%20Haunted%20Lantern%20Ghost-4.png",
);
k.loadSprite(
  "phantom-bell-boss",
  "/graphics/enemies/bosses/Phantom%20Bell,%20Haunted%20Ruins%20Boss-5.png",
);
k.loadSprite(
  "phantom-bell-attacks",
  "/graphics/attacks/Phantom%20Bell%20Ghost%20Attack%20Sprite%20Sheet-6.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      spirit: { from: 0, to: 3, loop: true, speed: 12 },
      portal: { from: 4, to: 7, loop: true, speed: 12 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite(
  "dunefang-boss",
  "/graphics/enemies/bosses/Dunefang,%20Sand%20Demon%20Boss.png",
);
k.loadSprite(
  "dunefang-attacks",
  "/graphics/attacks/Sand%20and%20Lava%20Attack%20Sprite%20Sheet.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      sand: { from: 0, to: 3, loop: true, speed: 12 },
      lava: { from: 4, to: 7, loop: true, speed: 12 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite("ice-kirby", "/graphics/enemies/ice/ice-kirby.png");
k.loadSprite(
  "frostmaw-boss",
  "/graphics/enemies/bosses/Frostmaw,%20the%20Glacier%20Beast.png",
);
k.loadSprite(
  "frostmaw-attacks",
  "/graphics/attacks/Frostmaw's%20Crystal%20Ice%20Attack%20Frames.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      shard: { from: 0, to: 3, loop: true, speed: 12 },
      orb: { from: 4, to: 7, loop: true, speed: 12 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite("storm-falcon", "/graphics/enemies/bosses/storm-falcon.png");
k.loadSprite(
  "storm-falcon-attacks",
  "/graphics/attacks/Storm%20Falcon%20attack%20sprite%20sheet.png",
  {
    sliceX: 4,
    sliceY: 3,
    anims: {
      energy: { from: 0, to: 3, loop: true, speed: 12 },
      missile: { from: 4, to: 7, loop: true, speed: 12 },
      impact: { from: 8, to: 11, loop: false, speed: 14 },
    },
  },
);
k.loadSprite("sky-bird", "/graphics/enemies/sky/bird.png", {
  sliceX: 6,
  anims: {
    fly: { from: 0, to: 5, loop: true, speed: 9 },
  },
});
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
k.loadSound("obsidian-overdrive", "/sounds/music/stages/Obsidian_Overdrive.mp3");
k.loadSound("currents-sleep", "/sounds/music/stages/Where_the_Currents_Sleep.mp3");
k.loadSound("high-voltage-requiem", "/sounds/music/stages/High_Voltage_Requiem.mp3");
k.loadSound("midnight-keep", "/sounds/music/stages/Midnight_at_the_Keep.mp3");
k.loadSound("unknown-trajectory", "/sounds/music/stages/starfall-station.mp3");
k.loadSound("shroomdoom", "/sounds/music/bosses/shroomdoom.mp3");
k.loadSound("ice-boss", "/sounds/music/bosses/ice-king.mp3");
k.loadSound("desert-boss", "/sounds/music/bosses/blackheart.mp3");
k.loadSound("target-locked", "/sounds/music/bosses/Target_Locked.mp3");
k.loadSound("guardian-flood", "/sounds/music/bosses/Guardian_of_the_Flood.mp3");
k.loadSound("geargrind-boss-music", "/sounds/music/bosses/i_can_t_see_it.mp3");
k.loadSound("belfry-iron-chains", "/sounds/music/bosses/Belfry_of_Iron_Chains.mp3");
k.loadSound("final-boss", "/sounds/music/bosses/final-boss.mp3");
k.loadSound(
  "level-complete",
  "/sounds/music/level%20finish%20sound/The_Perfect_Run.mp3",
);

// game scenes
k.scene("splash", Splash);
k.scene("level-select", LevelSelect);
k.scene("levelOne", LevelOne);
k.scene("levelFour", LevelFour);
k.scene("levelThree", LevelThree);
k.scene("levelFourFinal", LevelFourFinal);
k.scene("levelFive", LevelFive);
k.scene("levelVolcano", LevelVolcano);
k.scene("levelUnderwater", LevelUnderwater);
k.scene("levelStormFactory", LevelStormFactory);
k.scene("levelHauntedRuins", LevelHauntedRuins);
k.scene("levelSix", LevelSix);
k.scene("main-menu", MainMenu);
k.scene("levelOneBoss", BossLevelOne);
k.scene("chemicalBoss", ChemicalBoss);
k.scene("iceBoss", IceBoss);
k.scene("desertBoss", DesertBoss);
k.scene("volcanoBoss", VolcanoBoss);
k.scene("underwaterBoss", UnderwaterBoss);
k.scene("stormFactoryBoss", StormFactoryBoss);
k.scene("hauntedRuinsBoss", HauntedRuinsBoss);
k.scene("spaceBoss", SpaceBoss);
k.scene("game-over", GameOver);
k.scene("victory", Victory);
k.go("splash");
