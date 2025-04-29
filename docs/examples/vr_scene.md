# VR Scene Example

[View Live Example](https://babylonml-frontend.netlify.app/examples/vr_scene.html){:target="_blank"} (Requires VR-compatible device/browser)

This example demonstrates how to enable basic Virtual Reality (VR) support in BabylonML using the `xr="vr"` attribute on the `<bml-scene>` element.

*   It initializes a WebXR session in VR mode (requires a compatible VR headset and browser).
*   The scene includes a ground plane and a couple of simple objects.
*   An `arcRotate` camera is defined for easier navigation when viewing the scene outside of VR mode. The WebXR helper typically manages the camera perspective within the VR session.

**Note:** This provides basic VR entry. Features like controller interactions, teleportation, etc., are not included in this basic setup and would require additional components or JavaScript.


## Source Code
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BabylonML - VR Example</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            overflow: hidden; /* Prevent scrollbars */
            height: 100%;
            width: 100%;
        }

        bml-scene {
            width: 100vw; /* Viewport width */
            height: 100vh; /* Viewport height */
            display: block; /* Ensure it behaves like a block element */
        }

        canvas {
            display: block;
        }
    </style>
    <!-- Import the bundled BabylonML library -->
    <script src="../dist/babylonml.js"></script>
</head>
<body>
    <!-- Enable VR mode using the xr attribute -->
    <bml-scene xr="vr">

        <!-- Define a camera (optional, WebXR helper might provide one, but good practice) -->
        <!-- Using ArcRotateCamera for easy navigation outside VR -->
        <bml-entity camera="type: arcRotate; target: 0 1 0; radius: 5; alpha: -1.57; beta: 1.2"></bml-entity>

        <!-- Add a ground plane -->
        <bml-entity geometry="type: ground; width: 10; height: 10"
                      material="color: #444444; roughness: 0.8"></bml-entity>

        <!-- Add a simple box -->
        <bml-entity geometry="type: box; size: 1"
                      position="0 1 0"
                      rotation="0 45 0"
                      material="color: tomato"></bml-entity>

        <!-- Add a sphere -->
        <bml-entity geometry="type: sphere; diameter: 0.8"
                      position="-2 1 1"
                      material="color: cornflowerblue"></bml-entity>

    </bml-scene>

    <script>
        // Optional: Listen for scene ready event
        const sceneEl = document.querySelector('bml-scene');
        sceneEl.addEventListener('bml-scene-ready', (event) => {
            console.log('VR Scene is ready!', event.detail);
            // You could potentially access the XR helper here if needed,
            // though it's managed internally by BmlScene for now.
            // const xrHelper = sceneEl.#xrHelper; // Note: #xrHelper is private
        });
    </script>
</body>
</html>
```
