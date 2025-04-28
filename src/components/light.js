import {
    Vector3,
    PointLight,
    DirectionalLight,
    SpotLight,
    HemisphericLight,
    Color3 // Import Color3
} from '@babylonjs/core';

// Default values matching Babylon.js defaults where applicable
const DEFAULT_LIGHT_VALUES = {
    type: 'point', // Default type
    diffuse: { r: 1, g: 1, b: 1 }, // Default diffuse color (white)
    specular: { r: 1, g: 1, b: 1 }, // Default specular color (white)
    intensity: 1.0,
    // Directional light specific
    direction: { x: 0, y: -1, z: 0 }, // Default direction
    // Point light specific (position is handled by the entity's position component)
    // Spot light specific
    angle: Math.PI / 2, // Default angle (radians)
    exponent: 2, // Default exponent
    // Hemispheric light specific
    groundColor: { r: 0, g: 0, b: 0 }, // Default ground color (black)
};

// Define the component methods separately to handle 'this' context correctly
const lightComponentDefinition = {
    schema: {
        type: { type: 'string', default: DEFAULT_LIGHT_VALUES.type },
        diffuse: { type: 'color', default: DEFAULT_LIGHT_VALUES.diffuse },
        specular: { type: 'color', default: DEFAULT_LIGHT_VALUES.specular },
        intensity: { type: 'number', default: DEFAULT_LIGHT_VALUES.intensity },
        direction: { type: 'vec3', default: DEFAULT_LIGHT_VALUES.direction },
        angle: { type: 'number', default: DEFAULT_LIGHT_VALUES.angle }, // Radians
        exponent: { type: 'number', default: DEFAULT_LIGHT_VALUES.exponent },
        groundColor: { type: 'color', default: DEFAULT_LIGHT_VALUES.groundColor },
        // Note: Position for Point/Spot lights comes from the entity's position component
    },

    // Dependencies injected by ComponentManager:
    // this.el (BmlEntity) -> now just 'this' in component methods
    // this.data (parsed schema data) -> Now passed as 'data' argument

    init: function (data) { // Add 'data' argument
        this.light = null;
        // Guard clause: Ensure the entity's node and scene are ready.
        if (!this.el.babylonNode || !this.sceneElement?.babylonScene) {
            console.warn("Light component init called before babylonNode or scene was ready on", this.el);
            return;
        }
        lightComponentDefinition.createLight.call(this, data); // Pass 'data'
    },

    update: function (data, oldData) { // Add 'data' argument
        // Guard clauses: Ensure the entity's node and scene are ready.
        if (!this.el.babylonNode || !this.sceneElement?.babylonScene) {
            console.warn("Light component update called before babylonNode or scene was ready on", this.el);
            return;
        }
         if (!this.light && data.type === oldData?.type) { // Use 'data' argument
             // If light wasn't created in init (e.g., due to timing) and type hasn't changed, try creating it now.
             console.warn("Light component update: Light not initialized, attempting creation on", this);
             lightComponentDefinition.createLight.call(this, data); // Pass 'data'
             if (!this.light) return; // Still failed, exit.
         } else if (data.type !== oldData?.type && oldData !== undefined) { // Use 'data' argument, Check oldData exists
            // If type changes, we need to recreate the light
            console.log(`Light component: Type changed from ${oldData?.type} to ${data.type} on`, this); // Use 'data' argument
            lightComponentDefinition.removeLight.call(this); // Use .call(this)
            lightComponentDefinition.createLight.call(this, data); // Pass 'data'
        }

        // Ensure light exists before updating properties
        if (this.light) {
            lightComponentDefinition.updateLightProperties.call(this, data); // Pass 'data'
        } else {
             // Don't warn if type just changed, as createLight might have failed legitimately
             if (data.type === oldData?.type) { // Use 'data' argument
                console.warn("Light component update: Light object still missing after attempted creation on", this);
             }
        }
    },

    remove: function () {
        lightComponentDefinition.removeLight.call(this); // Use .call(this)
    },

    // --- Internal Methods ---

    createLight: function (data) { // Add 'data' argument
        // Ensure scene is available via the entity ('this')
        if (!this.sceneElement?.babylonScene) {
             console.error("Light component createLight: Cannot create light, scene not available on", this);
             return;
        }
        const scene = this.sceneElement.babylonScene;
        const lightName = this.id ? `${this.id}_light` : 'bmlLight'; // Use this.id
        // Use entity's position component data if available, otherwise default to Zero
        // Note: getComputedAttribute might not be the right way if position component isn't fully initialized yet.
        // Relying on parenting is safer. Default position is Zero for constructor.
        const initialPosition = Vector3.Zero(); // Lights are often positioned by parenting

        switch (data.type.toLowerCase()) { // Use 'data' argument
            case 'directional':
                this.light = new DirectionalLight(lightName, initialPosition, scene); // Position is ignored but required
                break;
            case 'spot':
                this.light = new SpotLight(lightName, initialPosition, Vector3.Zero(), data.angle, data.exponent, scene); // Use 'data' argument, Direction set in update
                break;
            case 'hemispheric':
                this.light = new HemisphericLight(lightName, initialPosition, scene); // Position is ignored but required
                break;
            case 'point':
            default: // Default to point light
                this.light = new PointLight(lightName, initialPosition, scene);
                break;
        }

        if (this.light) {
             console.log(`Light component: Created ${data.type} light "${lightName}" on`, this); // Use 'data' argument
            lightComponentDefinition.updateLightProperties.call(this, data); // Pass 'data' for initial properties
            // Ensure the light's position is bound to the entity's transform node
            // Check if babylonNode exists before parenting
            if (this.light.position && this.el.babylonNode) {
                this.light.parent = this.el.babylonNode; // Attach light to entity's transform node
                console.log(`Light component: Parented light "${lightName}" to entity node "${this.el.babylonNode.name}"`);
            } else if (this.light.position) {
                console.warn(`Light component: Could not parent light "${lightName}" as entity node is not ready yet on`, this.el);
                // Position will be updated later if possible, or remain at origin if entity has no position component
            }
        } else {
            console.error(`Light component: Failed to create light of type "${data.type}" on`, this); // Use 'data' argument
        }
    },

    updateLightProperties: function (data) { // Add 'data' argument
        // Guard clause moved to update()
        // if (!this.light) return;

        // const data = this.data; // Use argument 'data' instead

        // Common properties (check if property exists on the specific light type)
        if (data.diffuse && typeof data.diffuse === 'object' && data.diffuse.r !== undefined && this.light.diffuse) {
            this.light.diffuse.copyFrom(new Color3(data.diffuse.r, data.diffuse.g, data.diffuse.b));
        }
        if (data.specular && typeof data.specular === 'object' && data.specular.r !== undefined && this.light.specular) {
            this.light.specular.copyFrom(new Color3(data.specular.r, data.specular.g, data.specular.b));
        }
        if (data.intensity !== undefined && this.light.intensity !== undefined) { // Check existence before assigning
            this.light.intensity = data.intensity;
        }

        // Type-specific properties
        if (this.light instanceof DirectionalLight || this.light instanceof SpotLight || this.light instanceof HemisphericLight) {
            // Check existence of data.direction and its properties before creating Vector3
            if (data.direction && typeof data.direction === 'object' && data.direction.x !== undefined && this.light.direction) {
                this.light.direction = new Vector3(data.direction.x, data.direction.y, data.direction.z);
            }
        }
        if (this.light instanceof SpotLight) {
            if (data.angle !== undefined && this.light.angle !== undefined) { // Check existence
                this.light.angle = data.angle;
            }
            if (data.exponent !== undefined && this.light.exponent !== undefined) { // Check existence
                this.light.exponent = data.exponent;
            }
        }
        if (this.light instanceof HemisphericLight) {
            if (data.groundColor && typeof data.groundColor === 'object' && data.groundColor.r !== undefined && this.light.groundColor) { // Check existence and type
                this.light.groundColor.copyFrom(new Color3(data.groundColor.r, data.groundColor.g, data.groundColor.b));
            }
        }

        // Position for Point/Spot lights is handled by attaching to the entity's transform node (done in createLight).
        // If the light isn't parented (e.g., entity's babylonNode wasn't ready during createLight),
        // we might try to update position directly, but relying on the position component and parenting is more robust.
        // This check might be redundant if parenting always works eventually.
        if ((this.light instanceof PointLight || this.light instanceof SpotLight) && !this.light.parent) {
             // Check if the position component data exists directly on the entity instance
             const positionData = this.getComponentData('position'); // Use BmlEntity's method
             // Check existence of positionData and its properties before creating Vector3
             if (positionData && typeof positionData === 'object' && positionData.x !== undefined) {
                console.warn(`Light component: Updating position directly for unparented light "${this.light.name}" on`, this);
                this.light.position.copyFrom(new Vector3(positionData.x, positionData.y, positionData.z));
             } else {
                // console.warn(`Light component: Cannot update position directly for unparented light "${this.light.name}", position component data not found or invalid on`, this);
             }
        }
    },

    removeLight: function () {
        if (this.light) {
            this.light.dispose();
            this.light = null;
        }
    },
    // --- End Internal Methods ---
};

export function registerLightComponent(componentManager) {
    componentManager.registerComponent('light', lightComponentDefinition);
}
