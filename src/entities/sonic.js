import { k } from "../kaplayCtx";

export function makeSonic(pos, jumpPower = 1700) {
  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: jumpPower }),
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
            k.vec2(200, 100);
            setTimeout(() => {
              this.play("run");
            }, 2000);
            k.play("roll", { volume: 0.5 });
          }
        });
      },
      setEvents() {
        this.onGround(() => {
          this.play("run");
        });
      },
      setMoveForward() {
        const speed = 250;

        k.onKeyDown("right", () => {
          // if (this.isGrounded()) {
          //   this.play("run");
          // }

          this.move(speed, 0);
        });

        k.onKeyRelease("right", () => {
          this.stop();
          this.play("run"); // optional, if you add an idle animation
        });
      },
    },
  ]);
  return sonic;
}
