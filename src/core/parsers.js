// src/core/parsers.js
import { Vector3, Color3 } from '@babylonjs/core'; // Keep Color3 import for potential future use or type hints

// Basic color name lookup
const COLOR_NAME_MAP = {
    white: { r: 1, g: 1, b: 1 }, black: { r: 0, g: 0, b: 0 },
    red: { r: 1, g: 0, b: 0 }, green: { r: 0, g: 1, b: 0 }, blue: { r: 0, g: 0, b: 1 },
    yellow: { r: 1, g: 1, b: 0 }, cyan: { r: 0, g: 1, b: 1 }, magenta: { r: 1, g: 0, b: 1 },
    gray: { r: 0.5, g: 0.5, b: 0.5 }, silver: { r: 0.75, g: 0.75, b: 0.75 },
    orange: { r: 1, g: 0.647, b: 0 }, purple: { r: 0.5, g: 0, b: 0.5 }, brown: { r: 0.647, g: 0.165, b: 0.165 },
    lime: { r: 0, g: 1, b: 0 }, // Added lime
    dodgerblue: { r: 0.118, g: 0.565, b: 1 }, // Added dodgerblue
    limegreen: { r: 0.196, g: 0.804, b: 0.196 } // Added limegreen
    // Add more as needed
};


/**
 * Parses a string like "x y z" into a {x, y, z} object.
 * @param {string} str - The input string.
 * @param {object} [defaultValue={x:0, y:0, z:0}] - Default value if parsing fails.
 * @returns {object} Parsed vector object.
 */
export function parseVec3(str, defaultValue = { x: 0, y: 0, z: 0 }) {
    if (typeof str !== 'string') return defaultValue;
    const parts = str.trim().split(/\s+/).map(Number);
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
        return { x: parts[0], y: parts[1], z: parts[2] };
    }
    // Handle single number shorthand (e.g., "5" -> {x: 5, y: 5, z: 5})
    if (parts.length === 1 && !isNaN(parts[0])) {
        return { x: parts[0], y: parts[0], z: parts[0] };
    }
    return defaultValue;
}

/**
 * Converts a {x, y, z} object to a Babylon.js Vector3.
 * @param {object} obj - The input object {x, y, z}.
 * @returns {Vector3} Babylon.js Vector3 instance.
 */
export function vec3ToObject(obj) {
    if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
        return new Vector3(obj.x, obj.y, obj.z);
    }
    // Return a default Vector3 if input is invalid
    console.warn("Invalid input for vec3ToObject, returning default Vector3(0, 0, 0). Input:", obj);
    return new Vector3(0, 0, 0);
}


/**
 * Parses a color string (e.g., "#RRGGBB", "#RGB", "colorname") into a {r, g, b} object (0-1 range).
 * @param {string} str - The input color string.
 * @param {object} [defaultValue={r:1, g:1, b:1}] - Default value (white).
 * @returns {object} Parsed color object {r, g, b}.
 */
export function parseColor(str, defaultValue = { r: 1, g: 1, b: 1 }) {
    if (typeof str !== 'string') return defaultValue;
    str = str.trim().toLowerCase();

    // Handle color names
    if (COLOR_NAME_MAP[str]) {
        return { ...COLOR_NAME_MAP[str] }; // Return a copy
    }

    // Handle hex codes (#RRGGBB or #RGB)
    if (str.startsWith('#')) {
        let hex = str.substring(1);
        let r = 0, g = 0, b = 0;

        if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (hex.length === 3) {
            r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
            g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
            b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
        } else {
            console.warn(`Could not parse hex color string "${str}". Invalid length.`);
            return defaultValue;
        }

        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            return { r: r / 255, g: g / 255, b: b / 255 };
        }
    }

     // Handle "r g b" format (numbers between 0-1) - Added based on logs
     const parts = str.split(/\s+/).map(Number);
     if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0 && n <= 1)) {
         return { r: parts[0], g: parts[1], b: parts[2] };
     }


    // TODO: Handle rgb(r,g,b) format if needed

    console.warn(`Could not parse color string "${str}". Using default.`);
    return defaultValue;
}

/**
 * Parses a string into a number.
 * @param {string} str - The input string.
 * @param {number} [defaultValue=0] - Default value.
 * @returns {number} Parsed number.
 */
export function parseNumber(str, defaultValue = 0) {
    if (str === null || str === undefined) return defaultValue;
    const num = parseFloat(str);
    return isNaN(num) ? defaultValue : num;
}

/**
 * Parses a string value. Returns default if input is not a string or is empty.
 * @param {string} str - Input string.
 * @param {string} [defaultValue=''] - Default value.
 * @returns {string} Parsed string.
 */
export function parseString(str, defaultValue = '') {
    return (typeof str === 'string' && str.length > 0) ? str : defaultValue;
}

/**
 * Parses a string into a float, returning null if parsing fails or input is invalid.
 * @param {*} value - The input value to parse.
 * @param {number|null} [defaultValue=null] - The default value to return on failure.
 * @returns {number|null} The parsed float or the default value.
 */
export function parseFloatOrNull(value, defaultValue = null) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}

/**
 * Parses a string into a boolean. Handles "true", "false", empty string (true), presence of attribute (true).
 * @param {string|null} str - Input string.
 * @param {boolean} [defaultValue=false] - Default value.
 * @returns {boolean} Parsed boolean.
 */
export function parseBoolean(value, defaultValue = false) {
    // Handle cases where the value might already be a boolean
    if (typeof value === 'boolean') {
        return value;
    }
    // Handle string inputs
    if (value === null || value === undefined) return defaultValue; // Attribute not present or value is null/undefined
    if (typeof value === 'string') {
        const strLower = value.toLowerCase();
        if (value === '' || strLower === 'true') return true; // Empty string attribute usually means true
        if (strLower === 'false') return false;
    }
    // Fallback for other types or unparseable strings
    return defaultValue;
}

/**
 * Parses a CSS-like string "prop1: value1; prop2: value2;" into an object.
 * Handles potential URLs within values.
 * @param {string} str - The input string.
 * @param {object} [defaultValue={}] - Default value.
 * @returns {object} Parsed object.
 */
export function parseObjectString(str, defaultValue = {}) {
    if (typeof str !== 'string' || !str.trim()) {
        return defaultValue;
    }
    const result = {};
    // Regex to split by semicolon, but not those inside parentheses (like in url())
    const declarations = str.split(/;\s*(?![^()]*\))/g);

    declarations.forEach(decl => {
        if (!decl.trim()) return;
        const colonIndex = decl.indexOf(':');
        if (colonIndex > 0) {
            const key = decl.substring(0, colonIndex).trim();
            const value = decl.substring(colonIndex + 1).trim();
            if (key) {
                // Basic type inference (optional, could make parsing more complex)
                // if (!isNaN(value)) {
                //     result[key] = parseFloat(value);
                // } else if (value.toLowerCase() === 'true') {
                //     result[key] = true;
                // } else if (value.toLowerCase() === 'false') {
                //     result[key] = false;
                // } else {
                //     result[key] = value;
                // }
                 result[key] = value; // Keep as string by default, let component schema handle specific parsing
            }
        }
    });
    // If the original string didn't parse into any key-value pairs but wasn't empty,
    // maybe treat it as a single default property? Depends on convention.
    // Example: material="color: red" vs material="red"
    // if (Object.keys(result).length === 0 && str.trim()) {
    //    // Handle single value case if needed, e.g., assign to a default key like 'value' or 'type'
    // }
    return Object.keys(result).length > 0 ? result : defaultValue;
}


/**
 * Parses a component string based on a schema object (like A-Frame).
 * Handles "prop: val; prop2: val2" syntax, using schema types for parsing.
 * @param {string} value - The raw attribute string.
 * @param {object} schema - The component's schema definition.
 * @returns {object} Parsed data object.
 */
export function parseComponentString(value, schema) {
    const parsedData = {};
    const props = parseObjectString(value, {}); // First parse into key-value strings

    // Apply defaults first, parsing them according to their schema type
    for (const key in schema) {
        const propSchema = schema[key];
        if (propSchema.default !== undefined) {
            // Parse the default value based on its type
            switch (propSchema.type) {
                case 'vec3':
                    // Ensure default is parsed, even if it's already an object (idempotent)
                    parsedData[key] = parseVec3(propSchema.default, propSchema.default);
                    break;
                case 'color':
                    parsedData[key] = parseColor(propSchema.default, propSchema.default);
                    break;
                case 'number':
                    parsedData[key] = parseNumber(propSchema.default, propSchema.default);
                    break;
                case 'string':
                    parsedData[key] = parseString(propSchema.default, propSchema.default);
                    break;
                case 'boolean':
                    parsedData[key] = parseBoolean(propSchema.default, propSchema.default);
                    break;
                // Add other types as needed
                default:
                    // For unknown types or types without specific parsers (like 'map'),
                    // assign the default value directly. 'map' type defaults are usually {}
                    parsedData[key] = propSchema.default;
            }
        }
    }

    // Override with parsed values
    for (const key in props) {
        if (schema[key]) {
            const propSchema = schema[key];
            const rawValue = props[key];
            // Use specific parsers based on schema type
            switch (propSchema.type) {
                case 'vec3':
                    parsedData[key] = parseVec3(rawValue, propSchema.default);
                    break;
                case 'color':
                    parsedData[key] = parseColor(rawValue, propSchema.default);
                    break;
                case 'number':
                    parsedData[key] = parseNumber(rawValue, propSchema.default);
                    break;
                case 'string':
                    parsedData[key] = parseString(rawValue, propSchema.default);
                    break;
                case 'boolean':
                    parsedData[key] = parseBoolean(rawValue, propSchema.default);
                    break;
                // Add other types: 'asset', 'selector', 'array', 'map' (nested?)
                default:
                    // If no specific type, treat as string or use a generic parser
                    parsedData[key] = rawValue;
                    console.warn(`parseComponentString: Unknown schema type "${propSchema.type}" for key "${key}". Treating as string.`);
            }
        } else {
            // Property exists in string but not in schema - store it anyway? Or ignore?
            // parsedData[key] = props[key]; // Option: Store unknown properties
             console.warn(`parseComponentString: Property "${key}" found in attribute string but not defined in schema.`);
        }
    }
    return parsedData;
}


/**
 * Performs a deep comparison between two values.
 * Handles objects, arrays, primitives.
 * @param {*} a - First value.
 * @param {*} b - Second value.
 * @returns {boolean} True if values are deeply equal.
 */
export function deepEqual(a, b) {
    if (a === b) return true;

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }

    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return false;
    }

    // Special handling for Babylon objects if needed (e.g., Vector3, Color3)
    // This assumes they have an .equals() method
    if (typeof a.equals === 'function' && typeof b.equals === 'function' && a.constructor === b.constructor) {
         return a.equals(b);
    }
     // Simple object comparison for parsed data like {x,y,z} or {r,g,b}
     if (a.constructor === Object && b.constructor === Object) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
     }


    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }

    // Add more complex object/array comparison if necessary

    return false;
}
