import { makeRing } from "../entities/ring";
import { makeSonic, SONIC_FOOT_OFFSET } from "../entities/sonic";
import { saveBestScore, unlockStage } from "../gameState";
import { addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

const LARGE_PLATFORM_SCALE = 0.28;
const SHORT_PLATFORM_SCALE = 0.22;
const LARGE_PLATFORM_WIDTH = 2172 * LARGE_PLATFORM_SCALE;
const SHORT_PLATFORM_WIDTH = 1346 * SHORT_PLATFORM_SCALE;

export function LevelThree(options = {}) {
  let score = Number(options.score ?? 0);
  let rings = 0;
  let stageActive = true;

  k.setGravity(2800);
  const music = k.play("sky-patrol", { loop: true, volume: 0.3 });

  k.add([
    k.sprite("sky-islands-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.scale(1920 / 1672, 1080 / 941),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.rgb(28, 102, 205)),
    k.opacity(0.08),
    k.z(-9),
  ]);

  const scoreText = addHudText(`SCORE  ${score}`, k.vec2(34, 28));
  const ringText = addHudText("RINGS  0", k.vec2(34, 82), {
    color: k.rgb(255, 220, 48),
  });
  addHudText("REACH THE TOP ISLAND", k.vec2(1880, 32), {
    anchor: "topright",
    color: k.rgb(255, 220, 48),
  });
  addHudText(
    "SKY PATROL  •  A / D MOVE  •  SPACE / ↑ JUMP  •  FALLING PLATFORMS SHAKE",
    k.vec2(960, 1030),
    {
      size: 27,
      anchor: "bot",
    },
  );

  const addPlatform = ({ sprite, x, y, scale, width, falling = false }) => {
    const visual = k.add([
      k.sprite(sprite),
      k.pos(x, y),
      k.scale(scale),
      k.opacity(1),
      k.z(1),
    ]);
    const surface = k.add([
      k.rect(width, 26),
      k.pos(x, y - SONIC_FOOT_OFFSET),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "sky-platform",
      falling ? "falling-platform" : null,
      {
        visual,
        armed: false,
        dropping: false,
        fallSpeed: 0,
      },
    ].filter(Boolean));

    surface.onUpdate(() => {
      if (!surface.exists() || !visual.exists()) return;

      if (surface.dropping) {
        surface.fallSpeed += 1750 * k.dt();
        surface.pos.y += surface.fallSpeed * k.dt();
        visual.pos.x = surface.pos.x;
        visual.pos.y = surface.pos.y + SONIC_FOOT_OFFSET;

        if (surface.pos.y > k.height() + 320) {
          k.destroy(visual);
          k.destroy(surface);
        }
        return;
      }

      if (surface.armed) {
        visual.pos.x = surface.pos.x + Math.sin(k.time() * 52) * 8;
        visual.opacity = 0.72 + Math.sin(k.time() * 30) * 0.2;
      }
    });

    return surface;
  };

  addPlatform({
    sprite: "sky-large-platform",
    x: 0,
    y: 940,
    scale: LARGE_PLATFORM_SCALE,
    width: LARGE_PLATFORM_WIDTH,
  });
  addPlatform({
    sprite: "sky-short-platform",
    x: 570,
    y: 805,
    scale: SHORT_PLATFORM_SCALE,
    width: SHORT_PLATFORM_WIDTH,
  });
  addPlatform({
    sprite: "sky-short-platform",
    x: 900,
    y: 670,
    scale: SHORT_PLATFORM_SCALE,
    width: SHORT_PLATFORM_WIDTH,
    falling: true,
  });
  addPlatform({
    sprite: "sky-short-platform",
    x: 1230,
    y: 535,
    scale: SHORT_PLATFORM_SCALE,
    width: SHORT_PLATFORM_WIDTH,
  });
  addPlatform({
    sprite: "sky-short-platform",
    x: 900,
    y: 400,
    scale: SHORT_PLATFORM_SCALE,
    width: SHORT_PLATFORM_WIDTH,
    falling: true,
  });
  addPlatform({
    sprite: "sky-large-platform",
    x: 250,
    y: 265,
    scale: LARGE_PLATFORM_SCALE,
    width: LARGE_PLATFORM_WIDTH,
  });

  const ringPositions = [
    k.vec2(710, 635),
    k.vec2(1040, 500),
    k.vec2(1370, 365),
    k.vec2(1040, 230),
  ];
  for (const position of ringPositions) makeRing(position);

  k.add([
    k.circle(58),
    k.pos(550, 105),
    k.anchor("center"),
    k.area(),
    k.color(k.rgb(255, 225, 55)),
    k.outline(12, k.rgb(55, 150, 255)),
    k.opacity(0.82),
    k.z(3),
    "sky-goal",
  ]);
  addHudText("EXIT", k.vec2(550, 105), {
    size: 28,
    anchor: "center",
    color: k.rgb(255, 255, 255),
    z: 4,
  });

  const sonic = makeSonic(k.vec2(250, 660), 1500);
  sonic.setJump();
  sonic.setRoll();
  sonic.setEvents();
  sonic.setMoveForward({ speed: 560 });

  const loseStage = () => {
    if (!stageActive) return;
    stageActive = false;
    sonic.isDead = true;
    music.stop();
    saveBestScore(score);
    k.go("game-over", {
      retryScene: "levelThree",
      stageName: "Sky Patrol",
      score,
      reason: "Sonic fell below the floating islands.",
    });
  };

  sonic.onCollide("falling-platform", (platform) => {
    if (!stageActive || platform.armed) return;
    platform.armed = true;

    k.wait(0.85, () => {
      if (!stageActive || !platform.exists()) return;
      platform.dropping = true;
      platform.visual.opacity = 1;
    });
  });

  sonic.onCollide("ring", (ring) => {
    if (!stageActive) return;
    k.destroy(ring);
    k.play("ring", { volume: 0.45 });
    rings += 1;
    score += 10;
    scoreText.text = `SCORE  ${score}`;
    ringText.text = `RINGS  ${rings}`;
  });

  sonic.onCollide("sky-goal", () => {
    if (!stageActive) return;
    stageActive = false;
    music.stop();
    score += rings * 25;
    saveBestScore(score);
    unlockStage(4);
    k.go("victory", {
      title: "SKY PATROL CLEAR!",
      message: `Frozen Glacier Valley unlocked • Ring bonus: ${rings * 25}`,
      score,
      nextScene: "levelFourFinal",
    });
  });

  k.onUpdate(() => {
    if (stageActive && sonic.pos.y > k.height() + 150) loseStage();
  });

  k.onKeyPress("escape", () => {
    music.stop();
    k.go("level-select");
  });
}
