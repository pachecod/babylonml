# Sound Component

The `sound` component allows you to attach audio sources to entities, enabling playback of background music or positional audio effects. It leverages the [Babylon.js Sound engine](https://doc.babylonjs.com/features/featuresDeepDive/audio/playingSoundsMusic).

## Usage

Attach the `sound` component as an attribute to a `<bml-entity>`. The attribute value is a string of key-value pairs separated by semicolons, similar to CSS styles.

```html
<bml-scene>
  <!-- Background music -->
  <bml-entity sound="src: sounds/music.mp3; autoplay: true; loop: true; volume: 0.5"></bml-entity>

  <!-- Spatial sound attached to a moving box -->
  <bml-entity id="emitter" position="0 1 5" animation="property: position; to: 0 1 -5; dur: 5000; loop: true; autoplay: true">
    <bml-box material="color: blue"></bml-box>
    <bml-entity sound="src: sounds/engine.wav; loop: true; autoplay: true; spatial: true; rolloffFactor: 0.5; maxDistance: 20"></bml-entity>
  </bml-entity>
</bml-scene>
```

## Properties

| Property        | Description                                                                 | Default Value |
|-----------------|-----------------------------------------------------------------------------|---------------|
| `src`           | (Required) URL of the sound file (.wav, .mp3, .ogg, etc.).                  | `null`        |
| `autoplay`      | Whether the sound should start playing automatically once loaded.           | `false`       |
| `loop`          | Whether the sound should loop indefinitely.                                 | `false`       |
| `volume`        | The volume of the sound, ranging from 0.0 (silent) to 1.0 (full volume).    | `1.0`         |
| `spatial`       | If true, enables 3D spatial audio. The sound's position will be tied to the entity's position, and volume will attenuate with distance from the listener (camera). | `false`       |
| `distanceModel` | (Spatial only) The algorithm used for distance attenuation. Options: `'linear'`, `'inverse'`, `'exponential'`. | `'linear'`    |
| `rolloffFactor` | (Spatial only) How quickly the sound volume attenuates with distance. Higher values mean faster attenuation. | `1.0`         |
| `refDistance`   | (Spatial only) The distance at which the volume is 100% (no attenuation).   | `1.0`         |
| `maxDistance`   | (Spatial only) The distance beyond which the sound will not be audible.     | `100.0`       |

## Notes

-   **Browser Audio Context:** Sound playback often requires user interaction (like a click) to start the browser's Audio Context, especially for `autoplay`. Babylon.js typically handles this automatically when the canvas is clicked or interacted with.
-   **Spatial Sound:** For spatial sound (`spatial: true`) to work effectively, the entity the `sound` component is attached to (or its parent if nested) should have a position in the 3D scene (e.g., via the `position` component or being a primitive like `<bml-box>`). The sound will be attached to the entity's underlying `TransformNode` or `Mesh`.
-   **Performance:** Loading many large sound files can impact initial load time and memory usage. Consider using appropriate audio formats and compression.
-   **Asset Management:** Currently, `src` expects a direct URL. Future integration with an asset management system (`<bml-assets>`) might allow referencing preloaded sounds by ID.
