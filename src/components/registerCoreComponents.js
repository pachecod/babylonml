// src/components/registerCoreComponents.js
import registerPositionComponent from './position.js';
import registerRotationComponent from './rotation.js';
import registerScaleComponent from './scale.js';
import registerGeometryComponent from './geometry.js';
import registerMaterialComponent from './material.js';
import { registerCameraComponent } from './camera.js';
import { registerLightComponent } from './light.js';
import { registerAnimationComponent } from './animation.js';
import registerTextComponent from './text.js'; // Import the text registration function
import { registerSoundComponent } from './sound.js'; // Import the sound registration function
// ... import other core component registration functions

export default function registerCoreComponents(ComponentManager) {
    console.log("Registering core components...");
    registerPositionComponent(ComponentManager);
    registerRotationComponent(ComponentManager);
    registerScaleComponent(ComponentManager);
    registerGeometryComponent(ComponentManager);
    registerMaterialComponent(ComponentManager);
    registerCameraComponent(ComponentManager);
    registerLightComponent(ComponentManager);
    registerAnimationComponent(ComponentManager);
    registerTextComponent(ComponentManager); // Call the text registration function
    registerSoundComponent(ComponentManager); // Call the sound registration function
    // ... call other registration functions here
    console.log("Core components registered.");
    // Log the list of observed attributes after registration
    // console.log("Observed attributes:", ComponentManager.getObservedAttributes());
}
