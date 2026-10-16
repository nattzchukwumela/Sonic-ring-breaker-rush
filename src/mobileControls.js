import { k } from "./kaplayCtx";

const CONTROL_GROUPS = [
  {
    className: "mobile-controls__directions",
    controls: [
      { action: "left", label: "◀", ariaLabel: "Move left" },
      { action: "right", label: "▶", ariaLabel: "Move right" },
    ],
  },
  {
    className: "mobile-controls__actions",
    controls: [
      { action: "roll", label: "SPIN", ariaLabel: "Spin attack" },
      { action: "jump", label: "JUMP", ariaLabel: "Jump or double jump" },
    ],
  },
];

let controlsRoot = null;
let sceneLeaveController = null;
const pointerActions = new Map();
const actionPointers = new Map();

function releasePointer(pointerId) {
  const action = pointerActions.get(pointerId);
  if (!action) return;

  pointerActions.delete(pointerId);
  const pointers = actionPointers.get(action);
  pointers?.delete(pointerId);

  if (!pointers?.size) {
    actionPointers.delete(action);
    k.releaseButton(action);
  }
}

function releaseAllControls() {
  for (const action of actionPointers.keys()) k.releaseButton(action);
  pointerActions.clear();
  actionPointers.clear();
  controlsRoot
    ?.querySelectorAll(".mobile-control--pressed")
    .forEach((button) => button.classList.remove("mobile-control--pressed"));
}

function makeControlButton({ action, label, ariaLabel }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `mobile-control mobile-control--${action}`;
  button.dataset.action = action;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    button.setPointerCapture?.(event.pointerId);
    pointerActions.set(event.pointerId, action);

    const pointers = actionPointers.get(action) ?? new Set();
    const wasReleased = pointers.size === 0;
    pointers.add(event.pointerId);
    actionPointers.set(action, pointers);
    button.classList.add("mobile-control--pressed");

    if (wasReleased) k.pressButton(action);
  });

  const release = (event) => {
    event.preventDefault();
    event.stopPropagation();
    releasePointer(event.pointerId);
    if (!actionPointers.has(action)) {
      button.classList.remove("mobile-control--pressed");
    }
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
  button.addEventListener("contextmenu", (event) => event.preventDefault());
  return button;
}

function createMobileControls() {
  const root = document.createElement("div");
  root.id = "mobile-controls";
  root.setAttribute("aria-label", "Game controls");
  root.setAttribute("aria-hidden", "true");

  for (const group of CONTROL_GROUPS) {
    const container = document.createElement("div");
    container.className = group.className;
    for (const control of group.controls) {
      container.append(makeControlButton(control));
    }
    root.append(container);
  }

  document.body.append(root);
  window.addEventListener("blur", releaseAllControls);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) releaseAllControls();
  });
  return root;
}

export function showMobileControls() {
  controlsRoot ??= createMobileControls();
  controlsRoot.classList.add("mobile-controls--active");
  controlsRoot.setAttribute("aria-hidden", "false");

  sceneLeaveController?.cancel();
  sceneLeaveController = k.onSceneLeave(hideMobileControls);
}

export function hideMobileControls() {
  releaseAllControls();
  controlsRoot?.classList.remove("mobile-controls--active");
  controlsRoot?.setAttribute("aria-hidden", "true");
  sceneLeaveController?.cancel();
  sceneLeaveController = null;
}
