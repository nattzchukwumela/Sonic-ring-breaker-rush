import { k } from "./kaplayCtx";

export function setupMobileExperience() {
  const portraitPhone = window.matchMedia("(pointer: coarse) and (orientation: portrait)");

  const updateOrientation = () => {
    k.debug.paused = portraitPhone.matches;
  };

  portraitPhone.addEventListener("change", updateOrientation);
  updateOrientation();

  // iOS starts Web Audio suspended until a real tap or key press.
  const unlockAudio = () => {
    const audio = k.audioCtx;
    if (audio.state === "running") return;

    const source = audio.createBufferSource();
    source.buffer = audio.createBuffer(1, 1, audio.sampleRate);
    source.connect(audio.destination);
    source.start(0);
    void audio.resume().catch(() => {});
  };

  window.addEventListener("pointerdown", unlockAudio, { capture: true });
  window.addEventListener("touchend", unlockAudio, { capture: true });
  window.addEventListener("keydown", unlockAudio, { capture: true });
}
