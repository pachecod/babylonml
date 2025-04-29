# Active Context: BabylonML - Documentation Overhaul

## Current Focus

Completed the documentation overhaul task. This involved adding CDN links, restructuring the examples section into an overview page and individual pages per example, and updating the site navigation. The next focus will return to implementing new features, likely starting with the Asset Management System.

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
10. **Fix Documentation Formatting & Scrolling:** **DONE**
    *   Added `components/camera.md` to the navigation in `mkdocs.yml`.
    *   Created `docs/css/custom.css` to enable vertical scrolling on the main content area (`[role="main"]`).
    *   Updated `mkdocs.yml` to include `extra_css: - css/custom.css`.
    *   Rebuilt documentation using `npm run docs:build`.
11. **Integrate Babylon.js Inspector (Optional):** **DONE**
    *   Installed `@babylonjs/inspector` dependency.
    *   Removed static import from `src/core/BmlScene.js`.
    *   Updated event listener in `connectedCallback` to dynamically `import('@babylonjs/inspector')` on first `Ctrl+I` press before showing the debug layer.
    *   Added listener removal in `disconnectedCallback`.
12. **Light Component Implementation:** **DONE**
    *   Created `src/components/light.js` supporting point, directional, spot, and hemispheric types.
    *   Registered component in `src/components/registerCoreComponents.js`.
    *   Created documentation `docs/components/light.md`.
    *   Added light component to navigation in `mkdocs.yml`.
    *   Created example `examples/lights_scene.html`.
13. **Material Component Enhancement:** **DONE**
    *   Updated `src/components/material.js` to support `shader: 'pbr'` property.
    *   Added PBR properties (`metalness`, `roughness`) and common properties (`opacity`, `side`) to schema and update logic.
    *   Refactored logic to handle material type switching (Standard vs PBR).
    *   Updated documentation `docs/components/material.md`.
    *   Created PBR example `examples/pbr_material_scene.html`.
14. **Animation Component Implementation:** **DONE**
    *   Created `src/components/animation.js` supporting property animation (`position`, `rotation`, `scale`, component props like `material.opacity`, `light.intensity`).
    *   Handles `property`, `to`, `from`, `dur`, `loop`, `easing`, `autoplay` parameters.
    *   Registered component in `src/components/registerCoreComponents.js`.
    *   Created documentation `docs/components/animation.md`.
    *   Added animation component to navigation in `mkdocs.yml`.
    *   Created example `examples/animation_scene.html`.
15. **NEW:** Implement Sound Component (`src/components/sound.js`): **DONE**
    *   Created `src/components/sound.js` supporting `src`, `autoplay`, `loop`, `volume`, `spatial`, and spatial properties (`distanceModel`, `rolloffFactor`, `refDistance`, `maxDistance`).
    *   Used `parseObjectString` for attribute parsing.
    *   Registered component in `src/components/registerCoreComponents.js`.
    *   Created documentation `docs/components/sound.md`.
    *   Added sound component to navigation in `mkdocs.yml`.
    *   Created example `examples/sound_scene.html`.
16. **NEW:** Fix `GreasedLineMesh` Error: **DONE**
    *   Identified `ReferenceError: BABYLON is not defined` in `greasedLine.fragment.js` (likely internal to Babylon.js).
    *   Modified `rollup.config.js` to bundle `@babylonjs/core` instead of treating it as external.
    *   Ran `npm run build` successfully.
17. **NEW:** Fix Material Component Timing Error: **DONE**
    *   Identified that `material.update` could run before `geometry` created the mesh/material.
    *   Corrected checks in `material.js` to use `this.babylonNode` instead of `this.el.object3D`.
    *   Added check `node instanceof BABYLON.AbstractMesh` and `node.material` existence before proceeding in `update`.
    *   Added `AbstractMesh` import to `material.js`.
    *   Rebuilt library (`npm run build`).
18. **NEW:** Fix Light Component Timing Error: **DONE**
    *   Identified that `light.init` and `light.update` could run before the entity/scene were ready.
    *   Corrected checks in `light.js` to use `this.babylonNode` and `this.sceneElement?.babylonScene` instead of `this.el` or `this.el.sceneEl`.
    *   Corrected internal references to use `this.id`, `this.babylonNode`, and `this.getComponentData('position')`.
    *   Rebuilt library (`npm run build`).
19. **NEW:** Fix Material/Geometry Timing Issue: **DONE**
    *   Identified that `material.update` could run before `geometry.update` assigned the `AbstractMesh` to `this.babylonNode`.
    *   Refactored `material.js` to use an event listener (`bml-geometry-ready`) dispatched by the `geometry` component. Material application logic moved to `_applyMaterial`.
    *   Corrected a `TypeError` related to `.bind(this)` within the `init` method by storing the bound listener reference correctly.
    *   Rebuilt library (`npm run build`).
20. **NEW:** Fix Material Component `init` TypeError: **DONE**
    *   Identified a regression where `this._onGeometryReady` was `undefined` during the `.bind(this)` call in `init`.
    *   Refactored `init` to define the event handler as an inline arrow function, ensuring `this` context and avoiding the bind error.
    *   Removed the now-redundant `_onGeometryReady` method definition.
    *   Rebuilt library (`npm run build`).
21. **NEW:** Fix Component Initialization Context Issues: **DONE**
    *   Identified that a previous attempt to fix `material.js` `init` errors by changing the `this` context in `ComponentManager.js` was incorrect and caused new errors (`this._applyMaterial is not a function` in material, `Cannot read properties of undefined (reading 'toLowerCase')` in light).
    *   Reverted changes in `ComponentManager.js` to correctly set the `this` context for component lifecycle methods (`init`, `update`, `remove`) to the component *instance* itself.
    *   Reverted changes in `material.js` `init` method signature back to `init(data)` and ensured it uses `this.el` (available via the instance context).
    *   Confirmed `light.js` structure was correct and did not require changes.
    *   Rebuilt library (`npm run build`).
22. **NEW:** Fix Component Initial Update Context: **DONE**
    *   Identified that the initial `update` call within `ComponentManager.js`'s `handleAttributeInitialization` was incorrectly using the `entityElement` as the `this` context, causing `TypeError: this._applyMaterial is not a function` in `material.js`.
    *   Corrected the `call` in `handleAttributeInitialization` to use the `instance` as the `this` context for the initial `update`.
    *   Rebuilt library (`npm run build`).
23. **NEW:** Fix Material/Geometry Timing (Final Attempt): **DONE**
    *   Identified that the event-based approach (`bml-geometry-ready`) was still unreliable due to component initialization order.
    *   Modified `geometry.js` to remove the event dispatch and instead set the created mesh on `this.el.geometryMesh`.
    *   Modified `material.js` to remove all event listener logic and instead check for the existence of `this.el.geometryMesh` in its `update` method before calling `_applyMaterial`.
    *   Cleaned up debugging logs from both components.
    *   Rebuilt library (`npm run build`).
24. **NEW:** Documentation Overhaul: **DONE**
    *   Added CDN links (using provided Firebase Storage URLs) to `docs/getting-started.md`.
    *   Created `docs/examples/index.md` as an overview page.
    *   Created individual Markdown files in `docs/examples/` for each example HTML file, embedding the source code.
    *   Removed the old `docs/examples.md`.
    *   Updated `mkdocs.yml` navigation to use the new examples structure.

## Next Steps

1.  **Implement Asset Management System (`<bml-assets>`).**
    *   Define `<bml-assets>` custom element.
    *   Implement logic for preloading assets (meshes, textures, etc.) defined within `<bml-assets>`.
    *   Modify components (e.g., `geometry`, `material`) to reference assets by ID (e.g., `src="#myModel"`).
    *   Add documentation for asset management.
    *   Create examples.
2.  **Implement Text Component (`src/components/text.js`).**
    *   Decide on approach (e.g., using Babylon.js GUI, Dynamic Texture, or a dedicated text mesh library).
    *   Create the component with properties like `value`, `font`, `size`, `color`.
    *   Register the component.
    *   Add documentation.
    *   Create examples.
3.  **Deferred:** Update `memory-bank/progress.md` (will be updated after documentation changes).
4.  **Deferred:** Run the library build process (`npm run build`).
5.  **Deferred:** Test the documentation site locally (`npm run docs:serve`) to verify new structure.
6.  **Deferred:** Test the live examples (all examples linked from the new docs structure).
7.  **Deferred:** Update `README.md` to mention recent features (XR, camera, inspector, light, PBR material, animation, sound, **assets, text**) and link to the improved documentation.
8.  **Deferred:** Update `package.json` version if appropriate.

-   **Camera Activation:** The first camera component initialized is set as active. Need to consider behavior if multiple cameras are defined or if the active one is removed dynamically. **Status: Basic 'first-one-wins' logic implemented and documented.**
-   **Camera Updates:** The `update` logic disposes and recreates the camera. It now correctly uses pre-parsed data for properties like `position` and `target`. A more refined approach (updating existing properties) could be implemented later. **Status: Basic recreate logic implemented, data parsing fixed.**
-   **Default Camera/Light:** Scene provides defaults if no `[camera]` or `[light]` attribute is present. Adding a `light` component now correctly prevents the default light. **Status: Implemented and documented.**
-   **Light Component:** Implemented support for point, directional, spot, and hemispheric lights via the `light` attribute. **Status: Implemented.**
-   **Material Component:** Enhanced to support PBR shader (`shader: pbr`) and properties like `metalness`, `roughness`, `opacity`, `side`. **Status: Implemented.**
-   **Geometry Component Decision:** Extended the existing `geometry` component for `mesh`, `photodome`, `videodome`. **Decision Implemented.**
-   **Asset Loading Errors:** Need robust error handling for external assets. **Status: Basic console logging implemented.**
-   **Async Loading:** Ensure correct handling within lifecycle. **Status: Implemented for mesh loading.**
-   **XR Initialization Timing:** Used `setTimeout` in `BmlScene` to delay XR initialization slightly, aiming to avoid race conditions with camera components. Needs testing. **Status: Implemented.**
-   **XR Error Handling:** Basic `try...catch` and support checks added in `BmlScene.#initializeXR`. More user-facing feedback could be added. **Status: Basic implementation.**
-   **XR Feature Scope:** Initial implementation uses `WebXRDefaultExperience` for basic session entry. Controllers, teleportation, hit-testing etc., are not yet declaratively supported. **Status: Basic implementation.**
-   **Animation Component:** Supports animating various properties (transforms, component values like opacity/intensity). Currently limited to one animation per entity via the attribute. Target property resolution relies on heuristics (checking `object3D` then component properties). **Status: Implemented.**
-   **Sound Component:** Supports loading and playing sounds via URL (`src`), with options for autoplay, loop, volume, and spatial audio attached to the entity. Uses key-value string parsing. **Status: Implemented.**
-   **Build Configuration:** Changed Rollup config to bundle `@babylonjs/core` to resolve potential issues with internal library features (like `GreasedLineMesh`) accessing the global `BABYLON` object when loaded externally. **Status: Implemented & Rebuilt.**
-   **Material Component Timing:** The `update` method now correctly checks for `this.babylonNode` being an `AbstractMesh` with a `material` property before proceeding, preventing errors when `geometry` hasn't finished initializing. **Status: Implemented & Rebuilt.**
-   **Light Component Timing:** The `init` and `update` methods now correctly check for `this.babylonNode` and `this.sceneElement?.babylonScene` before proceeding, preventing errors during entity initialization. Internal references were also corrected. **Status: Implemented & Rebuilt.**
-   **Material/Geometry Timing:** Removed the unreliable event-based approach (`bml-geometry-ready`). The `geometry` component now sets an `el.geometryMesh` property when its mesh is ready. The `material` component checks for this property in its `update` method before attempting to apply the material. This ensures the material is applied only after the mesh exists. **Status: Implemented & Rebuilt.**
-   **Component Initialization Context:** The `this` context within component lifecycle methods (`init`, `update`, `remove`) is correctly set to the component instance object (which includes `this.el` referencing the entity element), resolving subsequent TypeErrors in `material.js` and `light.js`. **Status: Implemented & Rebuilt.**
