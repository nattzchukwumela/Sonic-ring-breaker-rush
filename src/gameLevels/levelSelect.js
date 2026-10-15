import { getBestScore, getUnlockedStage, stages } from "../gameState";
import { addActionButton, addHudText } from "../gameplay";
import { k } from "../kaplayCtx";

export default function LevelSelect() {
  k.setGravity(0);
  const unlockedStage = getUnlockedStage();

  k.add([
    k.sprite("forest-bg"),
    k.pos(k.center()),
    k.anchor("center"),
    k.opacity(0.46),
    k.z(-10),
  ]);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.rgb(3, 20, 56)),
    k.opacity(0.58),
    k.z(-9),
  ]);

  addHudText("SELECT STAGE", k.vec2(960, 110), {
    font: "nise-sega-font",
    size: 74,
    anchor: "center",
    color: k.rgb(255, 220, 48),
  });
  addHudText(`BEST SCORE  ${getBestScore()}`, k.vec2(960, 185), {
    size: 34,
    anchor: "center",
  });

  stages.forEach((stage, index) => {
    const unlocked = stage.id <= unlockedStage;
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = column === 0 ? 520 : 1400;
    const y = 350 + row * 270;
    const card = k.add([
      k.rect(760, 190, { radius: 26 }),
      k.pos(x, y),
      k.anchor("center"),
      k.area(),
      k.color(unlocked ? k.rgb(13, 68, 139) : k.rgb(45, 52, 70)),
      k.opacity(0.94),
      k.outline(7, unlocked ? k.rgb(255, 210, 48) : k.rgb(112, 120, 139)),
      k.z(2),
    ]);

    addHudText(unlocked ? `STAGE ${stage.id}  •  ${stage.name}` : `STAGE ${stage.id}  •  LOCKED`, k.vec2(x, y - 30), {
      size: 39,
      anchor: "center",
      color: unlocked ? k.rgb(255, 255, 255) : k.rgb(165, 172, 188),
      z: 3,
    });
    addHudText(unlocked ? stage.subtitle : `Clear Stage ${stage.id - 1} to unlock`, k.vec2(x, y + 40), {
      size: 26,
      anchor: "center",
      color: unlocked ? k.rgb(190, 228, 255) : k.rgb(139, 146, 162),
      z: 3,
    });

    if (unlocked) {
      card.onHoverUpdate(() => {
        card.color = k.rgb(24, 103, 202);
        k.setCursor("pointer");
      });
      card.onHoverEnd(() => {
        card.color = k.rgb(13, 68, 139);
        k.setCursor("default");
      });
      card.onClick(() => k.go(stage.scene));
    }
  });

  addActionButton({
    label: "BACK",
    position: k.vec2(960, 930),
    width: 300,
    onPress: () => k.go("main-menu"),
  });
  k.onKeyPress("escape", () => k.go("main-menu"));
}
