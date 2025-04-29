# Text Scene Example (Planned Feature)

**Note:** The `text` component demonstrated in this example is a planned feature and is **not yet implemented** in the current version of BabylonML. This example shows the intended syntax and usage.

This example demonstrates how the planned `text` component could be used to display text in the 3D scene:

*   Define text properties like `value`, `color`, `font`, `backgroundColor`, and sizing parameters (`planeHeight`, `textureWidth`, `textureHeight`) within the `text` attribute.
*   The component would likely render the text onto a plane using Babylon.js's Dynamic Texture or GUI features.
*   The example also shows how text properties could potentially be updated dynamically via JavaScript.

[View Live Example](../../examples/text_scene.html) (Note: Will not function correctly until the `text` component feature is implemented)

## Source Code (Illustrative)

```html
<!DOCTYPE html>
<html>
<head>
    <title>BabylonML Text Component Example</title>
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        canvas { width: 100%; height: 100%; display: block; }
    </style>
    <script src="../dist/babylonml.js"></script> <!-- Adjust path to your build -->
</head>
<body>
    <bml-scene>

        <!-- Camera -->
        <bml-entity camera="type: arcRotate; target: 0 1 0; radius: 8; beta: 1.3; alpha: -1.5"></bml-entity>

        <!-- Lights -->
        <bml-entity light="type: hemispheric; intensity: 1.0"></bml-entity>

        <!-- Basic Text -->
        <bml-entity
            id="basicText"
            position="-2 2 0"
            text="value: Basic Text!; color: yellow; font: bold 50px Arial">
        </bml-entity>

        <!-- Text with Background and Custom Size -->
        <bml-entity
            id="bgText"
            position="2 2 0"
            rotation="0 0.3 0"
            text="value: Text on Background;
                  color: #FFFFFF;
                  backgroundColor: #0000FFAA;
                  font: italic 60px sans-serif;
                  planeHeight: 1.5;
                  textureWidth: 1024;
                  textureHeight: 256">
        </bml-entity>

         <!-- Smaller Text -->
         <bml-entity
            id="smallText"
            position="0 0.5 2"
            rotation="0 -0.2 0"
            scale="0.8 0.8 0.8"
            text="value: Smaller Text Example;
                  color: cyan;
                  font: 30px Verdana;
                  planeHeight: 0.5;
                  textureWidth: 512;
                  textureHeight: 128">
         </bml-entity>

        <!-- Ground -->
        <bml-entity geometry="type: ground; width: 10; height: 10" material="color: #555"></bml-entity>

    </bml-scene>

    <script>
        // Example of dynamically updating text after a delay
        setTimeout(() => {
            const basicTextEl = document.getElementById('basicText');
            if (basicTextEl) {
                console.log("Updating basic text value...");
                basicTextEl.setAttribute('text', 'value: Updated Text!; color: lime; font: bold 50px Arial');
            }

            const bgTextEl = document.getElementById('bgText');
             if (bgTextEl) {
                console.log("Updating background text color...");
                // Only update color, keep other properties
                const currentTextAttr = bgTextEl.getAttribute('text');
                // Simple update - ideally use a proper parser/updater if complex
                const newTextAttr = currentTextAttr.replace(/color: #FFFFFF;/g, 'color: #FF00FF;');
                bgTextEl.setAttribute('text', newTextAttr);
            }
        }, 5000); // Update after 5 seconds
    </script>
</body>
</html>
```