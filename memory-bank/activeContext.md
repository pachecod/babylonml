# Active Context: BabylonML - Documentation Improvements

## Current Focus

Improving documentation and examples related to default scene setup (camera/light) and multiple camera handling. Recently fixed bugs in the multi-camera example and the core camera component's update logic.

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
6.  **Documentation & Examples (Defaults/Multi-Camera):** **DONE**
    *   Updated `docs/concepts/scene.md` to explain default camera/light behavior and the non-functional `light` attribute placeholder.
    *   Updated `docs/components/camera.md` to explain multiple camera handling ("first-one-wins").
    *   Created `examples/default_scene.html` demonstrating default setup.
    *   Created `examples/explicit_camera_light_placeholder.html` demonstrating explicit camera and light placeholder attribute.
    *   Created `examples/multi_camera_scene.html` demonstrating multiple camera definitions.
7.  **Fix Multi-Camera Example:** **DONE**
    *   Corrected the JavaScript logic in `examples/multi_camera_scene.html` to properly attach controls when switching to a camera that initially had `attachControl: false`.
8.  **Fix Camera Component Update Logic:** **DONE**
    *   Corrected the `update` method in `src/components/camera.js` to properly use pre-parsed `position` and `target` data, ensuring UniversalCamera works correctly.
9.  **Fix Material Component Update Logic:** **DONE**
    *   Corrected the `update` method in `src/components/material.js` to convert parsed color objects (e.g., `{r,g,b}`) into `BABYLON.Color3` instances before applying them to material properties (e.g., `diffuseColor`), enabling dynamic updates via `setAttribute`.

## Next Steps

1.  Update `memory-bank/progress.md` to reflect the documentation/example updates and the recent fixes (multi-camera example, camera component update, material component update).
2.  **(DONE)** Run the build process (`npm run build`) to ensure the library includes recent changes.
3.  Test the examples, paying special attention to `multi_camera_scene.html` and `basic_scene.html` to confirm fixes.
4.  Consider implementing a basic `light` component.
5.  Update `README.md` to mention recent features (XR, camera, etc.).
6.  Update `package.json` version if appropriate.

-   **Camera Activation:** The first camera component initialized is set as active. Need to consider behavior if multiple cameras are defined or if the active one is removed dynamically. **Status: Basic 'first-one-wins' logic implemented and documented.**
-   **Camera Updates:** The `update` logic disposes and recreates the camera. It now correctly uses pre-parsed data for properties like `position` and `target`. A more refined approach (updating existing properties) could be implemented later. **Status: Basic recreate logic implemented, data parsing fixed.**
-   **Default Camera/Light:** Scene provides defaults if no `[camera]` or `[light]` attribute is present. **Status: Implemented and documented.**
-   **Light Component:** Adding a `light` attribute prevents the default light, but no component exists to parse it. **Status: Documented as a limitation; component implementation pending.**
-   **Geometry Component Decision:** Extended the existing `geometry` component for `mesh`, `photodome`, `videodome`. **Decision Implemented.**
-   **Asset Loading Errors:** Need robust error handling for external assets. **Status: Basic console logging implemented.**
-   **Async Loading:** Ensure correct handling within lifecycle. **Status: Implemented for mesh loading.**
-   **XR Initialization Timing:** Used `setTimeout` in `BmlScene` to delay XR initialization slightly, aiming to avoid race conditions with camera components. Needs testing. **Status: Implemented.**
-   **XR Error Handling:** Basic `try...catch` and support checks added in `BmlScene.#initializeXR`. More user-facing feedback could be added. **Status: Basic implementation.**
-   **XR Feature Scope:** Initial implementation uses `WebXRDefaultExperience` for basic session entry. Controllers, teleportation, hit-testing etc., are not yet declaratively supported. **Status: Basic implementation.**
