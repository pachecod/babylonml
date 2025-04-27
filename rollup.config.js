import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js', // Your main entry point
  preserveEntrySignatures: false, // Try preventing facade chunks
  output: {
    file: 'dist/babylonml.js', // The output bundle
    format: 'iife', // Immediately Invoked Function Expression (good for <script> tags)
    name: 'BML', // The global variable name to attach to window
    sourcemap: true, // Generate source maps for easier debugging
    inlineDynamicImports: true, // Bundle dynamic imports
    globals: {
      '@babylonjs/core': 'BABYLON' // Assumes Babylon.js is available globally as BABYLON if not bundled
    }
  },
  plugins: [
    resolve(), // Helps Rollup find external modules
    commonjs() // Converts CommonJS modules to ES6
  ],
  external: [
    // List external dependencies if you don't want to bundle them
    // For now, we'll try bundling Babylon.js. If the bundle gets too large,
    // we might list '@babylonjs/core' here and load it separately via CDN.
    // '@babylonjs/core'
  ]
};
