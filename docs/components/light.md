# Light Component

The `light` component adds a light source to an entity. It wraps various Babylon.js light types.

If no entities with a `light` component are present in the scene, `<bml-scene>` creates a default HemisphericLight. Adding any entity with a `light` component will prevent this default light from being created.

## Example

```html
<!-- Add a directional light -->
<bml-entity light="type: directional; direction: 0 -1 0; intensity: 0.8; diffuse: #FFF; specular: #CCC"></bml-entity>

<!-- Add a point light attached to an entity's position -->
<bml-entity position="0 5 -2" light="type: point; intensity: 1.0; diffuse: #FFDDCC"></bml-entity>

<!-- Add a spot light -->
<bml-entity position="0 10 0" rotation="-90 0 0"
            light="type: spot; angle: 0.8; exponent: 2; intensity: 0.9; diffuse: #FFFFE0">
</bml-entity>

<!-- Add a hemispheric light -->
<bml-entity light="type: hemispheric; intensity: 0.5; diffuse: #FFFFFF; groundColor: #404040"></bml-entity>
```

## Properties

| Property      | Description                                                                                                | Default Value              | Supported Types        |
|---------------|------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|
| **type**      | The type of light source.                                                                                  | `point`                    | All                    |
| **intensity** | The brightness of the light.                                                                               | `1.0`                      | All                    |
| **diffuse**   | The diffuse color of the light (main color).                                                               | `#FFFFFF` (white)          | All                    |
| **specular**  | The specular color of the light (highlight color).                                                         | `#FFFFFF` (white)          | All except Hemispheric |
| **direction** | The direction the light is pointing (normalized vector). Used by Directional, Spot, and Hemispheric lights. | `0 -1 0`                   | Directional, Spot, Hemispheric |
| **angle**     | The angle of the spotlight's cone in radians.                                                              | `PI / 2` (approx 1.57)     | Spot                   |
| **exponent**  | The concentration factor of the spotlight. Higher values mean a more focused beam.                         | `2`                        | Spot                   |
| **groundColor**| The color of the light reflected from the ground hemisphere.                                               | `#000000` (black)          | Hemispheric            |

**Note on Position:**

*   For `point` and `spot` lights, the light's position is automatically taken from the entity's `position` component. The light is parented to the entity's transform node, so it will move with the entity.
*   For `directional` and `hemispheric` lights, the entity's `position` component is ignored by the light itself, as these lights illuminate the whole scene directionally.

## Light Types

*   **`point`**: Emits light in all directions from its position. (Default)
*   **`directional`**: Emits parallel light rays from an infinite distance in a specific direction. Position does not matter.
*   **`spot`**: Emits light in a cone shape from its position towards a direction.
*   **`hemispheric`**: Simulates ambient light coming from the sky (diffuse) and the ground (groundColor). Position does not matter.
