// src/components/material.js
import { StandardMaterial, PBRMaterial, Color3, Texture, Material, AbstractMesh } from '@babylonjs/core';
import * as Parsers from '../core/parsers.js';

const MATERIAL_KEY = '_material';
// REMOVED const GEOMETRY_READY_FLAG = '_geometryReady';

export default function registerMaterialComponent(ComponentManager) {
    ComponentManager.registerComponent('material', {
        schema: {
            shader: { type: 'string', default: 'standard' },
            opacity: { type: 'number', default: 1.0 },
            side: { type: 'string', default: 'front' },
            wireframe: { type: 'boolean', default: false },
            color: { type: 'color' },
            ambient: { type: 'color' },
            diffuse: { type: 'color' },
            emissive: { type: 'color' },
            specular: { type: 'color' },
            specularPower: { type: 'number', default: 64 },
            metalness: { type: 'number', default: 0.0 },
            roughness: { type: 'number', default: 0.5 },
            map: { type: 'string' },
            diffuseTexture: { type: 'string' },
            _parsed: { type: 'map', default: {} }
        },

        init(data) {
            this[MATERIAL_KEY] = null;
            // REMOVED geometry ready flag and event listener setup
            console.log(`%cMaterial: Initializing for ${this.el.id}. Will check for geometryMesh in update.`, 'color: green;');
            // Check if geometry might already be ready (using the event detail structure)
            // Note: This direct check might be less reliable than the event listener,
            // but kept for potential edge cases where the event fires before init listener attaches.
            // We need the actual mesh, which isn't reliably available here without the event.
            // Consider removing this block if the event listener proves sufficient.
            // if (this.el.BabylonGeometryObject) { // Removed this check as it's unreliable for getting the mesh
            //     console.log(`Material init: Geometry might be ready for ${this.el.id}, but waiting for event.`);
            // }
        },

        update(data, oldData) {
            // Check if the geometry component has exposed its mesh on the element
            const targetMesh = this.el.geometryMesh;

            if (targetMesh) {
                console.log(`%cMaterial: Update called for ${this.el.id}. Found geometryMesh. Applying material. Mesh:`, 'color: green;', targetMesh);
                // Geometry mesh exists, proceed with applying the material
                this.definition._applyMaterial.call(this, data, targetMesh);
            } else {
                // Geometry mesh not ready yet, skip applying material this time.
                // It should be applied on a subsequent update call once geometry is ready.
                console.log(`%cMaterial: Update called for ${this.el.id}, but 'geometryMesh' not found on element yet. Skipping apply.`, 'color: orange;');
            }
            // The component's 'this.data' is automatically updated by the ComponentManager before 'update' is called.
        },

        // REMOVED _onGeometryReady event handler
        // REMOVED extraneous closing brace here

        // Internal method to create/update the material (defined as standard async method)
        // Now accepts the target mesh as an argument
        async _applyMaterial(data, targetMesh) {
            console.log(`%cMaterial: _applyMaterial called for ${this.el.id}. Target Mesh:`, 'color: purple; font-weight: bold;', targetMesh, 'Data:', data);

            // Use cached scene element reference for stability
            const cachedSceneEl = this.el.cachedSceneElement;
            if (!targetMesh || !cachedSceneEl?.babylonScene) {
                console.error(`%cMaterial: _applyMaterial failed for ${this.el.id} - targetMesh or scene missing. Mesh:`, 'color: red;', targetMesh, 'Scene:', cachedSceneEl?.babylonScene);
                return;
            }

            const scene = cachedSceneEl.babylonScene;
            // const node = this.el.babylonNode; // No longer use the entity's node

            // Check if the passed object is indeed a mesh
            if (!(targetMesh instanceof AbstractMesh)) {
                console.warn(`%cMaterial: _applyMaterial failed for ${this.el.id} - target object is not an AbstractMesh. Target:`, 'color: orange;', targetMesh);
                return;
            }
             console.log(`%cMaterial: Target mesh ${targetMesh.name} is valid AbstractMesh for ${this.el.id}.`, 'color: purple;');

            let currentMaterial = targetMesh.material; // Use the target mesh's material
             // console.log(`%cMaterial: Current material on mesh ${targetMesh.name} for ${this.el.id}:`, 'color: purple;', currentMaterial); // Less verbose log
            const desiredShaderType = data.shader?.toLowerCase() || 'standard';
            let needsNewMaterial = false;

            if (!currentMaterial ||
                (desiredShaderType === 'pbr' && !(currentMaterial instanceof PBRMaterial)) ||
                (desiredShaderType === 'standard' && !(currentMaterial instanceof StandardMaterial))) {
                needsNewMaterial = true;
            }

            if (needsNewMaterial) {
                 console.log(`%cMaterial: Needs new material for mesh ${targetMesh.name} on ${this.el.id}. Desired: ${desiredShaderType}, Current: ${currentMaterial?.constructor?.name}`, 'color: purple;');
                const oldMaterial = currentMaterial;
                const materialName = `${this.el.id || 'bml_entity'}_mat_${desiredShaderType}`;

                if (desiredShaderType === 'pbr') {
                    currentMaterial = new PBRMaterial(materialName, scene);
                    console.log(`%cMaterial: Created new PBRMaterial (${currentMaterial.name}) for ${this.el.id}`, 'color: purple;');
                } else {
                    currentMaterial = new StandardMaterial(materialName, scene);
                    console.log(`%cMaterial: Created new StandardMaterial (${currentMaterial.name}) for mesh ${targetMesh.name} on entity ${this.el.id}`, 'color: purple;');
                }

                targetMesh.material = currentMaterial; // Apply to the target mesh
                 console.log(`%cMaterial: Applied new material (${currentMaterial.name}) to mesh ${targetMesh.name} on ${this.el.id}.`, 'color: purple; font-weight: bold;');
                this[MATERIAL_KEY] = currentMaterial;

                if (oldMaterial && oldMaterial !== currentMaterial) {
                    console.log(`%cMaterial: Disposing old material (${oldMaterial.name}) from mesh ${targetMesh.name}`, 'color: purple;');
                    oldMaterial.dispose();
                }
            } else {
                if (!this[MATERIAL_KEY]) {
                    this[MATERIAL_KEY] = currentMaterial;
                }
            }

            // --- Update Material Properties ---
            if (data.opacity !== undefined) currentMaterial.alpha = data.opacity;
            if (data.wireframe !== undefined) currentMaterial.wireframe = data.wireframe;
            if (data.side !== undefined) {
                switch (data.side.toLowerCase()) {
                    case 'back':
                        currentMaterial.sideOrientation = Material.ClockwiseSideOrientation;
                        currentMaterial.backFaceCulling = true;
                        break;
                    case 'double':
                        currentMaterial.sideOrientation = Material.ClockwiseSideOrientation;
                        currentMaterial.backFaceCulling = false;
                        break;
                    case 'front':
                    default:
                        currentMaterial.sideOrientation = Material.CounterClockwiseSideOrientation;
                        currentMaterial.backFaceCulling = true;
                        break;
                }
            }

            const colorValue = data.color !== undefined ? data.color : data.diffuse;
            if (colorValue !== undefined && typeof colorValue === 'object' && colorValue.r !== undefined) {
                const babylonColor = new Color3(colorValue.r, colorValue.g, colorValue.b);
                if (currentMaterial instanceof PBRMaterial) {
                    currentMaterial.albedoColor = babylonColor;
                } else if (currentMaterial instanceof StandardMaterial) {
                    currentMaterial.diffuseColor = babylonColor;
                }
            }
            if (data.emissive !== undefined && typeof data.emissive === 'object' && data.emissive.r !== undefined && currentMaterial.emissiveColor) {
                 currentMaterial.emissiveColor = new Color3(data.emissive.r, data.emissive.g, data.emissive.b);
            }

            if (currentMaterial instanceof StandardMaterial) {
                if (data.ambient !== undefined && typeof data.ambient === 'object' && data.ambient.r !== undefined && currentMaterial.ambientColor) {
                    currentMaterial.ambientColor = new Color3(data.ambient.r, data.ambient.g, data.ambient.b);
                }
                if (data.specular !== undefined && typeof data.specular === 'object' && data.specular.r !== undefined && currentMaterial.specularColor) {
                    currentMaterial.specularColor = new Color3(data.specular.r, data.specular.g, data.specular.b);
                }
                if (data.specularPower !== undefined) {
                    currentMaterial.specularPower = data.specularPower;
                }
                 const mapValueStd = data.map !== undefined ? data.map : data.diffuseTexture;
                 if (mapValueStd !== undefined) {
                     currentMaterial.diffuseTexture = await this._getTexture(mapValueStd, scene);
                 }
            }

            if (currentMaterial instanceof PBRMaterial) {
                if (data.metalness !== undefined) currentMaterial.metallic = data.metalness;
                if (data.roughness !== undefined) currentMaterial.roughness = data.roughness;
                 const mapValuePbr = data.map !== undefined ? data.map : data.albedoTexture;
                 if (mapValuePbr !== undefined) {
                     currentMaterial.albedoTexture = await this._getTexture(mapValuePbr, scene);
                 }
            }
        },

        async _getTexture(src, scene) {
            if (!src) {
                return null;
            }

            // Use cached scene element reference
            const cachedSceneEl = this.el.cachedSceneElement;

            if (src.startsWith('#')) {
                const assetId = src;
                console.log(`Material: Attempting to get preloaded texture asset "${assetId}"...`);
                if (!cachedSceneEl?.assetManager) {
                    console.error(`Material: AssetManager not found on scene element for asset "${assetId}".`);
                    return null;
                }
                await cachedSceneEl.waitForAssets();
                const loadedTexture = cachedSceneEl.assetManager.getAsset(assetId);
                if (loadedTexture instanceof Texture) {
                    console.log(`Material: Found preloaded texture asset "${assetId}".`);
                    return loadedTexture;
                } else {
                    console.warn(`Material: Preloaded asset "${assetId}" not found or is not a Texture.`);
                    return null;
                }
            } else {
                console.log(`Material: Loading texture directly from URL "${src}"...`);
                try {
                    return new Texture(src, scene);
                } catch (error) {
                    console.error(`Material: Error loading texture directly from "${src}":`, error);
                    return null;
                }
            }
        },

        remove() {
            // REMOVED event listener removal and ready flag logic

            const material = this[MATERIAL_KEY];
            if (material) {
                console.log(`%cMaterial: Removing component for ${this.el.id}, disposing tracked material (${material.name})`, 'color: green;');
                // We don't necessarily know the target mesh reliably here during removal,
                // but disposing the material itself is the main goal.
                material.dispose();
            }
            this[MATERIAL_KEY] = null;
            // REMOVED _targetMesh clearing
        }
    });
}
