# Active Context: BabylonML - Feature Expansion

## Current Focus

Implementing and verifying the `camera` component to allow declarative camera definition and control within BabylonML scenes. Addressing the issue where a default camera was overriding the user-defined camera in `examples/mesh_example.html`.

## Task Breakdown (Camera Component Added)

1.  **Camera Component Implementation:** **DONE**
    *   Created `src/components/camera.js` with logic for `arcRotate` and `universal` types.
    *   Implemented logic to set the first camera component as `scene.activeCamera`.
    *   Added `registerCameraComponent` function.
    *   Registered component in `src/components/registerCoreComponents.js`.
    *   Created documentation `docs/components/camera.md`.
2.  **Custom Mesh Loading:** **DONE**
    *   Modified `geometry` component (`src/components/geometry.js`) to handle `type: 'mesh'`.
    *   Added `src` attribute parsing.
    *   Integrated `SceneLoader.ImportMeshAsync`.
    *   Updated documentation (`docs/components/geometry.md`).

2.  **PhotoDome Implementation:** **DONE**
    *   Modified `geometry` component to handle `type: 'photodome'`.
    *   Integrated `BABYLON.PhotoDome`.
    *   Added `src`, `resolution`, `size`, `useDirectMapping` attributes.
    *   Updated documentation.

3.  **VideoDome Implementation:** **DONE**
    *   Modified `geometry` component to handle `type: 'videodome'`.
    *   Integrated `BABYLON.VideoDome`.
    *   Added `src`, `resolution`, `size`, `autoPlay`, `loop`, `muted`, `clickToPlay`, `poster` attributes.
    *   Updated documentation.

## Next Steps

1.  Update `memory-bank/progress.md` to reflect the addition of the `camera` component.
2.  Run the build process (`npm run build`) to ensure the changes are bundled correctly.
3.  Verify `examples/mesh_example.html` uses the `ArcRotateCamera` as intended.
4.  Update `README.md` if necessary.
5.  Update `package.json` version if appropriate.
6.  **(DONE)** Create examples for `mesh`, `photodome`, `videodome`.

## Active Decisions/Considerations

-   **Camera Activation:** The first camera component initialized is set as active. Need to consider behavior if multiple cameras are defined or if the active one is removed dynamically. **Status: Basic 'first-one-wins' logic implemented.**
-   **Camera Updates:** The current `update` logic disposes and recreates the camera. A more refined approach would update properties on the existing camera instance where possible. **Status: Basic recreate logic implemented.**
-   **Geometry Component Decision:** Extended the existing `geometry` component for `mesh`, `photodome`, `videodome`. **Decision Implemented.**
-   **Asset Loading Errors:** Need robust error handling for external assets. **Status: Basic console logging implemented.**
-   **Async Loading:** Ensure correct handling within lifecycle. **Status: Implemented for mesh loading.**
