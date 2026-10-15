import { k } from "./kaplayCtx";

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
  maxHealth = 3,
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
    sonic.vel = k.vec2(sourceX >= sonic.pos.x ? -520 : 520, -720);

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
