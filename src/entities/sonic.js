import { k } from "../kaplayCtx";
import { showMobileControls } from "../mobileControls";

export const SONIC_FOOT_OFFSET = 88;

export function makeSonic(pos, jumpPower = 1700) {
  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area({ shape: new k.Rect(k.vec2(-11, -22), 22, 44) }),
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: jumpPower }),
    k.opacity(1),
    "sonic",
    {
      isRolling: false,
      isInvulnerable: false,
      isDead: false,
      jumpsUsed: 0,
      maxJumps: 2,
      jumpReady: false,
      rollReady: false,
      moveReady: false,
      setJump() {
        if (this.jumpReady) return;
        this.jumpReady = true;
        showMobileControls();
        this.onGround(() => {
          this.jumpsUsed = 0;
        });
        k.onButtonPress("jump", () => {
          if (this.isDead) return;

          const grounded = this.isGrounded();
          if (grounded) this.jumpsUsed = 0;
          else if (this.jumpsUsed === 0) this.jumpsUsed = 1;
          if (this.jumpsUsed >= this.maxJumps) return;

          this.play("jump");
          if (grounded) this.jump(jumpPower);
          else this.vel.y = -jumpPower * 0.9;
          this.jumpsUsed += 1;
          k.play("jump", { volume: 0.5 });
        });
      },
      setRoll() {
        if (this.rollReady) return;
        this.rollReady = true;
        k.onButtonPress("roll", () => {
          if (!this.isDead && this.isGrounded() && !this.isRolling) {
            this.isRolling = true;
            this.play("roll");
            k.wait(0.7, () => {
              if (!this.exists() || this.isDead) return;
              this.isRolling = false;
              this.play("run");
            });
            k.play("roll", { volume: 0.5 });
          }
        });
      },
      setEvents() {
        this.onGround(() => {
          if (!this.isDead && !this.isRolling) this.play("run");
        });
        this.onUpdate(() => {
          this.pos.x = k.clamp(this.pos.x, 72, k.width() - 72);
        });
      },
      setMoveForward({ speed = 520, minX = 90, maxX = 1830 } = {}) {
        if (this.moveReady) return;
        this.moveReady = true;
        k.onButtonDown("left", () => {
          if (!this.isDead) this.move(-speed, 0);
        });
        k.onButtonDown("right", () => {
          if (!this.isDead) this.move(speed, 0);
        });
        this.onUpdate(() => {
          this.pos.x = k.clamp(this.pos.x, minX, maxX);
        });
      },
      isAttacking() {
        return !this.isDead && (this.isRolling || !this.isGrounded());
      },
      bounce() {
        if (this.isDead) return;
        this.play("jump");
        this.vel.x = 0;
        this.vel.y = -1050;
        this.jumpsUsed = 1;
      },
    },
  ]);
  return sonic;
}
