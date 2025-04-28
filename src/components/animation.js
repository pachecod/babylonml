import {
    Animation,
    Vector3,
    Color3,
    EasingFunction,
    CircleEase,
    BackEase,
    BounceEase,
    CubicEase,
    ElasticEase,
    ExponentialEase,
    PowerEase,
    QuadraticEase,
    QuarticEase,
    QuinticEase,
    SineEase
} from '@babylonjs/core';
import { parseVec3, parseColor } from '../core/parsers'; // Use existing parseColor (Removed parseMap)

// Easing function mapping
const easingFunctions = {
    'linear': null, // Special case handled by Babylon.js default
    'ease': new CubicEase(), // Default ease
    'ease-in': new CubicEase(), // Approximations, map CSS names
    'ease-out': new CubicEase(),
    'ease-in-out': new CubicEase(),
    'easeInQuad': new QuadraticEase(), 'easeOutQuad': new QuadraticEase(), 'easeInOutQuad': new QuadraticEase(),
    'easeInCubic': new CubicEase(), 'easeOutCubic': new CubicEase(), 'easeInOutCubic': new CubicEase(),
    'easeInQuart': new QuarticEase(), 'easeOutQuart': new QuarticEase(), 'easeInOutQuart': new QuarticEase(),
    'easeInQuint': new QuinticEase(), 'easeOutQuint': new QuinticEase(), 'easeInOutQuint': new QuinticEase(),
    'easeInSine': new SineEase(), 'easeOutSine': new SineEase(), 'easeInOutSine': new SineEase(),
    'easeInExpo': new ExponentialEase(), 'easeOutExpo': new ExponentialEase(), 'easeInOutExpo': new ExponentialEase(),
    'easeInCirc': new CircleEase(), 'easeOutCirc': new CircleEase(), 'easeInOutCirc': new CircleEase(),
    'easeInBack': new BackEase(), 'easeOutBack': new BackEase(), 'easeInOutBack': new BackEase(),
    'easeInElastic': new ElasticEase(), 'easeOutElastic': new ElasticEase(), 'easeInOutElastic': new ElasticEase(),
    'easeInBounce': new BounceEase(), 'easeOutBounce': new BounceEase(), 'easeInOutBounce': new BounceEase(),
};

// Helper to get nested property
function getProperty(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current) return undefined;
        current = current[parts[i]];
    }
    return current ? { obj: current, prop: parts[parts.length - 1] } : undefined;
}

// Helper to parse animation values based on type
function parseAnimationValue(valueString, dataType) {
    if (valueString === null || valueString === undefined) return undefined;
    switch (dataType) {
        case Animation.ANIMATIONTYPE_FLOAT:
            return parseFloat(valueString);
        case Animation.ANIMATIONTYPE_VECTOR3:
            return parseVec3(valueString);
        case Animation.ANIMATIONTYPE_COLOR3:
            // Use existing parseColor which returns {r, g, b} object
            // The animation system expects a Color3 instance, so convert it
            const colorObj = parseColor(valueString);
            return colorObj ? new Color3(colorObj.r, colorObj.g, colorObj.b) : undefined;
        // Add cases for QUATERNION, MATRIX, etc. if needed later
        default:
            console.warn(`Unsupported animation data type: ${dataType}`);
            return undefined;
    }
}


class AnimationComponent {
    // Component state
    targetObject = null;
    targetProperty = null;
    animation = null;
    animatable = null;
    dataType = null;

    // Add a minimal schema definition required by ComponentManager
    static schema = {
        type: 'string', // Expects a string attribute like "property: position; to: 1 2 3; ..."
    };

    constructor(entity, componentManager, data) {
        this.entity = entity; // Keep track of the entity
        this.el = entity; // Maintain 'el' alias if used internally
        this.componentManager = componentManager;
        this.data = data; // Parsed data object provided by ComponentManager
    }

    init() {
        // console.log('Animation init:', this.data);
        if (!this.data.property || !this.data.to) {
            console.error('Animation component requires "property" and "to" attributes.');
            return;
        }

        // --- Resolve Target Object and Property ---
        const propertyPath = this.data.property;
        let targetInfo;

        // Check entity's direct transform properties first
        if (['position', 'rotation', 'scaling'].includes(propertyPath.split('.')[0])) {
            targetInfo = getProperty(this.el.babylonNode, propertyPath); // Use babylonNode
        } else {
            // Check component properties (e.g., material.diffuseColor, light.intensity)
            const componentName = propertyPath.split('.')[0];
            const component = this.el.components[componentName];
            if (component) {
                // Heuristic: Assume component stores its main Babylon object in a property like 'materialObject', 'lightObject', etc.
                const componentObjectKey = Object.keys(component).find(key => key.endsWith('Object')); // e.g., materialObject, lightObject
                const componentObject = componentObjectKey ? component[componentObjectKey] : component; // Fallback to component itself? Risky.

                if (componentObject) {
                    const subPath = propertyPath.substring(componentName.length + 1);
                    targetInfo = getProperty(componentObject, subPath);
                }
            }
        }

        if (!targetInfo || targetInfo.obj === undefined || targetInfo.prop === undefined) {
            console.error(`Animation target property "${propertyPath}" not found on entity or its components.`);
            return;
        }

        this.targetObject = targetInfo.obj;
        this.targetProperty = targetInfo.prop;
        const currentValue = this.targetObject[this.targetProperty];

        // --- Determine Data Type ---
        if (typeof currentValue === 'number') {
            this.dataType = Animation.ANIMATIONTYPE_FLOAT;
        } else if (currentValue instanceof Vector3) {
            this.dataType = Animation.ANIMATIONTYPE_VECTOR3;
        } else if (currentValue instanceof Color3) {
            this.dataType = Animation.ANIMATIONTYPE_COLOR3;
        } else {
            console.error(`Animation property "${propertyPath}" has an unsupported type: ${typeof currentValue}`);
            return;
        }

        // --- Parse Values ---
        const toValue = parseAnimationValue(this.data.to, this.dataType);
        let fromValue = parseAnimationValue(this.data.from, this.dataType);

        if (toValue === undefined) {
            console.error(`Could not parse "to" value: ${this.data.to}`);
            return;
        }
        if (fromValue === undefined) {
            // Use current value if 'from' is not specified or invalid
            fromValue = currentValue.clone ? currentValue.clone() : currentValue;
        }

        // --- Animation Setup ---
        const duration = this.data.dur !== undefined ? parseFloat(this.data.dur) : 1000; // Default 1 second
        const loop = this.data.loop !== undefined ? (this.data.loop === 'true' || this.data.loop === true) : false;
        const autoplay = this.data.autoplay !== undefined ? (this.data.autoplay === 'true' || this.data.autoplay === true) : true;
        const easing = this.data.easing || 'linear';

        const fps = this.el.scene.getEngine().getFps(); // Use engine's FPS
        const totalFrames = Math.round((duration / 1000) * fps);

        this.animation = new Animation(
            `${this.el.id}_${propertyPath}_anim`, // Animation name
            this.targetProperty, // Property to animate
            fps, // Frames per second
            this.dataType, // Data type
            loop ? Animation.ANIMATIONLOOPMODE_CYCLE : Animation.ANIMATIONLOOPMODE_CONSTANT // Loop mode
        );

        // --- Keyframes ---
        const keys = [];
        keys.push({ frame: 0, value: fromValue });
        keys.push({ frame: totalFrames, value: toValue });
        this.animation.setKeys(keys);

        // --- Easing Function ---
        const easingFunctionInstance = easingFunctions[easing];
        if (easingFunctionInstance) {
            // Set easing mode - default is EasingFunction.EASINGMODE_EASEINOUT
            // You might want to parse this from the 'easing' string if needed, e.g., 'easeInQuad' -> EASINGMODE_EASEIN
            let easingMode = EasingFunction.EASINGMODE_EASEINOUT; // Default
            if (easing.toLowerCase().includes('easein') && !easing.toLowerCase().includes('easeinout')) {
                easingMode = EasingFunction.EASINGMODE_EASEIN;
            } else if (easing.toLowerCase().includes('easeout') && !easing.toLowerCase().includes('easeinout')) {
                easingMode = EasingFunction.EASINGMODE_EASEOUT;
            }
            easingFunctionInstance.setEasingMode(easingMode);
            this.animation.setEasingFunction(easingFunctionInstance);
        } else if (easing !== 'linear') {
            console.warn(`Unknown easing function: ${easing}. Using linear.`);
        }

        // --- Attach and Play ---
        if (!this.targetObject.animations) {
            this.targetObject.animations = [];
        }
        // Ensure animation isn't added multiple times if update is called rapidly
        this.removeAnimationFromTarget();
        this.targetObject.animations.push(this.animation);

        if (autoplay) {
            // Ensure scene is ready before starting animation
            this.el.scene.executeWhenReady(() => {
                if (this.animation && this.targetObject) { // Check if component hasn't been removed
                    try {
                        this.animatable = this.el.scene.beginAnimation(
                            this.targetObject, // Target
                            0, // Start frame
                            totalFrames, // End frame
                            loop, // Loop?
                            1.0, // Speed ratio
                            () => { /* onAnimationEnd */ }
                        );
                    } catch (e) {
                        console.error("Error starting animation:", e);
                    }
                }
            });
        }
    }

    update(oldData) {
        // Simple update: remove old animation and re-initialize
        // More sophisticated updates could try to modify the existing animation/animatable
        this.remove();
        this.init();
    }

    remove() {
        // console.log('Animation remove');
        if (this.animatable) {
            this.animatable.stop();
            this.animatable = null;
        }
        this.removeAnimationFromTarget();
        this.animation = null;
        this.targetObject = null;
        this.targetProperty = null;
    }

    removeAnimationFromTarget() {
        if (this.targetObject && this.targetObject.animations && this.animation) {
            const index = this.targetObject.animations.indexOf(this.animation);
            if (index !== -1) {
                this.targetObject.animations.splice(index, 1);
            }
        }
    }
}

// Registration function
export function registerAnimationComponent(componentManager) {
    componentManager.registerComponent('animation', AnimationComponent);
}
