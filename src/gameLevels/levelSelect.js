import { k } from "../kaplayCtx";

export default function LevelSelect() {
  if (!k.getData("best-score")) k.setData("best-score", 0);

  k.add([
    k.text("Select Stage", { size: 48, font: "mania" }),
    k.pos(k.center().x, 80),
    k.anchor("center"),
  ]);

  const stages = [
    { name: "Level 1", scene: "levelOne", unlocked: true },
    { name: "Level 2", scene: "levelFour", unlocked: false },
    { name: "Level 3", scene: "levelThree", unlocked: false },
    { name: "Level 4", scene: "levelFour", unlocked: true },
  ];

  let yAxis = -250;
  stages.forEach((stage, index) => {
    const button = k.add([
      k.sprite("forest-bg"),
      k.pos(k.center().x, k.center().y + yAxis),
      k.anchor("center"),
      k.scale(0.15),
      k.area(),
      k.z(1),
      "level-button",
      { stage },
    ]);

    // Add text on top of the sprite
    k.add([
      k.text(stage.unlocked ? stage.name : "Locked", {
        size: 32,
        font: "mania",
      }),
      k.pos(k.center().x, k.center().y + yAxis + 50),
      k.anchor("center"),
      k.color(stage.unlocked ? k.rgb(255, 255, 255) : k.rgb(0.5, 0.5, 0.5)),
      k.z(2),
    ]);

    button.onClick(() => {
      if (stage.unlocked) {
        k.play("ingame-sound", { volume: 0.5, loop: true });
        k.go(stage.scene);
      }
    });

    yAxis += 200;
  });
}
