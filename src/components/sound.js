import { Sound } from '@babylonjs/core'; 
import { parseObjectString, parseBoolean, parseFloatOrNull } from '../core/parsers';

const defaultSoundOptions = {
    autoplay: false,
    loop: false,
    volume: 1.0,
    spatial: false,
    distanceModel: 'linear',
    rolloffFactor: 1.0,
    refDistance: 1.0,
    maxDistance: 100.0,
};

class SoundComponent {
    constructor(entity, componentManager, data) {
        this.entity = entity;
        this.componentManager = componentManager;
        this.scene = this.entity.bmlScene.scene;
        this.sound = null;
        this.data = data; // Raw attribute string initially
        this.parsedData = {};
    }

    init() {
        if (!this.data || typeof this.data !== 'string') {
            console.error('Sound component requires a string attribute value.');
            return;
        }

        this.parsedData = this._parseData(this.data);

        if (!this.parsedData.src) {
            console.error('Sound component requires a "src" attribute.');
            return;
        }

        this._createSound();
    }

    update(newData) {
        if (!newData || typeof newData !== 'string') return;

        const newParsedData = this._parseData(newData);
        const oldParsedData = this.parsedData;
        this.data = newData;
        this.parsedData = newParsedData;

        // Check if recreation is needed (src or spatial change)
        if (newParsedData.src !== oldParsedData.src || newParsedData.spatial !== oldParsedData.spatial) {
            this._disposeSound();
            this._createSound();
        } else if (this.sound) {
            // Update existing sound properties
            if (newParsedData.volume !== oldParsedData.volume) {
                this.sound.setVolume(newParsedData.volume);
            }
            if (newParsedData.loop !== oldParsedData.loop) {
                this.sound.loop = newParsedData.loop; // Direct property access for loop
            }
            // Update spatial properties if applicable
            if (newParsedData.spatial) {
                if (newParsedData.distanceModel !== oldParsedData.distanceModel) {
                    this.sound.distanceModel = newParsedData.distanceModel;
                }
                if (newParsedData.rolloffFactor !== oldParsedData.rolloffFactor) {
                    this.sound.rolloffFactor = newParsedData.rolloffFactor;
                }
                if (newParsedData.refDistance !== oldParsedData.refDistance) {
                    this.sound.refDistance = newParsedData.refDistance;
                }
                if (newParsedData.maxDistance !== oldParsedData.maxDistance) {
                    this.sound.maxDistance = newParsedData.maxDistance;
                }
            }
        }
    }

    remove() {
        this._disposeSound();
        this.entity = null;
        this.componentManager = null;
        this.scene = null;
    }

    _parseData(dataString) {
        const rawParsed = parseObjectString(dataString); // Use parseObjectString
        return {
            src: rawParsed.src || null,
            autoplay: parseBoolean(rawParsed.autoplay, defaultSoundOptions.autoplay),
            loop: parseBoolean(rawParsed.loop, defaultSoundOptions.loop),
            volume: parseFloatOrNull(rawParsed.volume, defaultSoundOptions.volume),
            spatial: parseBoolean(rawParsed.spatial, defaultSoundOptions.spatial),
            distanceModel: rawParsed.distanceModel || defaultSoundOptions.distanceModel,
            rolloffFactor: parseFloatOrNull(rawParsed.rolloffFactor, defaultSoundOptions.rolloffFactor),
            refDistance: parseFloatOrNull(rawParsed.refDistance, defaultSoundOptions.refDistance),
            maxDistance: parseFloatOrNull(rawParsed.maxDistance, defaultSoundOptions.maxDistance),
        };
    }

    _createSound() {
        if (!this.parsedData.src) return;

        const options = {
            autoplay: this.parsedData.autoplay,
            loop: this.parsedData.loop,
            volume: this.parsedData.volume,
            spatialSound: this.parsedData.spatial,
            distanceModel: this.parsedData.distanceModel,
            rolloffFactor: this.parsedData.rolloffFactor,
            refDistance: this.parsedData.refDistance,
            maxDistance: this.parsedData.maxDistance,
        };

        // Use a unique name for the sound to avoid conflicts if multiple entities use the same src
        const soundName = `sound_${this.entity.id}_${Date.now()}`;

        this.sound = new Sound(
            soundName,
            this.parsedData.src,
            this.scene,
            () => {
                // Sound ready callback (optional)
                // console.log(`Sound loaded: ${this.parsedData.src}`);
            },
            options
        );

        if (this.parsedData.spatial && this.entity.babylonNode) { // Use babylonNode
            this.sound.attachToMesh(this.entity.babylonNode);
        }
    }

    _disposeSound() {
        if (this.sound) {
            this.sound.dispose();
            this.sound = null;
        }
    }
}

// Registration function
export function registerSoundComponent(componentManager) {
    componentManager.registerComponent('sound', {
        schema: { type: 'string' }, // Expect a string attribute
        factory: (entity, data) => new SoundComponent(entity, componentManager, data),
    });
}
