# Mesh Loading Example

This example demonstrates how to load an external 3D model (in `.glb` format) into the scene using the `geometry` component with `type: mesh`.

*   The `src` attribute of the `geometry` component points to the URL of the `.glb` file.
*   BabylonML handles the asynchronous loading of the mesh.
*   Basic camera and lighting are included for visibility.

[View Live Example](../../examples/mesh_example.html)

## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BabylonML - Mesh Example</title>
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        bml-scene { width: 100%; height: 100%; display: block; }
    </style>
    <!-- Load BabylonML library (adjust path as needed) -->
    <script src="../dist/babylonml.js"></script> <!-- Point to local build -->
</head>
<body>
    <bml-scene>
        <!-- Basic lighting and camera -->
        <bml-entity light="type: hemispheric; intensity: 0.7"></bml-entity>
        <bml-entity light="type: directional; direction: 1 -1 1; intensity: 0.7"></bml-entity>
        <bml-entity camera="type: arcRotate; target: 0 1 0; alpha: -1.57; beta: 1.2; radius: 5"></bml-entity>

        <!-- Load the GLB mesh -->
        <!-- Using the Avocado model from the official BabylonJS assets repository -->
        <bml-entity
            geometry="type: mesh; src: https://firebasestorage.googleapis.com/v0/b/story-splat.firebasestorage.app/o/users%2FmFNJrfet99Qv9mMX2OC6hewy1xC2%2Fsplats%2FGreek_Statue_London_textured_mesh_lowpoly_glb.glb?alt=media&token=d79e2c56-420b-4e1f-81d8-0a7f3cdcf43c"
            position="0 0 0"
            rotation="0 0 0"
            scale="1 1 1">
        </bml-entity>

    </bml-scene>
</body>
</html>
```