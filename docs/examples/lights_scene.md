# Lights Scene Example

This example demonstrates the usage of the `light` component to add various types of light sources to a BabylonML scene. It includes:

*   A Directional Light
*   A Point Light
*   A Spot Light (whose direction is influenced by the entity's `rotation`)
*   A Hemispheric Light (for ambient lighting)

Since lights are explicitly defined, the default hemispheric light provided by `<bml-scene>` is not created.

[View Live Example](../../examples/lights_scene.html)

## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BabylonML Example: Light Component</title>
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
        This scene demonstrates the 'light' component.
        Because lights are defined below, the default scene light is NOT created.
    -->
    <bml-scene>
        <!-- Camera -->
        <bml-entity camera="type: arcRotate; alpha: -1.8; beta: 1.2; radius: 15; target: 0 1 0; attachControl: true"></bml-entity>

        <!-- Lights -->

        <!-- 1. Directional Light (shining down-right) -->
        <bml-entity light="type: directional; direction: 1 -1 1; intensity: 0.6; diffuse: #FFF; specular: #D0D0FF"></bml-entity>

        <!-- 2. Point Light (reddish, positioned above the red sphere) -->
        <bml-entity position="-3 4 3" light="type: point; intensity: 0.8; diffuse: #FF8080; specular: #FFCCCC"></bml-entity>

        <!-- 3. Spot Light (greenish, positioned high and pointing down towards the green box) -->
        <!-- Note: Rotation is applied to the entity, which influences the spot light's direction -->
        <bml-entity position="3 6 -3" rotation="-60 0 0"
                    light="type: spot; angle: 0.7; exponent: 10; intensity: 1.0; diffuse: #80FF80; specular: #CCFFCC">
        </bml-entity>

        <!-- 4. Hemispheric Light (provides ambient lighting) -->
        <bml-entity light="type: hemispheric; intensity: 0.3; diffuse: #C0C0FF; groundColor: #404020"></bml-entity>


        <!-- Objects to illuminate -->

        <!-- Red Sphere (near point light) -->
        <bml-entity position="-3 1 3"
                    geometry="type: sphere; diameter: 2"
                    material="color: #FF0000; roughness: 0.5">
        </bml-entity>

        <!-- Green Box (under spot light) -->
        <bml-entity position="3 1 -3"
                    geometry="type: box; size: 2"
                    material="color: #00FF00; roughness: 0.8">
        </bml-entity>

         <!-- Blue Cylinder (center) -->
         <bml-entity position="0 1.5 0"
                     geometry="type: cylinder; height: 3; diameter: 1.5"
                     material="color: #0000FF; roughness: 0.2">
         </bml-entity>


        <!-- Ground Plane -->
        <bml-entity position="0 0 0"
                    geometry="type: ground; width: 20; height: 20"
                    material="color: #808080; roughness: 0.9">
        </bml-entity>

    </bml-scene>

</body>
</html>
```