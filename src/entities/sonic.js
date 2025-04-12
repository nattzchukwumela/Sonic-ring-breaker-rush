import { k } from "../kaplayCtx";

let slide = false;
function makeSonic(pos) {
  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: 1700 }),
    {
      setJump() {
        k.onButtonPress("jump", () => {
          if (this.isGrounded()) {
            this.play("jump");
            this.jump();
            k.play("jump", { volume: 0.5 });
          }
        });
      },
      setRoll() {
        k.onButtonPress("roll", () => {
          if (this.isGrounded()) {
            this.play("roll");
            slide = true;
            setTimeout(() => {
              this.play("run");
              slide = false;
            }, 2000);
            k.play("roll", { volume: 0.5 });
          }
        });
        return slide;
      },
      setEvents() {
        this.onGround(() => {
          this.play("run");
        });
      },
    },
  ]);
  return sonic;
}

export { slide, makeSonic };
