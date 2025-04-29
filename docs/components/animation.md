# Animation Component

The `animation` component allows you to animate properties of an entity or its other components over time. It leverages the Babylon.js animation engine.

## Usage

Attach the `animation` attribute to a `<bml-entity>`. The value is a string of semicolon-separated key-value pairs defining the animation parameters.

```html
<bml-scene>
  <bml-entity geometry="type: box" material="color: blue"
              position="0 1 -3"
              animation="property: rotation.y; to: 360; dur: 4000; loop: true; easing: easeInOutQuad; autoplay: true;">
  </bml-entity>

  <bml-entity geometry="type: sphere" material="color: red; opacity: 1"
              position="-2 1 -3"
              animation="property: material.opacity; from: 1; to: 0.2; dur: 2000; loop: true; autoplay: true;">
  </bml-entity>
</bml-scene>
```

**Note:** Currently, only one `animation` attribute is supported per entity.

## Properties

The `animation` attribute string accepts the following key-value pairs:

| Property     | Description                                                                                                                               | Default Value | Required |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------|----------|
| `property`   | The target property to animate. Use dot notation for nested properties (e.g., `position`, `rotation.y`, `material.opacity`, `light.intensity`). | `null`        | Yes      |
| `to`         | The end value of the animation. The format should match the property type (e.g., number for `scale.x`, `vec3` string "x y z" for `position`, color string "r g b" or hex for `material.color`). | `null`        | Yes      |
| `from`       | The start value of the animation. If omitted, the property's current value at initialization is used. Format matches `to`.                 | Current Value | No       |
| `dur`        | The duration of the animation in milliseconds.                                                                                            | `1000`        | No       |
| `loop`       | Whether the animation should loop (`true` or `false`).                                                                                    | `false`       | No       |
| `easing`     | The easing function to use. See available options below.                                                                                  | `linear`      | No       |
| `autoplay`   | Whether the animation should start automatically (`true` or `false`).                                                                     | `true`        | No       |

## Target Properties

The `property` key can target:

1.  **Direct Transform Properties:** `position`, `rotation`, `scaling` (and their components like `position.x`, `rotation.y`, `scaling.z`). These target the entity's underlying `TransformNode`.
2.  **Component Properties:** Properties of other components attached to the same entity. The component must expose the underlying Babylon.js object (e.g., `materialObject`, `lightObject`) or the property directly. Examples:
    *   `material.opacity`
    *   `material.diffuseColor` (requires a color value like "1 0 0" or "#FF0000")
    *   `light.intensity`

## Easing Functions

The following easing function names are supported for the `easing` property:

*   `linear` (Default)
*   `ease`, `ease-in`, `ease-out`, `ease-in-out` (Mapped to CubicEase)
*   `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
*   `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
*   `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
*   `easeInQuint`, `easeOutQuint`, `easeInOutQuint`
*   `easeInSine`, `easeOutSine`, `easeInOutSine`
*   `easeInExpo`, `easeOutExpo`, `easeInOutExpo`
*   `easeInCirc`, `easeOutCirc`, `easeInOutCirc`
*   `easeInBack`, `easeOutBack`, `easeInOutBack`
*   `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
*   `easeInBounce`, `easeOutBounce`, `easeInOutBounce`

## Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>BabylonML Animation Example</title>
    <script src="../dist/babylonml.js"></script> <!-- Adjust path as needed -->
    <style>
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
        bml-scene { width: 100%; height: 100%; display: block; }
    </style>
</head>
<body>
    <bml-scene>
        <!-- Rotating Box -->
        <bml-entity geometry="type: box; size: 0.5" material="color: dodgerblue"
                    position="-1.5 1 -3"
                    animation="property: rotation.y; from: 0; to: 360; dur: 5000; loop: true; easing: linear;">
        </bml-entity>

        <!-- Pulsing Sphere (Opacity) -->
        <bml-entity geometry="type: sphere; diameter: 0.5" material="color: orange; opacity: 1"
                    position="0 1 -3"
                    animation="property: material.opacity; from: 1; to: 0.1; dur: 1500; loop: true; easing: easeInOutSine;">
        </bml-entity>

        <!-- Moving Cone (Position) -->
        <bml-entity geometry="type: cone; height: 0.7; diameterBottom: 0.4" material="color: limegreen"
                    position="1.5 0.5 -3"
                    animation="property: position.y; from: 0.5; to: 1.5; dur: 2000; loop: true; easing: easeInOutBounce;">
        </bml-entity>

        <!-- Fading Light -->
        <bml-entity light="type: point; intensity: 1.5; diffuse: 1 1 0.8"
                    position="0 2 -1"
                    animation="property: light.intensity; from: 1.5; to: 0.3; dur: 3000; loop: true; easing: easeInOutQuad;">
        </bml-entity>
    </bml-scene>
</body>
</html>
