// src/components/text.js
import { MeshBuilder, StandardMaterial, DynamicTexture, Color3, Vector3 } from '@babylonjs/core';
import * as Parsers from '../core/parsers.js';

const TEXT_PLANE_KEY = '_textPlane';
const TEXT_MATERIAL_KEY = '_textMaterial';
const TEXT_TEXTURE_KEY = '_textTexture';

export default function registerTextComponent(ComponentManager) {
    ComponentManager.registerComponent('text', {
        // Schema definition for the text component
        schema: {
            value: { type: 'string', default: 'Hello World' },
            font: { type: 'string', default: 'bold 44px monospace' }, // CSS font string
            color: { type: 'color', default: { r: 1, g: 1, b: 1 } }, // Text color
            backgroundColor: { type: 'color', default: { r: 0, g: 0, b: 0, a: 0 } }, // Texture background (transparent default)
            planeWidth: { type: 'number' }, // Optional: Explicit width for the plane mesh
            planeHeight: { type: 'number', default: 1 }, // Optional: Explicit height (default 1 world unit)
            textureWidth: { type: 'number', default: 512 }, // Width of the dynamic texture
            textureHeight: { type: 'number', default: 256 }, // Height of the dynamic texture
            // TODO: Add alignment, padding, etc.
        },

        init(data) {
            // console.log('Text component initializing:', data);
            this[TEXT_PLANE_KEY] = null;
            this[TEXT_MATERIAL_KEY] = null;
            this[TEXT_TEXTURE_KEY] = null;
            // Actual creation happens in update
        },

        update(oldData) {
            // console.log('Updating text component:', this.data);
            // Add extra guard for this.el itself
            if (!this.el) {
                  console.warn("Text component update called before 'this.el' was ready.");
                  return;
             }
            // Access sceneElement via this.el
            const sceneElement = this.el.sceneElement;
            if (!this.el.babylonNode || !sceneElement?.babylonScene) {
                console.warn("Text component update called before babylonNode or scene was ready on", this.el);
                return;
            }

            const scene = sceneElement.babylonScene; // Use variable derived from this.el
            const data = this.data;

            // --- Get or Create Plane Mesh ---
            let plane = this[TEXT_PLANE_KEY];
            if (!plane) {
                const planeName = `${this.el.id || 'bml_entity'}_text_plane`;
                // Use provided height, calculate width based on texture aspect ratio if not provided
                const texAspect = data.textureWidth / data.textureHeight;
                const planeHeight = data.planeHeight;
                const planeWidth = data.planeWidth !== undefined ? data.planeWidth : planeHeight * texAspect;

                plane = MeshBuilder.CreatePlane(planeName, { width: planeWidth, height: planeHeight }, scene);
                plane.parent = this.el.babylonNode; // Parent to the entity's transform node (Use babylonNode)
                this[TEXT_PLANE_KEY] = plane;
                console.log(`Text: Created plane ${planeName}`);
            } else {
                 // Update plane size if attributes changed
                 const texAspect = data.textureWidth / data.textureHeight;
                 const planeHeight = data.planeHeight;
                 const planeWidth = data.planeWidth !== undefined ? data.planeWidth : planeHeight * texAspect;
                 // TODO: Check if scaling is sufficient or if recreation is needed for significant size changes
                 // For now, let's assume scaling works for dynamic updates
                 // plane.scaling.x = planeWidth / (plane.geometry?.getBoundingInfo().boundingBox.extendSize.x * 2 || 1);
                 // plane.scaling.y = planeHeight / (plane.geometry?.getBoundingInfo().boundingBox.extendSize.y * 2 || 1);
                 // NOTE: Recreating might be safer if geometry needs different subdivisions based on size.
                 // Let's stick to initial size for now. Revisit if dynamic size updates are crucial.
            }


            // --- Get or Create Material ---
            let material = this[TEXT_MATERIAL_KEY];
            if (!material) {
                const matName = `${this.el.id || 'bml_entity'}_text_mat`;
                material = new StandardMaterial(matName, scene);
                material.backFaceCulling = false; // Render text from both sides
                material.emissiveColor = new Color3(1, 1, 1); // Make texture color appear directly
                material.disableLighting = true; // Text shouldn't be affected by scene lighting
                plane.material = material;
                this[TEXT_MATERIAL_KEY] = material;
                console.log(`Text: Created material ${matName}`);
            }

            // --- Get or Create Dynamic Texture ---
            let texture = this[TEXT_TEXTURE_KEY];
            // Recreate texture if size changed
            if (!texture || texture.getSize().width !== data.textureWidth || texture.getSize().height !== data.textureHeight) {
                if (texture) texture.dispose(); // Dispose old one

                const texName = `${this.el.id || 'bml_entity'}_text_tex`;
                texture = new DynamicTexture(texName, { width: data.textureWidth, height: data.textureHeight }, scene, true); // Generate MipMaps = true
                material.diffuseTexture = texture;
                this[TEXT_TEXTURE_KEY] = texture;
                console.log(`Text: Created DynamicTexture ${texName} (${data.textureWidth}x${data.textureHeight})`);
            }

            // --- Draw Text ---
            const ctx = texture.getContext();
            const size = texture.getSize();

            // Background Color
            const bg = data.backgroundColor.toBabylonColor4(); // Use Color4 parser result
            ctx.fillStyle = `rgba(${bg.r * 255}, ${bg.g * 255}, ${bg.b * 255}, ${bg.a})`;
            ctx.fillRect(0, 0, size.width, size.height);

            // Text Color & Font
            const fg = data.color.toBabylonColor3(); // Use Color3 parser result
            ctx.fillStyle = `rgb(${fg.r * 255}, ${fg.g * 255}, ${fg.b * 255})`;
            ctx.font = data.font;

            // Text Positioning (Simple centered for now)
            // TODO: Add alignment options (left, right, top, bottom, center)
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const x = size.width / 2;
            const y = size.height / 2;

            // Clear previous text? No, background fill handles it.
            ctx.fillText(data.value, x, y);

            // Update the texture
            texture.update();
        },

        remove() {
            // console.log('Removing text component');
            if (this[TEXT_TEXTURE_KEY]) {
                this[TEXT_TEXTURE_KEY].dispose();
                this[TEXT_TEXTURE_KEY] = null;
            }
            if (this[TEXT_MATERIAL_KEY]) {
                this[TEXT_MATERIAL_KEY].dispose();
                this[TEXT_MATERIAL_KEY] = null;
            }
            if (this[TEXT_PLANE_KEY]) {
                this[TEXT_PLANE_KEY].dispose();
                this[TEXT_PLANE_KEY] = null;
            }
        }
    });
}
