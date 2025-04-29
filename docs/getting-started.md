# Getting Started with BabylonML

This guide will walk you through setting up BabylonML and creating your first basic scene.

## Installation

Currently, BabylonML is intended to be used directly from its source or build output within a project.

1.  **Clone or Download:** Obtain the BabylonML project files.
2.  **Build the Framework:** Navigate to the project's root directory in your terminal and run the build command:
    ```bash
    npm install
    npm run build
    ```
    This generates the necessary `dist/babylonml.js` file.
3.  **Include in HTML:** In your HTML file, include the built script:
    ```html
    <script src="path/to/dist/babylonml.js"></script>
    ```
    Make sure the `src` path correctly points to the location of `babylonml.js` relative to your HTML file.

## Your First Scene

Create an HTML file (e.g., `index.html`) and add the following structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My First BabylonML Scene</title>
  <style>
    /* Basic styling to ensure the scene is visible */
    html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; width: 100%; }
    bml-scene { width: 100vw; height: 100vh; display: block; }
    canvas { display: block; }
  </style>
  <!-- Link to the built BabylonML script -->
  <script src="../dist/babylonml.js"></script> <!-- Adjust path as needed -->
</head>
<body>
  <bml-scene>
    <!-- A simple red box -->
    <bml-entity
      id="red-box"
      position="0 1 -5"
      geometry="type: box; width: 1; height: 1; depth: 1"
      material="type: standard; diffuseColor: #FF0000">
    </bml-entity>

    <!-- A ground plane -->
    <bml-entity
      id="ground"
      position="0 0 -5"
      geometry="type: ground; width: 6; height: 6"
      material="type: standard; diffuseColor: #444444">
    </bml-entity>
  </bml-scene>
</body>
</html>
```

## Running Locally

Because browsers have security restrictions, you need to serve this HTML file from a local web server.

1.  **Navigate:** Open your terminal in the directory containing your HTML file (or the root of the BabylonML project if your HTML file is inside it, like in the `examples` folder).
2.  **Serve:** Use a simple web server. `npx http-server` is a good option:
    ```bash
    # If your HTML is index.html in the current directory
    npx http-server -c-1
    ```
    Alternatively, if serving from the `babylonml` project root and opening `examples/basic_scene.html`:
    ```bash
    npx http-server . -o examples/basic_scene.html -c-1
    ```
    The `-c-1` flag disables caching, which is helpful during development.
3.  **View:** Open the URL provided by the server (usually `http://127.0.0.1:8080`) in your web browser. You should see a red box sitting on a grey ground plane.

You've now set up and run your first BabylonML scene! Explore the other documentation sections to learn more about entities, components, and advanced features.

## Using via CDN

If you prefer not to build the library locally, you can include BabylonML directly from the CDN using the following script tags in your HTML's `<head>`:

**Recommended (Minified):**
```html
<script src="https://firebasestorage.googleapis.com/v0/b/story-splat.firebasestorage.app/o/public%2Fbabylon%2Fcdn%2Fbabylonml.min-1.1.0.js?alt=media&token=b2fe3e00-4c27-467b-accb-89d7783348b5"></script>
```

**Development (Unminified):**
```html
<script src="https://firebasestorage.googleapis.com/v0/b/story-splat.firebasestorage.app/o/public%2Fbabylon%2Fcdn%2Fbabylonml-1.1.0.js?alt=media&token=b20162e6-7e6c-4ee6-8c6a-45e90f1a031e"></script>
```

Using the CDN allows you to quickly start using BabylonML without needing a local build setup. Simply include one of the script tags above, and you can proceed directly to the "Your First Scene" step, skipping the "Installation" section.
