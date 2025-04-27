// src/components/registerCoreComponents.js
import registerPositionComponent from './position.js';
import registerRotationComponent from './rotation.js';
import registerScaleComponent from './scale.js';
import registerGeometryComponent from './geometry.js';
import registerMaterialComponent from './material.js';
// ... import other core component registration functions (e.g., light, camera) when created

export default function registerCoreComponents(ComponentManager) {
    console.log("Registering core components...");
    registerPositionComponent(ComponentManager);
    registerRotationComponent(ComponentManager);
    registerScaleComponent(ComponentManager);
    registerGeometryComponent(ComponentManager);
    registerMaterialComponent(ComponentManager);
    // ... call other registration functions here
    console.log("Core components registered.");
    // Log the list of observed attributes after registration
    // console.log("Observed attributes:", ComponentManager.getObservedAttributes());
}
