# Active Context: BabylonML - XR Implementation

## Current Focus

Implementing basic WebXR (VR and AR) support via a declarative attribute on the `<bml-scene>` element.

## Task Breakdown (XR Support Added)

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
3.  **PhotoDome Implementation:** **DONE**
    *   Modified `geometry` component to handle `type: 'photodome'`.
    *   Integrated `BABYLON.PhotoDome`.
    *   Added `src`, `resolution`, `size`, `useDirectMapping` attributes.
    *   Updated documentation.
4.  **VideoDome Implementation:** **DONE**
    *   Modified `geometry` component to handle `type: 'videodome'`.
    *   Integrated `BABYLON.VideoDome`.
    *   Added `src`, `resolution`, `size`, `autoPlay`, `loop`, `muted`, `clickToPlay`, `poster` attributes.
    *   Updated documentation.
5.  **Basic XR Support:** **DONE**
    *   Added `xr` attribute handling (`vr`, `ar`, `true`) to `<bml-scene>` (`src/core/BmlScene.js`).
    *   Integrated `WebXRDefaultExperience` for basic session management.
    *   Added XR helper initialization and disposal logic.
    *   Updated scene documentation (`docs/concepts/scene.md`).
    *   Created VR example (`examples/vr_scene.html`).
    *   Created AR example (`examples/ar_scene.html`).

## Next Steps

1.  Update `memory-bank/progress.md` to reflect the addition of the `xr` feature.
2.  Run the build process (`npm run build`) to ensure the changes are bundled correctly.
3.  Test the new examples (`vr_scene.html`, `ar_scene.html`) in compatible environments (requires build first).
4.  Update `README.md` to mention the new XR feature.
5.  Update `package.json` version if appropriate (e.g., to 1.2.0).

## Active Decisions/Considerations

-   **Camera Activation:** The first camera component initialized is set as active. Need to consider behavior if multiple cameras are defined or if the active one is removed dynamically. **Status: Basic 'first-one-wins' logic implemented.**
-   **Camera Updates:** The current `update` logic disposes and recreates the camera. A more refined approach would update properties on the existing camera instance where possible. **Status: Basic recreate logic implemented.**
-   **Geometry Component Decision:** Extended the existing `geometry` component for `mesh`, `photodome`, `videodome`. **Decision Implemented.**
-   **Asset Loading Errors:** Need robust error handling for external assets. **Status: Basic console logging implemented.**
-   **Async Loading:** Ensure correct handling within lifecycle. **Status: Implemented for mesh loading.**
-   **XR Initialization Timing:** Used `setTimeout` in `BmlScene` to delay XR initialization slightly, aiming to avoid race conditions with camera components. Needs testing. **Status: Implemented.**
-   **XR Error Handling:** Basic `try...catch` and support checks added in `BmlScene.#initializeXR`. More user-facing feedback could be added. **Status: Basic implementation.**
-   **XR Feature Scope:** Initial implementation uses `WebXRDefaultExperience` for basic session entry. Controllers, teleportation, hit-testing etc., are not yet declaratively supported. **Status: Basic implementation.**
