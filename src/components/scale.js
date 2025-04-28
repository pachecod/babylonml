// src/components/scale.js
import { Vector3 } from '@babylonjs/core';
import * as Parsers from '../core/parsers.js'; // Need the parser

export default function registerScaleComponent(ComponentManager) {
    ComponentManager.registerComponent('scale', {
        // Schema for scale
        schema: {
            type: 'vec3', // Use vec3 parser for {x, y, z}
            default: { x: 1, y: 1, z: 1 } // Default scale is 1
        },

        // update() - Called on initialization and attribute changes.
        update(data, oldData) {
            // 'data' is the parsed scale {x, y, z}
            // console.log('Updating scale to:', data);

            if (this.el.babylonNode) { // Ensure the Babylon.js node exists via the element
                // Update the scaling of the underlying Babylon.js TransformNode/Mesh
                // Ensure Parsers.vec3ToObject exists and correctly converts the object format
                if (Parsers.vec3ToObject) {
                    this.el.babylonNode.scaling.copyFrom(Parsers.vec3ToObject(data));
                } else {
                     // Fallback or direct assignment if vec3ToObject is not defined yet
                     this.el.babylonNode.scaling.x = data.x;
                     this.el.babylonNode.scaling.y = data.y;
                     this.el.babylonNode.scaling.z = data.z;
                     console.warn("Parsers.vec3ToObject not found, assigning scale components directly.");
                }
            } else {
                console.warn("Scale component update called before babylonNode was ready on", this.el);
            }
        },

        // remove() - Usually not needed for simple properties.
        // remove(data) {
        //    console.log('Scale component removed.');
        // }
    });
}
