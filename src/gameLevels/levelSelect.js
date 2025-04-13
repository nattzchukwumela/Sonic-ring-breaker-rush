import { k } from "../kaplayCtx";

export default function LevelSelect() {
  k.add([
    k.text("Select Stage", { size: 48, font: "mania" }),
    k.pos(k.center().x, 80),
    k.anchor("center"),
  ]);

  const stages = [
    { name: "Level 1", scene: "levelOne", unlocked: true },
    { name: "Level 2", scene: "levelFour", unlocked: true }, // Set to false if locked
    { name: "Level 3", scene: "levelThree", unlocked: false },
  ];

  const buttonYStart = 180;

  stages.forEach((stage, index) => {
    const y = buttonYStart + index * 100;
    const button = k.add([
      k.text(stage.unlocked ? stage.name : "Locked", {
        size: 32,
        font: "mania",
      }),
      k.pos(k.center().x, y),
      k.anchor("center"),
      k.area(),
      k.color(stage.unlocked ? k.rgb(1, 1, 1) : k.rgb(0.5, 0.5, 0.5)),
      "level-button",
      { stage },
    ]);

    button.onClick(() => {
      if (stage.unlocked) {
        k.play("ingame-sound", { volume: 0.5, loop: true });
        k.go(stage.scene);
      }
    });
  });
}
