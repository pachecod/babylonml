# Core Concepts: `<bml-scene>`

The `<bml-scene>` element is the heart of any BabylonML application. It acts as the root container for your 3D world and handles the initialization of the underlying Babylon.js engine and scene.

## Purpose

*   **Initializes Babylon.js:** Automatically creates the `Engine` and `Scene` objects required by Babylon.js.
*   **Creates a Canvas:** If no `<canvas>` element is found inside `<bml-scene>`, it will create one automatically to render the scene.
*   **Provides Defaults:** Sets up a default camera and a default light source if none are explicitly defined within the scene, making it easy to get something visible quickly.
*   **Manages Scene Lifecycle:** Starts the Babylon.js render loop to continuously draw the scene.
*   **Entity Management:** Uses a `MutationObserver` to detect when `<bml-entity>` elements are added or removed, managing their corresponding Babylon.js nodes.
*   **Provides Context:** Makes the Babylon.js `Scene` object available to descendant `<bml-entity>` elements and their components.

## Basic Usage

```html
<bml-scene>
  <!-- Entities go here -->
  <bml-entity geometry="type: box"></bml-entity>
</bml-scene>
```

This minimal example will:
1.  Create a Babylon.js Engine and Scene.
2.  Create a `<canvas>` element filling the `<bml-scene>` container.
3.  Add a default camera (likely a `FreeCamera`).
4.  Add a default light (likely a `HemisphericLight`).
5.  Start rendering the scene (which will initially be empty except for the default box entity).

## Styling

It's crucial to give `<bml-scene>` dimensions using CSS, otherwise the canvas might not be visible or have zero size. A common approach is to make it fill the viewport:

```css
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

/* Optional: Ensure canvas itself doesn't cause layout issues */
canvas {
  display: block;
}
```

## Attributes

*   **`xr`**: Enables WebXR support for the scene. This attribute initializes the Babylon.js `WebXRDefaultExperience` helper, providing a quick way to add VR or AR capabilities.
    *   `xr="vr"`: Initializes the scene for Virtual Reality (VR). Requires a VR-capable headset and browser.
    *   `xr="ar"`: Initializes the scene for Augmented Reality (AR). Requires an AR-capable device (usually mobile) and browser, and often requires the page to be served over HTTPS.
    *   `xr` or `xr="true"`: Initializes a default XR experience, typically VR.
    *   If the attribute is omitted, XR support is disabled.

    **Example:**
    ```html
    <!-- Enable VR mode -->
    <bml-scene xr="vr">
      <bml-entity geometry="type: box" position="0 1 -3"></bml-entity>
    </bml-scene>

    <!-- Enable AR mode -->
    <bml-scene xr="ar">
      <bml-entity geometry="type: sphere" position="0 1 -2"></bml-entity>
    </bml-scene>
    ```
    **Note:** WebXR support is dependent on the user's browser and hardware capabilities. The framework will attempt to initialize the requested mode, but it may fail if the requirements are not met. Check the browser console for messages regarding XR initialization status.

## Events

*   **`bml-scene-ready`:** Fired when the Babylon.js Engine and Scene have been initialized, the default camera/light (if needed) are set up, and the render loop has started. The event `detail` contains references to the Babylon.js `scene` and `engine`.

    ```javascript
    const sceneEl = document.querySelector('bml-scene');
    sceneEl.addEventListener('bml-scene-ready', (event) => {
      console.log('Scene is ready!', event.detail);
      const babylonScene = event.detail.scene;
      const babylonEngine = event.detail.engine;
      // You can now interact with the Babylon.js objects directly
    });
    ```

## Internal Details

*   The `<bml-scene>` element creates and manages instances of `BABYLON.Engine` and `BABYLON.Scene`.
*   It uses a `MutationObserver` to watch for changes to its direct children and descendants to manage `<bml-entity>` lifecycles.
