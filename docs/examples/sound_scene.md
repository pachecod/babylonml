# Sound Scene Example

This example demonstrates the `sound` component for playing audio in a BabylonML scene. It includes:

*   **Non-Spatial Sound:** An entity (`background-music`) plays looping background audio that doesn't change based on listener position.
*   **Spatial Sound (Moving Emitter):** A sound is attached to a moving box (`emitter`). The sound's volume and potentially panning will change as the box moves relative to the listener (camera), using a linear distance model.
*   **Spatial Sound (Static Emitter):** A sound is attached to a static sphere (`static-emitter`), demonstrating spatial audio with an exponential distance model.

Note: Browser policies often require user interaction (like a click) before audio can play automatically. The `autoplay: true` attribute might not work until the user interacts with the page. The example uses placeholder sound URLs; replace them with actual accessible audio files.

[View Live Example](../../examples/sound_scene.html)

## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <title>BabylonML Sound Component Example</title>
    <script src="../dist/babylonml.js"></script> <!-- Assuming bundled library path -->
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        #renderCanvas { width: 100%; height: 100%; touch-action: none; }
    </style>
</head>
<body>
    <bml-scene antialias>
        <!-- Default camera and light will be created -->
        <bml-entity camera="type: arcRotate; target: 0 1 0; radius: 15; alpha: -1.57; beta: 1.2; attachControl: true"></bml-entity>
        <bml-entity light="type: hemispheric; intensity: 0.7"></bml-entity>

        <!-- Ground -->
        <bml-entity geometry="type: ground; width: 20; height: 20" material="color: #55AA55"></bml-entity>

        <!-- Background Music (Non-Spatial) -->
        <!-- Replace 'sounds/music.mp3' with an actual accessible sound file URL -->
        <bml-entity id="background-music"
                    sound="src: https://www.soundjay.com/buttons/button-1.wav; autoplay: true; loop: true; volume: 0.3">
            <!-- This entity doesn't need geometry, it's just a sound holder -->
        </bml-entity>

        <!-- Moving Emitter (Spatial Sound) -->
        <!-- Replace 'sounds/engine.wav' with an actual accessible sound file URL -->
        <bml-entity id="emitter"
                    position="0 1 8"
                    animation="property: position; to: 0 1 -8; dur: 6000; loop: true; autoplay: true; easing: linear">
            <bml-box material="color: #4A86E8"></bml-box>
            <!-- Sound attached to the moving box entity -->
            <bml-entity sound="src: https://www.soundjay.com/buttons/button-3.wav;
                               loop: true;
                               autoplay: true;
                               spatial: true;
                               volume: 0.8;
                               distanceModel: linear;
                               rolloffFactor: 0.8;
                               maxDistance: 15">
            </bml-entity>
        </bml-entity>

        <!-- Static Emitter (Spatial Sound) -->
         <!-- Replace 'sounds/beep.wav' with an actual accessible sound file URL -->
        <bml-entity id="static-emitter" position="-5 1 0">
            <bml-sphere material="color: #E06666"></bml-sphere>
             <bml-entity sound="src: https://www.soundjay.com/buttons/button-4.wav;
                                loop: true;
                                autoplay: true;
                                spatial: true;
                                volume: 0.7;
                                distanceModel: exponential;
                                rolloffFactor: 1.5;
                                refDistance: 2;
                                maxDistance: 10">
             </bml-entity>
        </bml-entity>

    </bml-scene>

    <script>
        // Optional: Add JS controls if needed, e.g., buttons to play/pause
        // const musicEntity = document.getElementById('background-music');
        // const musicComponent = musicEntity?.components?.sound;
        // if (musicComponent && musicComponent.sound) {
        //     // musicComponent.sound.play(); // Example
        // }
    </script>
</body>
</html>
```