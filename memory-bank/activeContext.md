# Active Context: BabylonML - Feature Expansion

## Current Focus

The immediate goal is to extend the BabylonML framework to support loading custom 3D models, 360 photos, and 360 videos.

## Task Breakdown (Geometry Component Updated)

1.  **Custom Mesh Loading:** **DONE**
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

1.  Update `memory-bank/progress.md` to reflect completed work.
2.  Create example HTML files in `examples/` demonstrating:
    *   Loading a `.glb` mesh.
    *   Using `<bml-entity geometry="type: photodome; ...">`.
    *   Using `<bml-entity geometry="type: videodome; ...">`.
3.  Run the build process (`npm run build`) to ensure the changes are bundled correctly.
4.  Update `README.md` if necessary.
5.  Update `package.json` version if appropriate.

## Active Decisions/Considerations

-   Should mesh/photodome/videodome be new geometry *types* within the existing `geometry` component, or should they be entirely new components or primitives (e.g., `<bml-mesh>`, `<bml-photodome>`)? Using the `geometry` component seems more consistent with the current structure (box, sphere, etc.), but primitives might be more declarative. Leaning towards extending the `geometry` component for now.
-   How to handle potential loading errors for external assets (meshes, images, videos)? Need error handling and potentially fallback mechanisms or clear console warnings.
-   Ensure asynchronous loading is handled correctly within the framework's lifecycle.
