import * as BABYLON from '@babylonjs/core';

/**
 * Manages the preloading and retrieval of assets defined within <bml-assets>.
 */
export class AssetManager {
    constructor(scene) {
        if (!scene) {
            throw new Error('AssetManager requires a Babylon.js Scene instance.');
        }
        this.scene = scene;
        this.babylonAssetsManager = new BABYLON.AssetsManager(scene);
        this.assetItems = []; // Stores { id, src, type, element }
        this.loadedAssets = new Map(); // Stores loaded assets { id: loadedAsset }
        this.loadingPromise = null;

        this.babylonAssetsManager.onTaskSuccessObservable.add((task) => {
            console.log(`Asset loaded successfully: ${task.name}`);
            // Store the loaded asset using the task name (which we'll set to the asset ID)
            // Note: Accessing the actual loaded data depends on the task type
            if (task instanceof BABYLON.MeshAssetTask) {
                // MeshAssetTask loads meshes, materials, skeletons, animations
                this.loadedAssets.set(task.name, {
                    meshes: task.loadedMeshes,
                    particleSystems: task.loadedParticleSystems,
                    skeletons: task.loadedSkeletons,
                    animationGroups: task.loadedAnimationGroups,
                });
            } else if (task instanceof BABYLON.TextureAssetTask) {
                this.loadedAssets.set(task.name, task.texture);
            }
            // Add more task types as needed (BinaryFileAssetTask, etc.)
        });

        this.babylonAssetsManager.onTaskErrorObservable.add((task) => {
            console.error(`Failed to load asset: ${task.name}`, task.errorObject);
        });

        this.babylonAssetsManager.onTasksDoneObservable.add((tasks) => {
            console.log('All asset loading tasks finished.');
            // Resolve the main loading promise here if needed, handled by loadAsync
        });
    }

    /**
     * Registers an asset item element to be loaded.
     * Called by BmlAssets element.
     * @param {Element} element - The <bml-asset-item> element.
     */
    addAssetItem(element) {
        const id = element.getAttribute('id');
        const src = element.getAttribute('src');
        const type = element.getAttribute('type') || this._guessTypeFromSrc(src); // e.g., 'mesh', 'texture'

        if (!id || !src) {
            console.error('Asset item requires both "id" and "src" attributes.', element);
            return;
        }
        if (this.assetItems.some(item => item.id === id)) {
            console.warn(`Asset item with duplicate ID "${id}" found. Skipping.`);
            return;
        }

        console.log(`Registering asset: id=${id}, src=${src}, type=${type}`);
        this.assetItems.push({ id, src, type, element });
    }

    /**
     * Initiates the loading of all registered assets.
     * Returns a promise that resolves when all assets are loaded (or fail).
     * @returns {Promise<void>}
     */
    preloadAssets() {
        if (this.loadingPromise) {
            console.warn('Assets are already loading or have been loaded.');
            return this.loadingPromise;
        }

        if (this.assetItems.length === 0) {
            console.log('No assets registered for preloading.');
            return Promise.resolve();
        }

        console.log(`Starting preload of ${this.assetItems.length} assets...`);

        this.assetItems.forEach(item => {
            if (this.loadedAssets.has(item.id)) {
                console.log(`Asset "${item.id}" already loaded, skipping preload task.`);
                return;
            }

            let task;
            switch (item.type) {
                case 'mesh':
                    // Task name is used as the ID for retrieval later
                    task = this.babylonAssetsManager.addMeshTask(item.id, "", item.src, "");
                    break;
                case 'texture':
                    task = this.babylonAssetsManager.addTextureTask(item.id, item.src);
                    break;
                // Add cases for other types (binary, image, etc.)
                default:
                    console.warn(`Unsupported asset type "${item.type}" for asset ID "${item.id}". Skipping.`);
                    return;
            }
            // We use the asset ID as the task name for easy lookup in observers
            if (task) {
                task.name = item.id;
            }
        });

        // Store the promise returned by loadAsync()
        this.loadingPromise = this.babylonAssetsManager.loadAsync();

        this.loadingPromise.then(() => {
            console.log('Asset preloading complete.');
        }).catch((error) => {
            console.error('Error during asset preloading:', error);
            // Still resolve/reject the promise as AssetsManager handles individual errors
        });

        return this.loadingPromise;
    }

    /**
     * Retrieves a preloaded asset by its ID.
     * @param {string} id - The ID of the asset.
     * @returns {any | null} The loaded asset data or null if not found/loaded.
     */
    getAsset(id) {
        if (!id) return null;
        const cleanId = id.startsWith('#') ? id.substring(1) : id;
        if (!this.loadedAssets.has(cleanId)) {
            console.warn(`Asset with ID "${cleanId}" not found or not loaded yet.`);
            return null;
        }
        return this.loadedAssets.get(cleanId);
    }

    /**
     * Waits until asset loading is complete.
     * @returns {Promise<void>}
     */
    async waitForLoad() {
        if (!this.loadingPromise) {
            // If preloadAssets was never called (e.g., no <bml-assets>), resolve immediately.
            // Or if it was called but had no items.
            return Promise.resolve();
        }
        return this.loadingPromise;
    }

    /**
     * Simple heuristic to guess asset type from file extension.
     * @param {string} src
     * @returns {string | null}
     */
    _guessTypeFromSrc(src) {
        if (!src) return null;
        const extension = src.split('.').pop().toLowerCase();
        if (['glb', 'gltf', 'obj', 'babylon'].includes(extension)) {
            return 'mesh';
        }
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tga'].includes(extension)) {
            return 'texture';
        }
        // Add more guesses as needed
        return null;
    }
}
