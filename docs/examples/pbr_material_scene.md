# PBR Material Scene Example

This example demonstrates using Physically Based Rendering (PBR) materials with the `material` component by setting `shader: pbr`. It showcases different combinations of `metalness` and `roughness` properties:

*   A highly metallic, smooth sphere (`metalness: 0.9`, `roughness: 0.1`).
*   A rough, non-metallic (plastic-like) cube (`metalness: 0.1`, `roughness: 0.8`).
*   A semi-rough metallic cylinder (`metalness: 0.7`, `roughness: 0.4`).
*   A double-sided plane with partial opacity.

Good lighting (directional and hemispheric) is included, as PBR materials rely heavily on lighting for their appearance.

[View Live Example](../../examples/pbr_material_scene.html)

## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BabylonML Example: PBR Material</title>
    <style>
        html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; width: 100%; }
        bml-scene { width: 100vw; height: 100vh; display: block; }
        canvas { display: block; }
    </style>
    <!-- Import the bundled BabylonML library -->
    <!-- Make sure you build the library first (e.g., npm run build) -->
    <script src="../dist/babylonml.min.js"></script>
</head>
<body>
    <!--
        This scene demonstrates the 'material' component using the PBR shader.
    -->
    <bml-scene>
        <!-- Camera -->
        <bml-entity camera="type: arcRotate; alpha: -1.57; beta: 1.0; radius: 8; target: 0 1 0; attachControl: true"></bml-entity>

        <!-- Lights (PBR materials look best with good lighting) -->
        <bml-entity light="type: directional; direction: 0.5 -1 0.5; intensity: 0.8"></bml-entity>
        <bml-entity light="type: hemispheric; intensity: 0.4; groundColor: #303030"></bml-entity>

        <!-- PBR Material Examples -->

        <!-- Metallic Sphere (High metalness, low roughness) -->
        <bml-entity position="-3 1 0"
                    geometry="type: sphere; diameter: 1.5"
                    material="shader: pbr; color: #E0E0E0; metalness: 0.9; roughness: 0.1">
        </bml-entity>

        <!-- Rough Plastic Cube (Low metalness, high roughness) -->
        <bml-entity position="0 1 0"
                    geometry="type: box; size: 1.5"
                    material="shader: pbr; color: #FF4500; metalness: 0.1; roughness: 0.8">
        </bml-entity>

         <!-- Semi-Rough Metallic Cylinder (Mid metalness, mid roughness) -->
         <bml-entity position="3 1 0"
                     geometry="type: cylinder; height: 2; diameter: 1"
                     material="shader: pbr; color: #008080; metalness: 0.7; roughness: 0.4">
         </bml-entity>

         <!-- Double-sided Plane with Opacity -->
         <bml-entity position="0 1 3" rotation="-90 0 0"
                     geometry="type: plane; width: 2; height: 2"
                     material="shader: pbr; color: #FFFF00; metalness: 0.2; roughness: 0.6; opacity: 0.7; side: double">
         </bml-entity>


        <!-- Ground Plane (Standard material for comparison/simplicity) -->
        <bml-entity position="0 0 0"
                    geometry="type: ground; width: 10; height: 10"
                    material="color: #606060"> <!-- Using default standard shader -->
        </bml-entity>

    </bml-scene>

</body>
</html>
```