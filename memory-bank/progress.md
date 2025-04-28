# Progress: BabylonML - Documentation Improvements

## What Works (Assumed based on file structure)

-   Basic scene setup (`<bml-scene>`).
-   Entity creation (`<bml-entity>`).
-   Core components:
    -   `position`
    -   `rotation`
    -   `scale`
    -   `material` (**NEW:** supports `standard` and `pbr` shaders, `color`, `opacity`, `side`, `wireframe`, PBR props `metalness`/`roughness`, etc.)
    -   `geometry` (supports primitives: `box`, `sphere`, `plane`, `cylinder`, `cone`, `ground`; `mesh`, `photodome`, `videodome`).
    -   `camera` (supports `universal`, `arcRotate` types, sets first camera as active).
    -   **NEW:** `light` (supports `point`, `directional`, `spot`, `hemispheric` types).
    -   **NEW:** `animation` (supports property animation with `property`, `to`, `from`, `dur`, `loop`, `easing`, `autoplay`).
    -   **NEW:** `sound` (supports `src`, `autoplay`, `loop`, `volume`, `spatial`, spatial properties).
-   **NEW:** Basic XR support via `xr` attribute on `<bml-scene>` (handles `vr`, `ar`, `true`). Integrates `WebXRDefaultExperience`.
-   Primitive element (`<bml-box>`).
-   Component registration and management system.
-   Attribute parsing for component data (`parsers.js`).
-   Build process via Rollup (`rollup.config.js`), **now configured to bundle Babylon.js core**.
-   Documentation structure via MkDocs (`mkdocs.yml`, `docs/`).
-   Asynchronous mesh loading via `SceneLoader`.
-   `PhotoDome` and `VideoDome` integration.
-   Updated `geometry` component documentation (`docs/components/geometry.md`).
-   Created `camera` component documentation (`docs/components/camera.md`), updated for multi-camera handling.
-   Updated scene documentation (`docs/concepts/scene.md`) for `xr` attribute and default camera/light behavior.
-   Added documentation clarification about the non-functional `light` attribute placeholder.
-   **NEW:** Integrated Babylon.js Inspector toggle (`Ctrl+I`) into the core scene (`BmlScene.js`) using **dynamic import** to keep it optional.
-   **NEW:** Fixed documentation navigation (added `camera.md` to `mkdocs.yml`).
-   **NEW:** Fixed documentation page scrolling issue (added custom CSS via `extra_css` in `mkdocs.yml`).

## What's Left to Build

1.  **(DONE)** Rebuild library after Rollup config change.
2.  **Test Docs:** Run `npm run docs:serve` and verify navigation, scrolling, and content for light/material pages.
3.  **Test Examples:** Test examples (local or live) to confirm `Ctrl+I` inspector toggle works, and test `lights_scene.html` and `pbr_material_scene.html`.
4.  **README:** Update `README.md` to mention recent features (XR, camera, inspector, light, PBR material, etc.).
5.  **Versioning:** Update `package.json` version (e.g., to 1.3.0).
6.  **(DONE)** Light Component: Implemented `light.js`, registered it, created `docs/components/light.md`, added to nav, created `examples/lights_scene.html`.
7.  **(DONE)** Material Component Enhancement: Updated `material.js` for PBR support, updated `docs/components/material.md`, created `examples/pbr_material_scene.html`.
8.  **(DONE)** Custom Mesh Loading: Implemented in `geometry` component.
7.  **(DONE)** PhotoDome: Implemented in `geometry` component.
8.  **(DONE)** VideoDome: Implemented in `geometry` component.
9.  **(DONE)** Geometry Documentation: Updated `docs/components/geometry.md`.
10. **(DONE)** Camera Component: Implemented `camera.js`, registered it, created `docs/components/camera.md`.
11. **(DONE)** Examples: Created examples for `mesh`, `photodome`, `videodome`.
12. **(DONE)** Basic XR Support: Implemented `xr` attribute on `<bml-scene>`, integrated `WebXRDefaultExperience`, updated docs, created examples.
13. **(DONE)** Documentation & Examples (Defaults/Multi-Camera): Updated docs for scene/camera, created new examples.
14. **(DONE)** Fix Multi-Camera Example: Corrected JS logic in `examples/multi_camera_scene.html` to properly attach controls on switch.
15. **(DONE)** Fix Camera Component Update Logic: Corrected `update` method in `src/components/camera.js` to use pre-parsed data.
16. **(DONE)** Fix Documentation Formatting: Added `camera.md` to `mkdocs.yml` navigation.
17. **(DONE)** Fix Documentation Scrolling: Added custom CSS to allow scrolling on main content area.
18. **(DONE)** Integrate Inspector (Optional): Added `@babylonjs/inspector` dependency and toggle logic (`Ctrl+I`) using dynamic import in `BmlScene.js`.
19. **(DONE)** Animation Component: Implemented `animation.js`, registered it, created `docs/components/animation.md`, added to nav, created `examples/animation_scene.html`.
20. **(NEW)** Sound Component: Implemented `sound.js`, registered it, created `docs/components/sound.md`, added to nav, created `examples/sound_scene.html`.
21. **(NEW)** Fix Material Component Timing Error: Corrected checks in `material.js` update method to ensure `babylonNode` is an `AbstractMesh` with a `material` property before proceeding. Added `AbstractMesh` import. Rebuilt library. **(Superseded by event listener fix)**
22. **(NEW)** Fix Light Component Timing Error: Corrected checks in `light.js` init/update methods to ensure `babylonNode` and scene are ready. Corrected internal references. Rebuilt library.
23. **(NEW)** Fix Material/Geometry Timing Issue: Refactored `material.js` to use `bml-geometry-ready` event listener. Corrected `.bind(this)` TypeError in `init` by storing the bound listener reference. Rebuilt library.
24. **(NEW)** Fix Material Component `init` TypeError (`.bind`): **DONE** Refactored `material.js` `init` method to define the `bml-geometry-ready` handler as an inline arrow function, resolving a regression where `this._onGeometryReady` was `undefined` during the `.bind(this)` call. Removed redundant `_onGeometryReady` method. Rebuilt library.
25. **(NEW)** Fix Component Initialization Context Issues: **DONE**
    *   Identified that a previous attempt (Task #25) to fix `material.js` `init` errors by changing the `this` context in `ComponentManager.js` was incorrect and caused new errors (`this._applyMaterial is not a function` in material, `Cannot read properties of undefined (reading 'toLowerCase')` in light).
    *   Reverted changes in `ComponentManager.js` to correctly set the `this` context for component lifecycle methods (`init`, `update`, `remove`) to the component *instance* itself.
    *   Reverted changes in `material.js` `init` method signature back to `init(data)` and ensured it uses `this.el` (available via the instance context).
    *   Confirmed `light.js` structure was correct and did not require changes.
    *   Rebuilt library (`npm run build`).
26. **(NEW)** Fix Component Initial Update Context: **DONE**
    *   Identified that the initial `update` call within `ComponentManager.js`'s `handleAttributeInitialization` was incorrectly using the `entityElement` as the `this` context, causing `TypeError: this._applyMaterial is not a function` in `material.js`.
    *   Corrected the `call` in `handleAttributeInitialization` to use the `instance` as the `this` context for the initial `update`.
    *   Rebuilt library (`npm run build`).

## Current Status

-   Core framework structure is in place.
-   Basic primitives, transform, material (Standard & PBR), geometry (including mesh/domes), camera, light, animation, and **NEW:** sound components are functional.
-   Basic XR support (VR/AR session entry) via `xr` attribute on `<bml-scene>` is implemented.
-   Documentation updated for `geometry`, `camera` (including multi-camera), `scene` (XR attribute, default camera/light), `light`, `material` (PBR support), animation, and **NEW:** `sound`.
-   Documentation navigation and scrolling issues fixed.
-   Babylon.js Inspector toggle (`Ctrl+I`) integrated using dynamic import (optional loading).
-   Memory Bank files (`activeContext.md`, `progress.md`) updated to reflect light component, material enhancements, animation component, **NEW:** sound component implementation, and **NEW:** build configuration fix.
-   Examples created for VR, AR, default scene setup, explicit camera/light placeholder, multiple cameras, lights, PBR materials, animation, and **NEW:** sound.
-   **NEW:** Build configuration updated to bundle `@babylonjs/core`; library rebuilt successfully.
-   **NEW:** Material/Geometry timing issue resolved in `material.js` using a correctly implemented event listener (defined inline in `init`); library rebuilt successfully.
-   **NEW:** Component initialization context handling in `ComponentManager.js` confirmed and corrected to use the component instance as `this`, resolving errors in `material.js` and `light.js`.
-   Next steps involve **deferred** testing/documentation updates, followed by implementing the next feature (Asset Management or Text Component).

## Known Issues

-   Error handling for asset loading (`mesh`, `photodome`, `videodome`) is basic (console warnings/errors). More robust user feedback or fallback mechanisms could be added.
-   Updating properties *other than* `type` or `src` for `mesh`, `photodome`, `videodome` after initial creation is not supported (requires recreation).
-   Performance implications of loading large assets haven't been tested.
-   Interaction between the `material` component and the internal materials of `PhotoDome`/`VideoDome` might need refinement/clarification. **(Still valid)**
-   Texture loading in `material` component is basic (no caching/reuse). **(Still valid)**
-   `camera` component's `update` logic currently disposes and recreates the camera; a more efficient update modifying existing properties could be implemented later. **(Still valid)**
-   Active camera logic is basic ('first component wins') and documented. More complex scenarios (multiple cameras, dynamic removal) might require more sophisticated handling or clearer documentation on manual JS intervention.
-   **FIXED:** Light Component: Adding a `light` attribute previously only prevented the default light. The component is now implemented and functional.
-   XR error handling is basic; relies on console messages and `WebXRDefaultExperience` UI.
-   XR feature set is minimal (session entry only). Controllers, advanced AR features (hit-testing, anchors), etc., are not yet declaratively supported.
-   Compatibility and performance of XR features across different devices/browsers need testing.
-   **NEW:** Animation component currently supports only one animation per entity via the attribute. Target property resolution is heuristic-based.
-   **NEW:** Sound component relies on direct URLs; integration with asset management is pending. Browser Audio Context limitations (user interaction needed for autoplay) apply.
-   **FIXED:** `ReferenceError: BABYLON is not defined` in geometry component (used imported `AbstractMesh`).
-   **FIXED:** Mesh loading example (`mesh_example.html`) updated to use a CORS-enabled URL (`Avocado.glb`).
-   **FIXED:** Mesh loading logic in `geometry` component updated to correctly handle URLs with query parameters by passing the full URL as the filename to `SceneLoader.ImportMeshAsync`.
-   **FIXED:** Mesh loading error ("JSON parse") by installing `@babylonjs/loaders` and importing `@babylonjs/loaders/glTF` in `geometry.js` to ensure the loader is registered.
-   **FIXED:** Multi-camera example (`examples/multi_camera_scene.html`) switching logic now correctly attaches controls to the target camera regardless of its initial `attachControl` setting.
-   **FIXED:** Camera component (`src/components/camera.js`) `update` method now correctly uses pre-parsed `position` and `target` data from the ComponentManager, resolving issues with UniversalCamera setup.
   **FIXED:** Material component (`src/components/material.js`) `update` method now correctly converts parsed color objects (e.g., `{r,g,b}`) into `BABYLON.Color3` instances before applying them to material properties (e.g., `diffuseColor`), enabling dynamic updates via `setAttribute`. **(Superseded by PBR refactor)**
-   **FIXED:** `ReferenceError: BABYLON is not defined` in `greasedLine.fragment.js` (resolved by bundling `@babylonjs/core`).
   **FIXED:** Material component `update` could run before `geometry` component created the mesh/material (resolved by refactoring `material.js` to use the `bml-geometry-ready` event).
   **FIXED:** Light component `init`/`update` could run before entity/scene were ready (resolved by adding checks for `babylonNode` and scene readiness in `light.js`).
   **FIXED:** Material component `init` TypeError (`undefined` reading `bind`) resolved by defining the event handler inline within `init`.
   **FIXED:** Material component `init` TypeError (`undefined` reading `addEventListener`) and subsequent `light.js` TypeError (`undefined` reading `toLowerCase`) resolved by correcting the `this` context handling in `ComponentManager.js` for component lifecycle methods.
   **FIXED:** Component initial `update` call in `ComponentManager.js` was using the wrong `this` context (`entityElement` instead of `instance`), causing `TypeError: this._applyMaterial is not a function` in `material.js`. Corrected the `call` to use `instance`.

## Project Evolution / Decisions

-   **Decision Implemented:** Extended the existing `geometry` component to handle `mesh`, `photodome`, and `videodome` types.
-   **Decision Implemented:** Created a new `camera` component to handle camera definitions declaratively.
-   **Decision Implemented:** Added basic XR support via an `xr` attribute on `<bml-scene>` leveraging `WebXRDefaultExperience`.
-   **Decision Implemented:** Clarified default camera/light behavior and multiple camera handling in documentation and examples.
-   **Decision Implemented:** Integrated Babylon.js Inspector toggle via `Ctrl+I` using dynamic import for optional loading and reduced bundle size.
-   **Decision Implemented:** Created a new `light` component to handle light source definitions declaratively.
-   **Decision Implemented:** Enhanced `material` component to support PBR shaders and properties (`metalness`, `roughness`, `opacity`, `side`).
-   **Decision Implemented:** Created a new `animation` component to handle property animations declaratively.
-   **Decision Implemented:** Created a new `sound` component to handle audio playback declaratively.
-   **Decision Implemented:** Changed Rollup configuration to bundle `@babylonjs/core` instead of treating it as external to resolve internal library reference errors.
-   **Decision Implemented:** Corrected material component update logic to wait for the geometry component to create an `AbstractMesh` with a `material` property, resolving a timing issue. **(Superseded by event listener fix)**
-   **Decision Implemented:** Corrected light component init/update logic to wait for the entity's `babylonNode` and scene to be ready, resolving a similar timing issue.
-   **Decision Implemented:** Refactored `material.js` to use an event listener (`bml-geometry-ready`) to resolve timing issues with the `geometry` component.
-   **Decision Implemented:** Corrected a subsequent `.bind(this)` TypeError in `material.js` `init` by defining the event handler inline.
-   **Decision Implemented:** Corrected component initialization context handling in `ComponentManager.js` to ensure `this` refers to the component instance within lifecycle methods.
-   **Decision Implemented:** Corrected the `this` context for the *initial* `update` call in `ComponentManager.js`'s `handleAttributeInitialization` to use the component instance, resolving a `TypeError` in the material component.
