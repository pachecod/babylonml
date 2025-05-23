# Animation Scene Example

[View Live Example](https://babylonml-frontend.netlify.app/examples/animation_scene.html){:target="_blank"}

This example demonstrates the use of the `animation` component to animate various properties of entities and their components. It shows:

*   Animating `rotation.y` for continuous rotation.
*   Animating `material.opacity` for a pulsing effect.
*   Animating `position.y` for vertical movement.
*   Animating `light.intensity` for a fading light effect.
*   Animating `scaling` for a non-looping growth effect.
*   Starting an animation (`material.diffuseColor`) manually using JavaScript after a delay.


## Source Code

```html
<!DOCTYPE html>
<html>
<head>
    <title>BabylonML Animation Example</title>
    <!-- Link to BabylonML library -->
    <script src="../dist/babylonml.js"></script> <!-- Adjust path if your build output is elsewhere -->
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        bml-scene { width: 100%; height: 100%; display: block; }
    </style>
</head>
<body>
    <bml-scene>
        <!-- Default Camera and Light are provided by bml-scene if not specified -->

        <!-- Rotating Box -->
        <bml-entity id="rotating-box"
                    geometry="type: box; size: 0.5"
                    material="color: dodgerblue"
                    position="-1.5 1 -3"
                    animation="property: rotation.y; from: 0; to: 360; dur: 5000; loop: true; easing: linear;">
        </bml-entity>

        <!-- Pulsing Sphere (Opacity) -->
        <bml-entity id="pulsing-sphere"
                    geometry="type: sphere; diameter: 0.5"
                    material="color: orange; opacity: 1"
                    position="0 1 -3"
                    animation="property: material.opacity; from: 1; to: 0.1; dur: 1500; loop: true; easing: easeInOutSine;">
        </bml-entity>

        <!-- Moving Cone (Position Y) -->
        <bml-entity id="moving-cone"
                    geometry="type: cone; height: 0.7; diameterBottom: 0.4"
                    material="color: limegreen"
                    position="1.5 0.5 -3"
                    animation="property: position.y; from: 0.5; to: 1.5; dur: 2000; loop: true; easing: easeInOutBounce;">
        </bml-entity>

        <!-- Fading Light -->
        <bml-entity id="fading-light"
                    light="type: point; intensity: 1.5; diffuse: 1 1 0.8"
                    position="0 2 -1"
                    animation="property: light.intensity; from: 1.5; to: 0.3; dur: 3000; loop: true; easing: easeInOutQuad;">
        </bml-entity>

        <!-- Scaling Cylinder (Non-looping) -->
        <bml-entity id="scaling-cylinder"
                    geometry="type: cylinder; height: 0.8; diameter: 0.3"
                    material="color: purple"
                    position="-1.5 0.4 0"
                    scaling="1 1 1"
                    animation="property: scaling; from: 1 1 1; to: 1 2 1; dur: 2500; loop: false; easing: easeOutElastic; autoplay: true;">
        </bml-entity>

         <!-- Color Changing Ground (Non-looping, delayed start via JS) -->
         <bml-entity id="color-ground"
                    geometry="type: ground; width: 5; height: 5"
                    material="color: #cccccc"
                    position="0 0 0"
                    animation="property: material.diffuseColor; from: #cccccc; to: #ff8844; dur: 4000; loop: false; autoplay: false;">
         </bml-entity>
    </bml-scene>

    <script>
        // Example of starting an animation manually after a delay
        const groundEntity = document.getElementById('color-ground');
        if (groundEntity) {
            setTimeout(() => {
                // To start manually, we might need a method on the component,
                // or re-set the attribute with autoplay: true.
                // For now, let's re-set the attribute.
                console.log('Starting ground color animation...');
                groundEntity.setAttribute('animation', 'property: material.diffuseColor; from: #cccccc; to: #ff8844; dur: 4000; loop: false; autoplay: true;');
            }, 3000); // Start after 3 seconds
        }
    </script>
</body>
</html>
```
