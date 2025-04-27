# Progress: BabylonML - Geometry Features Added

## What Works (Assumed based on file structure)

-   Basic scene setup (`<bml-scene>`).
-   Entity creation (`<bml-entity>`).
-   Core components:
    -   `position`
    -   `rotation`
    -   `scale`
    -   `material` (basic color/texture support)
    -   `geometry` (supports primitives: `box`, `sphere`, `plane`, `cylinder`, `cone`, `ground`; **NEW:** `mesh`, `photodome`, `videodome`).
-   Primitive element (`<bml-box>`).
-   Component registration and management system.
-   Attribute parsing for component data (`parsers.js`).
-   Build process via Rollup (`rollup.config.js`).
-   Documentation structure via MkDocs (`mkdocs.yml`, `docs/`).
-   **NEW:** Asynchronous mesh loading via `SceneLoader`.
-   **NEW:** `PhotoDome` and `VideoDome` integration.
-   **NEW:** Updated `geometry` component documentation (`docs/components/geometry.md`).

## What's Left to Build

1.  **Examples:** Create examples in `examples/` demonstrating `mesh`, `photodome`, and `videodome`.
2.  **Build:** Run `npm run build` to verify bundling.
3.  **README:** Update `README.md` if necessary to mention new features.
4.  **Versioning:** Update `package.json` version if appropriate.
5.  **(DONE)** Custom Mesh Loading: Implemented in `geometry` component.
6.  **(DONE)** PhotoDome: Implemented in `geometry` component.
7.  **(DONE)** VideoDome: Implemented in `geometry` component.
8.  **(DONE)** Documentation: Updated `docs/components/geometry.md`.

## Current Status

-   Core framework structure is in place.
-   Basic primitives and transform components are functional.
-   **`geometry` component updated** to support `mesh`, `photodome`, `videodome`.
-   Documentation for `geometry` component updated.
-   Memory Bank files created and updated.
-   Next steps involve creating examples and verifying the build.

## Known Issues

-   Error handling for asset loading (`mesh`, `photodome`, `videodome`) is basic (console warnings/errors). More robust user feedback or fallback mechanisms could be added.
-   Updating properties *other than* `type` or `src` for `mesh`, `photodome`, `videodome` after initial creation is not supported (requires recreation).
-   Performance implications of loading large assets haven't been tested.
-   Interaction between the `material` component and the internal materials of `PhotoDome`/`VideoDome` might need refinement/clarification.
-   **FIXED:** `ReferenceError: BABYLON is not defined` in geometry component (used imported `AbstractMesh`).
-   **FIXED:** Mesh loading example (`mesh_example.html`) updated to use a CORS-enabled URL (`Avocado.glb`).
-   **FIXED:** Mesh loading logic in `geometry` component updated to correctly handle URLs with query parameters by passing the full URL as the filename to `SceneLoader.ImportMeshAsync`.
-   **FIXED:** Mesh loading error ("JSON parse") by installing `@babylonjs/loaders` and importing `@babylonjs/loaders/glTF` in `geometry.js` to ensure the loader is registered.

## Project Evolution / Decisions

-   **Decision Implemented:** Extended the existing `geometry` component to handle `mesh`, `photodome`, and `videodome` types. This approach was successful and maintained consistency.
