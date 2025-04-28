# Progress: BabylonML - Geometry Features Added

## What Works (Assumed based on file structure)

-   Basic scene setup (`<bml-scene>`).
-   Entity creation (`<bml-entity>`).
-   Core components:
    -   `position`
    -   `rotation`
    -   `scale`
    -   `material` (basic color/texture support)
    -   `geometry` (supports primitives: `box`, `sphere`, `plane`, `cylinder`, `cone`, `ground`; `mesh`, `photodome`, `videodome`).
    -   **NEW:** `camera` (supports `universal`, `arcRotate` types, sets first camera as active).
-   Primitive element (`<bml-box>`).
-   Component registration and management system (**Updated** to include camera).
-   Attribute parsing for component data (`parsers.js`).
-   Build process via Rollup (`rollup.config.js`).
-   Documentation structure via MkDocs (`mkdocs.yml`, `docs/`).
-   **NEW:** Asynchronous mesh loading via `SceneLoader`.
-   **NEW:** `PhotoDome` and `VideoDome` integration.
-   **NEW:** Updated `geometry` component documentation (`docs/components/geometry.md`).
-   **NEW:** Created `camera` component documentation (`docs/components/camera.md`).

## What's Left to Build

1.  **Build:** Run `npm run build` to verify bundling.
2.  **Verify Example:** Check `examples/mesh_example.html` to ensure the `ArcRotateCamera` is now the active camera.
3.  **README:** Update `README.md` if necessary to mention the new `camera` component.
4.  **Versioning:** Update `package.json` version if appropriate.
5.  **(DONE)** Custom Mesh Loading: Implemented in `geometry` component.
6.  **(DONE)** PhotoDome: Implemented in `geometry` component.
7.  **(DONE)** VideoDome: Implemented in `geometry` component.
8.  **(DONE)** Geometry Documentation: Updated `docs/components/geometry.md`.
9.  **(DONE)** Camera Component: Implemented `camera.js`, registered it, created `docs/components/camera.md`.
10. **(DONE)** Examples: Created examples for `mesh`, `photodome`, `videodome`.

## Current Status

-   Core framework structure is in place.
-   Basic primitives and transform components are functional.
-   `geometry` component updated to support `mesh`, `photodome`, `videodome`.
-   **NEW:** `camera` component implemented and registered, supporting `universal` and `arcRotate` types.
-   Documentation for `geometry` and `camera` components updated.
-   Memory Bank files (`activeContext.md`, `progress.md`) updated.
-   Next steps involve verifying the build and testing the camera functionality in the example.

## Known Issues

-   Error handling for asset loading (`mesh`, `photodome`, `videodome`) is basic (console warnings/errors). More robust user feedback or fallback mechanisms could be added.
-   Updating properties *other than* `type` or `src` for `mesh`, `photodome`, `videodome` after initial creation is not supported (requires recreation).
-   Performance implications of loading large assets haven't been tested.
-   Interaction between the `material` component and the internal materials of `PhotoDome`/`VideoDome` might need refinement/clarification.
-   **NEW:** `camera` component's `update` logic currently disposes and recreates the camera; a more efficient update modifying existing properties could be implemented later.
-   **NEW:** Active camera logic is basic ('first component wins'). More complex scenarios (multiple cameras, dynamic removal) might require more sophisticated handling.
-   **FIXED:** `ReferenceError: BABYLON is not defined` in geometry component (used imported `AbstractMesh`).
-   **FIXED:** Mesh loading example (`mesh_example.html`) updated to use a CORS-enabled URL (`Avocado.glb`).
-   **FIXED:** Mesh loading logic in `geometry` component updated to correctly handle URLs with query parameters by passing the full URL as the filename to `SceneLoader.ImportMeshAsync`.
-   **FIXED:** Mesh loading error ("JSON parse") by installing `@babylonjs/loaders` and importing `@babylonjs/loaders/glTF` in `geometry.js` to ensure the loader is registered.

## Project Evolution / Decisions

-   **Decision Implemented:** Extended the existing `geometry` component to handle `mesh`, `photodome`, and `videodome` types.
-   **Decision Implemented:** Created a new `camera` component to handle camera definitions declaratively.
