# Assets Scene Example (Planned Feature)

**Note:** The `<bml-assets>` system demonstrated in this example is a planned feature and is **not yet implemented** in the current version of BabylonML. This example shows the intended syntax and usage.

This example demonstrates how the planned asset management system could work:

*   Define assets (meshes, textures) within a `<bml-assets>` block using `<bml-asset-item>` tags, assigning each an ID.
*   Reference these preloaded assets in components using the ID selector (e.g., `geometry="src: #boxModel"`, `material="map: #woodTex"`).
*   This aims to improve loading efficiency and scene organization by preloading assets before they are needed.

[View Live Example](../../examples/assets_scene.html) (Note: Will not function correctly until the `<bml-assets>` feature is implemented)

## Source Code (Illustrative)

```html
<!DOCTYPE html>
<html>
<head>
    <title>BabylonML Asset Management Example</title>
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        canvas { width: 100%; height: 100%; display: block; }
    </style>
    <script src="../dist/babylonml.js"></script> <!-- Adjust path to your build -->
</head>
<body>
    <bml-scene xr="false"> <!-- Disable XR for simplicity -->

        <!-- Asset Definitions (Planned Feature) -->
        <bml-assets>
            <bml-asset-item id="boxModel" src="https://playground.babylonjs.com/scenes/BoomBox.glb" type="mesh"></bml-asset-item>
            <bml-asset-item id="woodTex" src="https://playground.babylonjs.com/textures/wood.jpg" type="texture"></bml-asset-item>
            <!-- Add more assets here -->
            <!-- <bml-asset-item id="anotherMesh" src="/path/to/model.obj" type="mesh"></bml-asset-item> -->
            <!-- <bml-asset-item id="envTex" src="/path/to/environment.env" type="texture"></bml-asset-item> -->
        </bml-assets>

        <!-- Camera -->
        <bml-entity camera="type: arcRotate; target: 0 1 0; radius: 15; beta: 1.2; alpha: -1.5"></bml-entity>

        <!-- Lights -->
        <bml-entity light="type: hemispheric; intensity: 0.7"></bml-entity>
        <bml-entity light="type: directional; direction: 1 -1 1; intensity: 0.5"></bml-entity>

        <!-- Entity using the preloaded mesh -->
        <bml-entity
            id="boombox"
            geometry="type: mesh; src: #boxModel"
            position="-3 1 0"
            scale="100 100 100"
            rotation="0 0.5 0">
            <!-- Material will be loaded with the GLB -->
        </bml-entity>

        <!-- Entity using the preloaded texture -->
        <bml-entity
            id="texturedBox"
            geometry="type: box; size: 2"
            position="3 1 0"
            material="shader: standard; map: #woodTex; specular: 0.1 0.1 0.1">
        </bml-entity>

        <!-- Ground -->
        <bml-entity geometry="type: ground; width: 15; height: 15" material="color: #444"></bml-entity>

    </bml-scene>

    <script>
        // Optional: Listen for scene ready event
        const sceneEl = document.querySelector('bml-scene');
        sceneEl.addEventListener('bml-scene-ready', (event) => {
            console.log('BML Scene is ready!', event.detail.scene);
            // You can access the Babylon scene object here if needed:
            // const babylonScene = event.detail.scene;
        });
    </script>
</body>
</html>
```