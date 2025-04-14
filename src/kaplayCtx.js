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
      keyboard: ["up"],
      mouse: "left",
    },
    roll: {
      keyboard: ["down"],
    },
    run: {
      keyboard: ["right"],
    },
  },
  debug: true,
  debugKey: "d",
});
