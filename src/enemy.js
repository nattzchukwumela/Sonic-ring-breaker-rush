import { k } from "./kaplayCtx";

const playHit = (enemy) => {
  // Stop enemy movement (optional)
  enemy.use(k.move(0, 0));

  // Animate scale and opacity down to zero over 1s
  const duration = 1;

  // Shrink and fade out manually
  const shrinkAndFade = () => {
    const startTime = k.time();
    const startScale = enemy.scale.clone();
    const startOpacity = enemy.opacity;

    enemy.onUpdate(() => {
      const elapsed = k.time() - startTime;
      const t = Math.min(elapsed / duration, 1);

      enemy.scale = k.vec2(startScale.x * (1 - t), startScale.y * (1 - t));
      enemy.opacity = startOpacity * (1 - t);

      if (t >= 1) {
        k.destroy(enemy);
      }
    });
  };

  shrinkAndFade();
};

export default playHit;
