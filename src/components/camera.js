import { ArcRotateCamera, UniversalCamera } from '@babylonjs/core/Cameras'; // Removed Vector3
import { Vector3 } from '@babylonjs/core/Maths/math.vector'; // Added specific Vector3 import
import { parseObjectString, parseVec3, vec3ToObject, parseNumber, parseBoolean } from '../core/parsers'; // Corrected import names

// Track if a camera component has already set the active camera
let activeCameraSet = false;

// No separate component object needed here

export function registerCameraComponent(ComponentManager) { // Keep the registration function export
    ComponentManager.registerComponent('camera', { // Define component object directly here
        schema: {
            type: { type: 'string', default: 'universal' }, // universal, arcRotate, free, etc.
        position: { type: 'vec3', default: '0 5 -10' }, // Used by universal/free
        target: { type: 'vec3', default: '0 0 0' },   // Used by arcRotate
        alpha: { type: 'number', default: -Math.PI / 2 }, // Used by arcRotate
        beta: { type: 'number', default: Math.PI / 2 },   // Used by arcRotate
        radius: { type: 'number', default: 10 },         // Used by arcRotate
        attachControl: { type: 'boolean', default: true }, // Attach controls to canvas
        // Add other common camera properties as needed (fov, minZ, maxZ, speed, etc.)
        },

        // init() is called once when the component is first attached.
        init(data) {
            // 'this' is the component instance object. Access the element via 'this.el'
            const entityElement = this.el;
            const sceneElement = entityElement.sceneElement; // Use the element's getter
            // console.log('Camera component init started for element:', entityElement.id || 'no-id'); // Log start

            const setupCamera = () => {
                // console.log('Camera component: setupCamera() called for element:', entityElement.id || 'no-id'); // Log callback execution
                // Re-check sceneElement and its properties here as they might have become available
                const currentSceneElement = entityElement.sceneElement;
                if (!currentSceneElement || !currentSceneElement.babylonScene || !currentSceneElement.babylonCanvas) {
                    console.error("Camera component setupCamera: Scene element or Babylon scene/canvas not ready on element:", entityElement);
                    return;
                }
                // Store scene/canvas refs on the component instance ('this')
                this.scene = currentSceneElement.babylonScene;
                this.canvas = currentSceneElement.babylonCanvas;
                this._cameraInstance = null; // Initialize placeholder on the component instance
                // console.log('Camera component setupCamera: Scene/canvas references set for element:', entityElement.id || 'no-id');
                // Note: Actual camera creation happens in update(), called after init.
            };

            if (sceneElement && sceneElement.isReady) {
                // console.log('Camera component init: Scene already ready for element:', entityElement.id || 'no-id');
                setupCamera();
            } else if (sceneElement) {
                // console.log('Camera component init: Scene not ready, adding event listener for element:', entityElement.id || 'no-id');
                // Define the listener function separately for clarity and removal
                const sceneReadyListener = (event) => {
                    // console.log(`Camera component: 'bml-scene-ready' event received for element: ${entityElement.id || 'no-id'}`, event.detail); // <<< Log inside callback
                    // Ensure we remove the listener after it runs
                    sceneElement.removeEventListener('bml-scene-ready', sceneReadyListener);
                    // console.log(`Camera component: Removed 'bml-scene-ready' listener for element: ${entityElement.id || 'no-id'}`);
                    setupCamera();
                };
                sceneElement.addEventListener('bml-scene-ready', sceneReadyListener);
                // console.log(`Camera component init: Added 'bml-scene-ready' event listener for element: ${entityElement.id || 'no-id'}`); // <<< Log after adding listener
            } else {
                // This case should be less likely now if BmlEntity waits, but keep for safety
                console.error("Camera component init: Could not find sceneElement for element:", entityElement);
                // Component won't function without the scene.
            }
        },

        // update() is called on initialization *after* init(), and whenever the attribute changes.
        update(data, oldData) { // Accept parsed data object and optional oldData
            // 'this' is the component instance object. Access element via 'this.el'
            const entityElement = this.el;
            // 'data' is the parsed attribute value (e.g., { type: 'arcRotate', ... })
            // 'oldData' is the previously parsed data (for comparison)

            // Re-verify scene/canvas access using the stored refs on 'this' (the instance)
            if (!this.scene || !this.canvas) {
                 // Attempt to re-acquire references if init/setupCamera failed but scene is now ready
                 const currentSceneElement = entityElement.sceneElement;
                 if (currentSceneElement && currentSceneElement.isReady && currentSceneElement.babylonScene && currentSceneElement.babylonCanvas) {
                     this.scene = currentSceneElement.babylonScene;
                     this.canvas = currentSceneElement.babylonCanvas;
                     console.warn("Camera component update: Re-acquired scene/canvas references.");
                 } else {
                     console.error("Camera update called before scene/canvas were ready or available on element:", entityElement);
                     return; // Still not ready
                 }
            }

            // If camera exists on the instance, dispose the old one before creating a new one
            if (this._cameraInstance) {
                // Use the parsed 'attachControl' value from the *previous* data (oldData)
                const oldAttachControl = oldData?.attachControl ?? this.schema?.attachControl?.default ?? true;

                if (oldAttachControl && this._cameraInstance.detachControl) { // Check if method exists
                    try {
                         this._cameraInstance.detachControl(this.canvas); // Use the stored canvas reference from the instance
                    } catch (e) {
                         console.warn("Error detaching camera control:", e);
                    }
                }
                this._cameraInstance.dispose();
                this._cameraInstance = null; // Clear instance property
                // If this was the active camera, we might need to reset the flag,
                // but typically update shouldn't change the *active* status easily.
                // For simplicity, we assume the first camera remains active unless removed.
            }

            // Access schema from the instance ('this')
            const schema = this.schema;

            // Ensure data is an object
            const currentData = data || {};

            // Get defaults from schema (parse them here if needed)
            const defaultPosition = parseVec3(schema?.position?.default || '0 5 -10');
            const defaultTarget = parseVec3(schema?.target?.default || '0 0 0');
            const defaultAlpha = schema?.alpha?.default ?? -Math.PI / 2;
            const defaultBeta = schema?.beta?.default ?? Math.PI / 2;
            const defaultRadius = schema?.radius?.default ?? 10;
            const defaultAttachControl = schema?.attachControl?.default ?? true;
            const defaultType = schema?.type?.default || 'universal';

            // Use parsed data properties if available, otherwise use parsed defaults
            // Assumes 'data' contains values already parsed by ComponentManager based on schema type
            const type = (currentData.type || defaultType).toLowerCase();
            const positionData = currentData.position ?? defaultPosition; // data.position should be parsed vec3 array/object
            const targetData = currentData.target ?? defaultTarget;     // data.target should be parsed vec3 array/object
            const alpha = currentData.alpha ?? defaultAlpha;
            const beta = currentData.beta ?? defaultBeta;
            const radius = currentData.radius ?? defaultRadius;
            const attachControl = currentData.attachControl ?? defaultAttachControl;

            // Convert parsed data (which should be arrays/objects from parseVec3) to Vector3 objects
            const positionVec = vec3ToObject(positionData);
            const targetVec = vec3ToObject(targetData);


            switch (type) {
                case 'arcRotate':
            case 'arcrotate':
                // Use element's ID if available, otherwise generate one?
                const camNameArc = `${entityElement.id || 'bmlEntity'}_arcRotateCamera`;
                this._cameraInstance = new ArcRotateCamera( // Assign to instance property
                    camNameArc,
                    alpha,
                    beta,
                    radius,
                    targetVec,
                    this.scene // Use scene from instance
                );
                // ArcRotateCamera position is determined by alpha, beta, radius, target
                break;
            case 'universal':
            case 'free': // Treat free as universal for now
            default:
                 const camNameUni = `${entityElement.id || 'bmlEntity'}_universalCamera`;
                this._cameraInstance = new UniversalCamera( // Assign to instance property
                    camNameUni,
                    positionVec,
                    this.scene // Use scene from instance
                );
                this._cameraInstance.setTarget(targetVec); // UniversalCamera needs target set explicitly
                break;
            // Add cases for other camera types (FollowCamera, AnaglyphFreeCamera, etc.)
        }

        if (this._cameraInstance) {
            // Set as active camera ONLY if no other camera component has done so yet
            if (!activeCameraSet) {
                this.scene.activeCamera = this._cameraInstance;
                activeCameraSet = true;
                console.log(`BML Camera Component: Set active camera to ${this._cameraInstance.name}`);
            }

            // Attach controls if specified
            if (attachControl && this._cameraInstance.attachControl) {
                 try {
                    this._cameraInstance.attachControl(this.canvas, true); // Use stored canvas reference from instance
                 } catch (e) {
                     console.warn("Error attaching camera control:", e);
                 }
            }
        } else {
            console.error(`BML Camera Component: Failed to create camera of type "${type}" on element:`, entityElement);
        }
    },

        // remove() is called once when the component is detached.
        remove() {
            // 'this' is the component instance object. Access element via 'this.el'
            const entityElement = this.el;
            if (this._cameraInstance) { // Check instance property
                 // Detach controls if attached
                 // Use the last known 'attachControl' state from this component instance's data
                 const lastData = this.data; // Get last known data from this instance
                 const lastAttachControl = parseBoolean(lastData?.attachControl, this.schema?.attachControl?.default ?? true); // Use schema default as fallback

                 if (lastAttachControl && this._cameraInstance.detachControl) {
                     try {
                        // Use the canvas reference stored on the instance during init/update
                        if (this.canvas) {
                            this._cameraInstance.detachControl(this.canvas);
                        } else {
                            console.warn("Camera component remove: Cannot detach control, canvas reference missing.");
                        }
                     } catch (e) {
                         console.warn("Error detaching camera control during remove:", e);
                     }
                 }

                 // If this camera was the active one, reset the flag and potentially set a default
                 // Use the scene reference stored on the instance
                 const scene = this.scene;
                 if (scene && scene.activeCamera === this._cameraInstance) {
                     activeCameraSet = false;
                     // Consider creating/setting a default camera here if needed,
                     // otherwise the scene might become unusable. For now, just log.
                     console.log(`BML Camera Component: Removed active camera ${this._cameraInstance.name}. Scene may need a new active camera.`);
                     // Maybe: scene.createDefaultCameraOrLight(true, true, true); // Create default camera if none exists
                     scene.activeCamera = null; // Set to null, Babylon might create a default on next frame if needed
                 }

                 this._cameraInstance.dispose();
                 this._cameraInstance = null; // Clear instance property
            }
            // Reset the flag when the component is removed, regardless of whether it was active?
            // This might be problematic if multiple cameras exist. Let's only reset if it WAS the active one.
            // const scene = this.scene; // Get scene ref again
            // if (scene && scene.activeCamera === null && !activeCameraSet) {
                 // Check if other camera components exist and make one active? Complex.
                 // For now, rely on Babylon's default behavior or manual setup if the primary camera is removed.
            // }
            // console.log(`Camera component removed from element: ${entityElement.id || 'no-id'}`);
        }
    });
}

// Removed duplicated code from previous incorrect refactoring
