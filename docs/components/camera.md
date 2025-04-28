# Camera Component

The `camera` component allows you to define and configure the camera used to view the BabylonML scene. It should be attached to a `<bml-entity>`.

The first `camera` component initialized in the scene will automatically become the `activeCamera`.

## Usage

```html
<bml-scene>
  <!-- Define an ArcRotateCamera -->
  <bml-entity camera="type: arcRotate; target: 0 1 0; alpha: -1.57; beta: 1.2; radius: 5; attachControl: true"></bml-entity>

  <!-- Define a UniversalCamera (FreeCamera) -->
  <bml-entity camera="type: universal; position: 0 5 -10; target: 0 0 0; attachControl: true"></bml-entity>

  <!-- Other scene entities -->
  <bml-box position="0 0 0"></bml-box>
</bml-scene>
```

## Properties

The `camera` attribute accepts a style-like string of key-value pairs, separated by semicolons.

| Property        | Description                                                                 | Default Value    | Applicable Camera Types |
| --------------- | --------------------------------------------------------------------------- | ---------------- | ----------------------- |
| `type`          | The type of camera to create.                                               | `universal`      | All                     |
| `position`      | The initial position of the camera.                                         | `0 5 -10`        | `universal`, `free`     |
| `target`        | The point the camera looks at.                                              | `0 0 0`          | `universal`, `arcRotate`|
| `alpha`         | The horizontal rotation angle (radians) around the target.                  | `-PI / 2` (-90°) | `arcRotate`             |
| `beta`          | The vertical rotation angle (radians) around the target. Clamped by default.| `PI / 2` (90°)   | `arcRotate`             |
| `radius`        | The distance from the camera to the target.                                 | `10`             | `arcRotate`             |
| `attachControl` | Whether to attach default camera controls to the canvas.                    | `true`           | All                     |
| `fov`           | Field of View (vertical, radians). *Not yet implemented.*                   | `0.8`            | All                     |
| `minZ`          | Near clipping plane distance. *Not yet implemented.*                        | `0.1`            | All                     |
| `maxZ`          | Far clipping plane distance. *Not yet implemented.*                         | `1000`           | All                     |
| `speed`         | Movement speed for universal/free cameras. *Not yet implemented.*           | `1.0`            | `universal`, `free`     |

**Supported Camera Types:**

*   `universal` (or `free`): A first-person style camera. Uses `position` and `target`.
*   `arcRotate`: A camera that rotates around a `target` point based on `alpha`, `beta`, and `radius`.

**Note:** Currently, only the initial properties set via the attribute are used. Dynamically updating the `camera` attribute after the scene loads might not fully reconfigure the camera; it might dispose the old one and create a new one based on the new attribute string.

**Active Camera:** The framework automatically sets the *first* camera component encountered in the DOM as the scene's active camera. If you define multiple cameras, only the first one will be active initially.
