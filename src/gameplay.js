import { k } from "./kaplayCtx";

export const STANDARD_BOSS_MAX_HEALTH = 15;
export const FINAL_BOSS_MAX_HEALTH = 20;

export function addHudText(value, position, options = {}) {
  return k.add([
    k.text(value, {
      font: options.font ?? "mania",
      size: options.size ?? 42,
    }),
    k.pos(position),
    k.color(options.color ?? k.rgb(255, 255, 255)),
    k.outline(4, k.rgb(10, 28, 56)),
    k.fixed(),
    k.z(options.z ?? 20),
    options.anchor ? k.anchor(options.anchor) : null,
  ].filter(Boolean));
}

export function addGround(y = 880) {
  return k.add([
    k.rect(k.width(), k.height() - y),
    k.pos(0, y),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "ground",
  ]);
}

export function createPlayerHealth({
  sonic,
  healthText,
  maxHealth = 10,
  onDeath,
}) {
  let health = maxHealth;
  let invulnerable = false;
  let dead = false;

  const updateText = () => {
    healthText.text = `SONIC  ${"♥".repeat(health)}${"♡".repeat(maxHealth - health)}`;
  };

  const damage = (sourceX = sonic.pos.x) => {
    if (dead || invulnerable) return false;

    health -= 1;
    updateText();
    k.play("hurt", { volume: 0.55 });

    if (health <= 0) {
      dead = true;
      sonic.isDead = true;
      sonic.opacity = 0.45;
      sonic.vel = k.vec2(0, -850);
      k.wait(0.8, onDeath);
      return true;
    }

    invulnerable = true;
    sonic.isInvulnerable = true;
    const pushDirection = sourceX >= sonic.pos.x ? -1 : 1;
    sonic.vel.x = 0;
    sonic.vel.y = -720;
    sonic.pos.x = k.clamp(
      sonic.pos.x + pushDirection * 82,
      82,
      k.width() - 82,
    );

    const blink = sonic.onUpdate(() => {
      sonic.opacity = Math.floor(k.time() * 12) % 2 === 0 ? 0.25 : 1;
    });

    k.wait(1.35, () => {
      blink.cancel();
      if (!sonic.exists()) return;
      sonic.opacity = 1;
      sonic.isInvulnerable = false;
      invulnerable = false;
    });

    return true;
  };

  updateText();

  return {
    damage,
    isDead: () => dead,
    value: () => health,
  };
}

export function addActionButton({ label, position, onPress, width = 460 }) {
  const button = k.add([
    k.rect(width, 86, { radius: 18 }),
    k.pos(position),
    k.anchor("center"),
    k.area(),
    k.color(k.rgb(15, 67, 140)),
    k.outline(6, k.rgb(255, 210, 48)),
    k.z(20),
    "menu-button",
  ]);

  k.add([
    k.text(label, { font: "mania", size: 44 }),
    k.pos(position),
    k.anchor("center"),
    k.color(k.rgb(255, 255, 255)),
    k.z(21),
  ]);

  button.onHoverUpdate(() => {
    button.color = k.rgb(26, 104, 203);
    k.setCursor("pointer");
  });
  button.onHoverEnd(() => {
    button.color = k.rgb(15, 67, 140);
    k.setCursor("default");
  });
  button.onClick(onPress);

  return button;
}

export function addPauseFeature({ onExit } = {}) {
  let paused = false;
  let overlayObjects = [];

  const pauseButtonBounds = { x: 855, y: 18, width: 210, height: 58 };
  const resumeButtonBounds = { x: 660, y: 515, width: 600, height: 82 };
  const exitButtonBounds = { x: 660, y: 625, width: 600, height: 82 };

  const addFixedButton = (label, bounds, color, z) => {
    const button = k.add([
      k.rect(bounds.width, bounds.height, { radius: 16 }),
      k.pos(bounds.x, bounds.y),
      k.color(color),
      k.outline(5, k.rgb(255, 210, 48)),
      k.fixed(),
      k.z(z),
    ]);
    const text = addHudText(
      label,
      k.vec2(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2),
      {
        size: 32,
        anchor: "center",
        z: z + 1,
      },
    );
    return [button, text];
  };

  const pauseButton = addFixedButton(
    "Ⅱ  PAUSE",
    pauseButtonBounds,
    k.rgb(15, 67, 140),
    80,
  );

  const clearOverlay = () => {
    for (const object of overlayObjects) {
      if (object.exists()) k.destroy(object);
    }
    overlayObjects = [];
  };

  const showOverlay = () => {
    overlayObjects.push(
      k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(k.rgb(3, 13, 38)),
        k.opacity(0.82),
        k.fixed(),
        k.z(100),
      ]),
      k.add([
        k.rect(760, 570, { radius: 28 }),
        k.pos(k.center()),
        k.anchor("center"),
        k.color(k.rgb(8, 42, 96)),
        k.outline(8, k.rgb(255, 210, 48)),
        k.fixed(),
        k.z(101),
      ]),
      addHudText("GAME PAUSED", k.vec2(960, 350), {
        font: "nise-sega-font",
        size: 68,
        anchor: "center",
        color: k.rgb(255, 220, 48),
        z: 102,
      }),
      addHudText("P / ESC  RESUME", k.vec2(960, 430), {
        size: 28,
        anchor: "center",
        color: k.rgb(190, 228, 255),
        z: 102,
      }),
      ...addFixedButton(
        "RESUME",
        resumeButtonBounds,
        k.rgb(24, 103, 202),
        102,
      ),
      ...addFixedButton(
        "LEVEL SELECT",
        exitButtonBounds,
        k.rgb(139, 40, 65),
        102,
      ),
    );
  };

  const setPaused = (nextPaused) => {
    if (paused === nextPaused) return;
    paused = nextPaused;

    if (paused) {
      showOverlay();
      k.debug.paused = true;
      return;
    }

    k.debug.paused = false;
    clearOverlay();
  };

  const pointIsInside = (point, bounds) =>
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height;

  k.onKeyPress(["p", "escape"], () => setPaused(!paused));
  k.onHide(() => setPaused(true));
  k.onMousePress("left", () => {
    const pointer = k.mousePos();

    if (!paused) {
      if (pointIsInside(pointer, pauseButtonBounds)) setPaused(true);
      return;
    }

    if (pointIsInside(pointer, resumeButtonBounds)) {
      setPaused(false);
    } else if (pointIsInside(pointer, exitButtonBounds)) {
      setPaused(false);
      onExit?.();
    }
  });

  k.onSceneLeave(() => {
    if (paused) k.debug.paused = false;
    paused = false;
    overlayObjects = [];
  });

  return {
    isPaused: () => paused,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    destroy: () => {
      setPaused(false);
      for (const object of pauseButton) {
        if (object.exists()) k.destroy(object);
      }
    },
  };
}

export function addScrollingBackdrop(spriteName, opacity = 0.82) {
  const width = 2304;
  const pieces = [0, width].map((x) =>
    k.add([
      k.sprite(spriteName),
      k.pos(x, 0),
      k.opacity(opacity),
      k.z(-10),
    ]),
  );

  return (speed) => {
    for (const piece of pieces) {
      piece.move(-speed, 0);
      if (piece.pos.x <= -width) piece.pos.x += width * 2;
    }
  };
}
