# Progress: BabylonML - Basic XR Support Added

## What Works (Assumed based on file structure)

-   Basic scene setup (`<bml-scene>`).
-   Entity creation (`<bml-entity>`).
-   Core components:
    -   `position`
    -   `rotation`
    -   `scale`
    -   `material` (basic color/texture support)
    -   `geometry` (supports primitives: `box`, `sphere`, `plane`, `cylinder`, `cone`, `ground`; `mesh`, `photodome`, `videodome`).
    -   `camera` (supports `universal`, `arcRotate` types, sets first camera as active).
-   **NEW:** Basic XR support via `xr` attribute on `<bml-scene>` (handles `vr`, `ar`, `true`). Integrates `WebXRDefaultExperience`.
-   Primitive element (`<bml-box>`).
-   Component registration and management system.
-   Attribute parsing for component data (`parsers.js`).
-   Build process via Rollup (`rollup.config.js`).
-   Documentation structure via MkDocs (`mkdocs.yml`, `docs/`).
-   Asynchronous mesh loading via `SceneLoader`.
-   `PhotoDome` and `VideoDome` integration.
-   Updated `geometry` component documentation (`docs/components/geometry.md`).
-   Created `camera` component documentation (`docs/components/camera.md`).
-   **NEW:** Updated scene documentation (`docs/concepts/scene.md`) for `xr` attribute.

## What's Left to Build

1.  **Build:** Run `npm run build` to bundle the library including XR changes.
2.  **Test Examples:** Test `examples/vr_scene.html` and `examples/ar_scene.html` in compatible environments.
3.  **README:** Update `README.md` to mention the new XR feature.
4.  **Versioning:** Update `package.json` version (e.g., to 1.2.0).
5.  **(DONE)** Custom Mesh Loading: Implemented in `geometry` component.
6.  **(DONE)** PhotoDome: Implemented in `geometry` component.
7.  **(DONE)** VideoDome: Implemented in `geometry` component.
8.  **(DONE)** Geometry Documentation: Updated `docs/components/geometry.md`.
9.  **(DONE)** Camera Component: Implemented `camera.js`, registered it, created `docs/components/camera.md`.
10. **(DONE)** Examples: Created examples for `mesh`, `photodome`, `videodome`.
11. **(DONE)** Basic XR Support: Implemented `xr` attribute on `<bml-scene>`, integrated `WebXRDefaultExperience`, updated docs, created examples.

## Current Status

-   Core framework structure is in place.
-   Basic primitives, transform, material, geometry (including mesh/domes), and camera components are functional.
-   **NEW:** Basic XR support (VR/AR session entry) via `xr` attribute on `<bml-scene>` is implemented.
-   Documentation updated for `geometry`, `camera`, and `scene` (XR attribute).
-   Memory Bank files (`activeContext.md`, `progress.md`) updated.
-   **NEW:** Examples created for VR and AR.
-   Next steps involve building the library and testing the new XR examples.

## Known Issues

-   Error handling for asset loading (`mesh`, `photodome`, `videodome`) is basic (console warnings/errors). More robust user feedback or fallback mechanisms could be added.
-   Updating properties *other than* `type` or `src` for `mesh`, `photodome`, `videodome` after initial creation is not supported (requires recreation).
-   Performance implications of loading large assets haven't been tested.
-   Interaction between the `material` component and the internal materials of `PhotoDome`/`VideoDome` might need refinement/clarification.
-   `camera` component's `update` logic currently disposes and recreates the camera; a more efficient update modifying existing properties could be implemented later.
-   Active camera logic is basic ('first component wins'). More complex scenarios (multiple cameras, dynamic removal) might require more sophisticated handling.
-   **NEW:** XR error handling is basic; relies on console messages and `WebXRDefaultExperience` UI.
-   **NEW:** XR feature set is minimal (session entry only). Controllers, advanced AR features (hit-testing, anchors), etc., are not yet declaratively supported.
-   **NEW:** Compatibility and performance of XR features across different devices/browsers need testing.
-   **FIXED:** `ReferenceError: BABYLON is not defined` in geometry component (used imported `AbstractMesh`).
-   **FIXED:** Mesh loading example (`mesh_example.html`) updated to use a CORS-enabled URL (`Avocado.glb`).
-   **FIXED:** Mesh loading logic in `geometry` component updated to correctly handle URLs with query parameters by passing the full URL as the filename to `SceneLoader.ImportMeshAsync`.
-   **FIXED:** Mesh loading error ("JSON parse") by installing `@babylonjs/loaders` and importing `@babylonjs/loaders/glTF` in `geometry.js` to ensure the loader is registered.

## Project Evolution / Decisions

-   **Decision Implemented:** Extended the existing `geometry` component to handle `mesh`, `photodome`, and `videodome` types.
-   **Decision Implemented:** Created a new `camera` component to handle camera definitions declaratively.
-   **Decision Implemented:** Added basic XR support via an `xr` attribute on `<bml-scene>` leveraging `WebXRDefaultExperience`.
