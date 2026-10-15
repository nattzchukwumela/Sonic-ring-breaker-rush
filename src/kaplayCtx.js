import kaplay from "kaplay";

export const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true,
  global: false,
  background: [0, 112, 192],
  touchToMouse: true,
  buttons: {
    jump: {
      keyboard: ["space", "up", "w"],
      mouse: "left",
    },
    roll: {
      keyboard: ["down", "s"],
    },
    left: {
      keyboard: ["left", "a"],
    },
    right: {
      keyboard: ["right", "d"],
    },
  },
  debug: false,
  debugKey: "d",
});
