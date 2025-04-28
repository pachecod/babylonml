# Component Reference: `material`

The `material` component defines the surface appearance of an entity's mesh (created by the `geometry` component). It can create and manage Babylon.js's `StandardMaterial` or `PBRMaterial`.

## Attribute Syntax

The `material` attribute uses the component/map string format. Properties control the shader type, colors, textures, and other visual aspects.

```html
<!-- A simple red standard material -->
<bml-entity material="color: red"></bml-entity>

<!-- A metallic PBR material -->
<bml-entity material="shader: pbr; color: silver; metalness: 1.0; roughness: 0.2"></bml-entity>

<!-- A semi-transparent standard material, rendering both sides -->
<bml-entity material="color: blue; opacity: 0.5; side: double"></bml-entity>

<!-- A PBR material using a texture map -->
<bml-entity material="shader: pbr; map: path/to/texture.jpg; roughness: 0.8"></bml-entity>
```

## Common Properties

These properties apply to both `standard` and `pbr` shaders.

| Property        | Type        | Default     | Description                                                                 |
| :-------------- | :---------- | :---------- | :-------------------------------------------------------------------------- |
| `shader`        | string      | `'standard'`| Selects the material type: `'standard'` or `'pbr'`.                         |
| `color`         | color       | `#FFFFFF`   | Base color. Maps to `diffuseColor` (standard) or `albedoColor` (PBR).       |
| `emissive`      | color       | `#000000`   | Color emitted by the material, independent of light (glow). Maps to `emissiveColor`. |
| `opacity`       | number      | `1.0`       | Overall transparency (0 = fully transparent, 1 = fully opaque). Maps to `alpha`. |
| `side`          | string      | `'front'`   | Which faces to render: `'front'`, `'back'`, or `'double'`. Controls `backFaceCulling` and `sideOrientation`. |
| `wireframe`     | boolean     | `false`     | If `true`, renders the mesh as a wireframe instead of solid surfaces.       |
| `map`           | string (URL)| `null`      | Texture for base color. Maps to `diffuseTexture` (standard) or `albedoTexture` (PBR). *(Texture loading needs implementation)* |
| *... (other common texture properties like `emissiveTexture`, `bumpTexture` could be added)* |             |             |                                                                             |

## `shader: standard` Specific Properties

These properties only apply when `shader` is `standard` (or omitted).

| Property        | Type        | Default     | Description                                                                 |
| :-------------- | :---------- | :---------- | :-------------------------------------------------------------------------- |
| `ambient`       | color       | `#000000`   | Color of the material in ambient light. Maps to `ambientColor`.             |
| `diffuse`       | color       | `#FFFFFF`   | Base color. Use `color` property instead. Maps to `diffuseColor`.           |
| `specular`      | color       | `#FFFFFF`   | Color of highlights from light sources. Maps to `specularColor`.            |
| `specularPower` | number      | `64`        | Controls the sharpness/size of specular highlights. Higher is sharper.        |
| `diffuseTexture`| string (URL)| `null`      | Texture for base color. Use `map` property instead. *(Texture loading needs implementation)* |

## `shader: pbr` Specific Properties

These properties only apply when `shader` is `pbr`.

| Property        | Type        | Default     | Description                                                                 |
| :-------------- | :---------- | :---------- | :-------------------------------------------------------------------------- |
| `metalness`     | number      | `0.0`       | How metallic the material appears (0 = dielectric, 1 = fully metallic). Maps to `metallic`. |
| `roughness`     | number      | `0.5`       | How rough the surface is (0 = smooth/shiny, 1 = fully rough/diffuse).       |
| *... (other PBR properties like `metallicRoughnessTexture`, `environmentTexture` could be added)* |             |             |                                                                             |

**Color Parsing:** Color properties accept standard CSS color formats like `#RRGGBB`, `#RGB`, color names (`red`, `blue`), `rgb(r,g,b)`.

## Underlying Babylon.js Object

This component creates and manages a `BABYLON.StandardMaterial` or `BABYLON.PBRMaterial` instance and applies it to the mesh created by the `geometry` component on the same entity. If the `shader` type changes, the old material is disposed and a new one is created.

## Examples

```html
<bml-scene>
  <!-- Standard Material Example: Shiny blue sphere -->
  <bml-entity
    geometry="type: sphere"
    position="-2 1 -5"
    material="color: #0000FF; specular: #AAAAFF; specularPower: 128">
  </bml-entity>

  <!-- PBR Material Example: Rough metallic cube -->
  <bml-entity
    geometry="type: box"
    position="2 1 -5"
    material="shader: pbr; color: #C0C0C0; metalness: 0.8; roughness: 0.7">
  </bml-entity>

   <!-- Standard Material Example: Semi-transparent green plane, double-sided -->
  <bml-entity
    geometry="type: plane; width: 2; height: 2"
    position="0 1 -5" rotation="-90 0 0"
    material="color: green; opacity: 0.6; side: double">
  </bml-entity>

   <!-- Wireframe ground -->
  <bml-entity
    geometry="type: ground; subdivisions: 5"
    position="0 0 -5"
    material="color: grey; wireframe: true">
  </bml-entity>
</bml-scene>
```

## Notes

*   The `material` component requires a `geometry` component on the same entity to have a mesh to apply the material to. The geometry component is responsible for creating the mesh and assigning an initial material instance.
*   The `material` component primarily *updates* the properties of the material assigned by the geometry component. It will create a new material instance only if the `shader` type needs to change (from `standard` to `pbr` or vice-versa).
*   Texture properties (`map`, etc.) are defined in the schema but require specific loading logic (including caching/reuse) within the component's `update` method, which is currently basic.
*   Changing material properties dynamically via `setAttribute` will update the appearance.
