# Photo Dome Example

This example demonstrates how to display a 360-degree panoramic image using the `geometry` component with `type: photodome`.

*   The `src` attribute points to the URL of the 360 image.
*   The `size` attribute determines the diameter of the dome.
*   An `arcRotate` camera is used, positioned inside the dome (`radius: 0.1`) to allow the user to look around.
*   A small box is added inside the dome as a point of reference.

[View Live Example](../../examples/photodome_example.html)

## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BabylonML - Photo Dome Example</title>
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        bml-scene { width: 100%; height: 100%; display: block; }
    </style>

    <!-- Load BabylonML library (adjust path as needed) -->
    <script src="../dist/babylonml.js"></script> 
</head>
<body>
    <bml-scene>
        <!-- Camera - ArcRotate might feel constrained inside a dome, but allows looking around -->
        <!-- Setting radius small to be 'inside' the dome -->
        <bml-entity camera="type: arcRotate; target: 0 0 0; alpha: 1.57; beta: 1.57; radius: 0.1"></bml-entity>

        <!-- Photo Dome -->
        <!-- Using a publicly available 360 image from BabylonJS examples -->
        <bml-entity
            geometry="type: photodome; src: https://playground.babylonjs.com/textures/360photo.jpg; size: 1000">
            <!-- The size should be large enough to encompass the camera -->
        </bml-entity>

        <!-- Optional: Add a small object inside the dome to verify perspective -->
        <bml-entity geometry="type: box; size: 0.5" position="0 -1 2" material="color: red"></bml-entity>

    </bml-scene>
</body>
</html>
```