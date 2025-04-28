import { AssetManager } from './AssetManager'; // Assuming AssetManager is in the same directory

/**
 * Custom element `<bml-assets>` to contain asset definitions.
 * It finds the parent `<bml-scene>` and registers asset items with its AssetManager.
 */
class BmlAssets extends HTMLElement {
    constructor() {
        super();
        this.observer = null;
        this.assetManager = null;
        this.registeredItems = new Set(); // Keep track of elements already registered
    }

    connectedCallback() {
        // Hide the element visually
        this.style.display = 'none';

        // Find the parent BmlScene element
        let parent = this.parentElement;
        while (parent && parent.tagName !== 'BML-SCENE') {
            parent = parent.parentElement;
        }

        if (!parent || !parent.assetManager) {
            console.error('<bml-assets> must be a child of a <bml-scene> element.');
            // Consider delaying or retrying if scene isn't fully initialized yet
            return;
        }

        this.assetManager = parent.assetManager;

        // Process initially present children
        this.processChildren(this.children);

        // Observe for added/removed children
        this.observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    this.processChildren(mutation.addedNodes);
                    // Handle removed nodes if necessary (e.g., unregistering)
                    mutation.removedNodes.forEach(node => {
                        if (node.tagName === 'BML-ASSET-ITEM' && this.registeredItems.has(node)) {
                            // Optional: Implement unregister logic in AssetManager if needed
                            console.log('Asset item removed:', node.getAttribute('id'));
                            this.registeredItems.delete(node);
                        }
                    });
                }
            }
        });

        this.observer.observe(this, { childList: true });

        // Signal to the scene that assets might be ready for preloading
        // The scene can decide when to call assetManager.preloadAssets()
        parent.signalAssetsElementReady(this);
    }

    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.registeredItems.clear();
        // Optional: Notify AssetManager if cleanup is needed
        this.assetManager = null;
    }

    /**
     * Processes a list of nodes, adding valid <bml-asset-item> elements
     * to the AssetManager.
     * @param {NodeList} nodes
     */
    processChildren(nodes) {
        if (!this.assetManager) return;

        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BML-ASSET-ITEM') {
                if (!this.registeredItems.has(node)) {
                    this.assetManager.addAssetItem(node);
                    this.registeredItems.add(node);
                }
            }
        });
    }
}

/**
 * Custom element `<bml-asset-item>` representing a single asset to be loaded.
 * Attributes:
 * - id: Unique identifier for the asset.
 * - src: URL of the asset file.
 * - type: (Optional) Type of asset ('mesh', 'texture', etc.). Guessed if omitted.
 */
class BmlAssetItem extends HTMLElement {
    constructor() {
        super();
        // This element is primarily declarative. Logic is handled by BmlAssets and AssetManager.
    }

    connectedCallback() {
        // Hide the element visually
        this.style.display = 'none';
        // Attributes are read by BmlAssets when processing children
    }

    // Optional: Observe attribute changes if dynamic updates are needed,
    // but typically assets are defined statically.
    // static observedAttributes = ['id', 'src', 'type'];
    // attributeChangedCallback(name, oldValue, newValue) { ... }
}

// Define the custom elements
if (!customElements.get('bml-assets')) {
    customElements.define('bml-assets', BmlAssets);
}
if (!customElements.get('bml-asset-item')) {
    customElements.define('bml-asset-item', BmlAssetItem);
}

// Exporting primarily for potential type hinting or direct instantiation if needed elsewhere
export { BmlAssets, BmlAssetItem };
