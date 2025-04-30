# Video Dome Example

[View Live Example](https://babylonml-frontend.netlify.app/examples/videodome_example.html){:target="_blank"}

This example demonstrates how to display a 360-degree video using the `geometry` component with `type: videodome`.

*   The `src` attribute points to the URL of the video file.
*   Attributes like `autoPlay`, `loop`, `muted`, and `clickToPlay` control video playback behavior. Note that `autoplay` often requires `muted: true` due to browser policies.
*   An `arcRotate` camera is positioned inside the dome (`radius: 0.1`).
*   This example also includes custom JavaScript logic to override the default mouse wheel camera zoom and instead control the `fovMultiplier` property of the VideoDome, creating a zoom effect within the 360 video itself. It waits for the `bml-geometry-ready` event from the video dome entity before attaching the zoom listeners.

## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BabylonML - Video Dome Example</title>
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        bml-scene { width: 100%; height: 100%; display: block; }
    </style>

    <!-- Load BabylonML library (adjust path as needed) -->
    <script src="../dist/babylonml.js"></script> 
</head>
<body>
    <bml-scene>
        <!-- Camera -->
        <bml-entity camera="type: arcRotate; target: 0 0 0; alpha: 1.57; beta: 1.57; radius: 0.1"></bml-entity>

        <!-- Video Dome -->
        <!-- Using a publicly available 360 video -->
        <!-- Note: Autoplay might be blocked by browser policy if not muted or interacted with -->
        <bml-entity
            id="video-dome-entity"
            geometry="type: videodome; src: https://assets.babylonjs.com/photoDomes/solarProbeMission.mp4; size: 1000; autoPlay: true; loop: true; muted: true; clickToPlay: true">
            <!-- clickToPlay: true allows user interaction to start/pause -->
        </bml-entity>

        <!-- Optional: Add a small object inside the dome -->
        <bml-entity geometry="type: sphere; diameter: 0.5" position="0 0 0" material="color: blue"></bml-entity>

    </bml-scene>
  </body>
</html>
```
