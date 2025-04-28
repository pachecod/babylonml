// src/core/BmlScene.js

// Import necessary Babylon.js classes (again, explicit imports)
import { Engine, Scene, HemisphericLight, Vector3, FreeCamera, Color3 } from '@babylonjs/core';

// Import the central brain for components
import { ComponentManager } from './ComponentManager.js';

export class BmlScene extends HTMLElement {

    // Private fields (using # prefix for modern JS, or _ convention)
    #engine = null;
    #scene = null;
    #canvas = null;
    #observer = null; // Instance of MutationObserver
    #resizeObserver = null; // To handle canvas resizing
    #isReady = false; // Flag to indicate scene setup completion

    constructor() {
        super(); // Always call super() first in constructor for HTMLElement subclasses
        console.log('<bml-scene>: Constructor');
        // Initial state setup can happen here, but DOM-related setup
        // MUST wait for connectedCallback.
    }

    /**
     * =========================================================================
     * Lifecycle Callback: connectedCallback
     * =========================================================================
     * This method is automatically called by the browser *after* the
     * <bml-scene> element has been added to the main document's DOM.
     * This is the primary place to initialize Babylon.js and related logic.
     */
    connectedCallback() {
        console.log('<bml-scene>: Connected to DOM');

        // --- 1. Canvas Setup ---
        // Try to find an existing canvas child element
        this.#canvas = this.querySelector('canvas');
        if (!this.#canvas) {
            // If no canvas exists, create one dynamically
            console.log('<bml-scene>: No canvas found, creating one.');
            this.#canvas = document.createElement('canvas');
            this.#canvas.style.width = '100%'; // Make it fill the container by default
            this.#canvas.style.height = '100%';
            this.#canvas.style.display = 'block'; // Avoid extra space below canvas
            this.#canvas.setAttribute('touch-action', 'none'); // Recommended for pointer events
            this.appendChild(this.#canvas); // Add the canvas inside <bml-scene>
        } else {
            console.log('<bml-scene>: Found existing canvas.');
        }

        // --- 2. Babylon.js Engine and Scene Initialization ---
        // Create the Babylon.js engine, attaching it to the canvas
        // Pass `true` for antialiasing. Consider options for performance tuning.
        this.#engine = new Engine(this.#canvas, true, {
            preserveDrawingBuffer: true, // Needed for screenshots sometimes
            stencil: true // Often needed for effects or complex rendering
        });
        console.log('<bml-scene>: Babylon Engine created.');

        // Create the Babylon.js scene, which holds all content
        this.#scene = new Scene(this.#engine);
        this.#scene.clearColor = new Color3(0.1, 0.1, 0.15); // Default dark background
        console.log('<bml-scene>: Babylon Scene created.');

        // Expose the scene on the element for children to potentially access
        // Be careful with direct exposure, might break abstraction.
        // An alternative is using events or a registry.
        this.babylonScene = this.#scene;
        this.babylonEngine = this.#engine; // Expose engine too?

        // --- 3. Default Setup (Camera & Light) ---
        // Check if the user has explicitly added a camera or light element.
        // We query *after* initial children might be present but before observer starts reacting strongly.
        const hasCamera = this.querySelector('[camera]'); // Check for any element with a 'camera' attribute
        const hasLight = this.querySelector('[light]');   // Check for any element with a 'light' attribute

        if (!hasCamera) {
            console.log('<bml-scene>: No camera defined, creating default FreeCamera.');
            const camera = new FreeCamera('default_camera', new Vector3(0, 1.6, -5), this.#scene);
            camera.attachControl(this.#canvas, true); // Allow mouse/touch control
            // camera.speed = 0.2; // Adjust movement speed if needed
        }
        if (!hasLight) {
            console.log('<bml-scene>: No light defined, creating default HemisphericLight.');
            new HemisphericLight('default_light', new Vector3(0, 1, 0), this.#scene);
        }

        // --- 4. Start the Render Loop ---
        // This function will be called repeatedly, drawing each frame.
        this.#engine.runRenderLoop(() => {
            this.#scene.render();
        });
        console.log('<bml-scene>: Render loop started.');

        // --- 5. Observe DOM Changes ---
        // MutationObserver watches for changes in the element's children (add/remove)
        // and attribute changes on descendants. This is how we react to HTML changes.
        this.#observer = new MutationObserver(this.#handleMutations.bind(this));
        this.#observer.observe(this, {
            childList: true, // Watch for direct children being added or removed
            attributes: true, // Watch for attribute changes on observed node and descendants
            subtree: true, // IMPORTANT: Watch all descendants, not just direct children
            attributeOldValue: true // Need the old value to pass to component updates
            // characterData: false // Usually not needed unless watching text nodes
        });
        console.log('<bml-scene>: MutationObserver started.');

        // --- 6. Handle Canvas Resizing ---
        // Use ResizeObserver for efficient detection of canvas size changes.
        this.#resizeObserver = new ResizeObserver(() => {
            if (this.#engine) {
                this.#engine.resize();
                // console.log('<bml-scene>: Engine resized.'); // Can be noisy
            }
        });
        this.#resizeObserver.observe(this.#canvas);

        // --- 7. Initial Processing (Optional but Robust) ---
        // Process any children that might have been parsed *before* this script ran
        // (though usually `connectedCallback` runs after initial HTML parsing).
        this.querySelectorAll('bml-entity').forEach(entity => {
            // Potentially trigger initialization logic if needed, though
            // their own `connectedCallback` should handle this naturally.
            // ComponentManager.initializeEntity(entity); // Example if needed
        });

        // --- 8. Mark as Ready and Dispatch Event ---
        this.#isReady = true; // Set ready flag
        this.dispatchEvent(new CustomEvent('bml-scene-ready', { detail: { scene: this.#scene, engine: this.#engine } }));
        console.log("<bml-scene>: Initialization complete. 'bml-scene-ready' event dispatched.");
    }

    /**
     * =========================================================================
     * Lifecycle Callback: disconnectedCallback
     * =========================================================================
     * Called automatically when the <bml-scene> element is removed from the DOM.
     * Crucial for cleaning up resources to prevent memory leaks.
     */
    disconnectedCallback() {
        console.log('<bml-scene>: Disconnected from DOM. Cleaning up...');

        // Stop observing DOM changes
        if (this.#observer) {
            this.#observer.disconnect();
            this.#observer = null;
            console.log('<bml-scene>: MutationObserver disconnected.');
        }

         // Stop observing resize changes
        if (this.#resizeObserver && this.#canvas) {
            this.#resizeObserver.unobserve(this.#canvas);
            this.#resizeObserver = null;
        }

        // Stop the render loop
        if (this.#engine) {
            this.#engine.stopRenderLoop();
            console.log('<bml-scene>: Render loop stopped.');
        }

        // Dispose of the Babylon scene and engine
        // This recursively disposes attached meshes, materials, etc.
        if (this.#scene) {
            this.#scene.dispose();
            this.#scene = null;
            console.log('<bml-scene>: Scene disposed.');
        }
        if (this.#engine) {
            this.#engine.dispose();
            this.#engine = null;
            console.log('<bml-scene>: Engine disposed.');
        }

        // Remove dynamically created canvas if we added it
        if (this.#canvas && !this.querySelector('canvas')) { // Check if it was ours
             // this.#canvas.remove(); // Removing child might trigger observers unnecessarily if not disconnected first. Better to let GC handle it.
        }
        this.#canvas = null;
        this.#isReady = false; // Reset ready flag

         console.log('<bml-scene>: Cleanup complete.');
    }

    /**
     * =========================================================================
     * MutationObserver Callback Handler
     * =========================================================================
     * This function is executed whenever the MutationObserver detects changes
     * to the DOM subtree being watched.
     * @param {MutationRecord[]} mutationsList List of mutation events that occurred.
     */
    #handleMutations(mutationsList) {
        // console.log('<bml-scene>: Handling mutations:', mutationsList); // Very verbose

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Handle elements being added or removed
                mutation.addedNodes.forEach(node => {
                    // When a <bml-entity> is added, its own connectedCallback will handle
                    // its Babylon.js object creation. We might need to trigger component
                    // initialization here IF the entity relies on the scene being ready
                    // *before* its connectedCallback runs fully, but usually it's okay.
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase().startsWith('bml-')) {
                         console.log('<bml-scene>: Observed node added:', node.tagName);
                         // ComponentManager.initializeEntity(node); // If needed
                    }
                });
                mutation.removedNodes.forEach(node => {
                    // When a <bml-entity> is removed, its own disconnectedCallback will
                    // handle cleanup. We might need to explicitly tell the ComponentManager
                    // IF cleanup depends on scene-level state not accessible in the entity.
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase().startsWith('bml-')) {
                         console.log('<bml-scene>: Observed node removed:', node.tagName);
                         // ComponentManager.cleanupEntity(node); // If needed
                    }
                });

            } else if (mutation.type === 'attributes') {
                // Handle attribute changes on elements within the scene
                const targetElement = mutation.target;
                const attributeName = mutation.attributeName;

                // We only care about attributes on our custom elements (or potentially standard ones we support)
                if (targetElement.nodeType === Node.ELEMENT_NODE && targetElement.tagName.toLowerCase().startsWith('bml-')) {
                    // Let the ComponentManager handle the update logic.
                    // It will check if the attribute corresponds to a registered component
                    // and call its 'update' method if necessary.
                    // console.log(`<bml-scene>: Observed attribute change on ${targetElement.tagName}: ${attributeName} changed`);
                    ComponentManager.handleAttributeUpdate(
                        targetElement,
                        attributeName,
                        targetElement.getAttribute(attributeName), // Current value
                        mutation.oldValue                     // Previous value
                    );
                }
            }
        }
    }

    // --- Helper Methods (Optional) ---
    getScene() {
        return this.#scene;
    }

    getEngine() {
        return this.#engine;
    }

    /** Public getter for the ready state */
    get isReady() {
        return this.#isReady;
    }

    /** Public getter for the canvas element */
    get babylonCanvas() {
        return this.#canvas;
    }
}
