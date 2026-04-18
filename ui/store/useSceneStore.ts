import { create } from "zustand";

type SceneState = "main" | "modal";

const sceneNext = {
  main: "modal",
  modal: "main",
} as const satisfies Record<SceneState, SceneState>;

type SceneNext = typeof sceneNext;

type SceneStore = {
  sceneState: SceneState;
  isCurrentScene: (x: SceneState) => boolean;
  setNextScene: <T extends SceneState>(scene: SceneNext[T]) => () => void;
  resetScene: () => void;
};

const initSceneState: SceneState = "main";

export const useSceneStore = create<SceneStore>((set, get) => ({
  sceneState: initSceneState,
  isCurrentScene: (scene) => get().sceneState === scene,
  setNextScene:
    // Usage: setNextScene<"main">("modal")()
    //
    // This explicitly defines both the current and next states,
    // ensuring that the transition is valid at the type-level.
    //
    // While the current state machine is simple,
    // it is implemented as a higher-order function to reserve space for future logic,
    // such as conditional transitions based on extra arguments.
      <T extends SceneState>(scene: SceneNext[T]) =>
      () =>
        set((_state) => ({ sceneState: scene })),
  resetScene: () => set((_state) => ({ sceneState: initSceneState })),
}));
