const isInstalled = () =>
  window.matchMedia("(display-mode: fullscreen)").matches ||
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const getFullscreenElement = () =>
  document.fullscreenElement ?? document.webkitFullscreenElement ?? null;

export function setupPwaExperience() {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      void navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    });
  }

  const controls = document.createElement("div");
  controls.id = "pwa-controls";
  controls.setAttribute("aria-label", "App controls");

  const installButton = document.createElement("button");
  installButton.type = "button";
  installButton.className = "pwa-control";
  installButton.textContent = "INSTALL APP";
  installButton.setAttribute("aria-label", "Install Ringbreaker Rush");
  installButton.hidden = true;

  const fullscreenButton = document.createElement("button");
  fullscreenButton.type = "button";
  fullscreenButton.className = "pwa-control";
  fullscreenButton.textContent = "⛶ FULLSCREEN";
  fullscreenButton.setAttribute("aria-label", "Enter fullscreen");

  let installPrompt = null;
  const supportsFullscreen =
    typeof document.documentElement.requestFullscreen === "function" ||
    typeof document.documentElement.webkitRequestFullscreen === "function";

  if (!isInstalled()) controls.append(installButton);
  if (supportsFullscreen && !isInstalled()) controls.append(fullscreenButton);
  if (!controls.childElementCount) return;
  document.body.append(controls);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton.hidden = true;
  });

  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });

  const updateFullscreenButton = () => {
    const fullscreen = Boolean(getFullscreenElement());
    fullscreenButton.textContent = fullscreen
      ? "× EXIT FULLSCREEN"
      : "⛶ FULLSCREEN";
    fullscreenButton.setAttribute(
      "aria-label",
      fullscreen ? "Exit fullscreen" : "Enter fullscreen",
    );
  };

  fullscreenButton.addEventListener("click", async () => {
    try {
      if (getFullscreenElement()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else document.webkitExitFullscreen?.();
        return;
      }

      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
      } else {
        document.documentElement.webkitRequestFullscreen?.();
      }

      if (screen.orientation?.lock) {
        await screen.orientation.lock("landscape").catch(() => {});
      }
    } catch (error) {
      console.warn("Fullscreen request failed:", error);
    }
  });

  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
  updateFullscreenButton();
}
