import defaultConf from './Object3D';
import { createGlobe } from './factory';

export const globeConf = {
	position: {
		x: -5000,
		y: 0,
		z: 0,
	},
	radius: 100,
	detail: 15,
	groundColor: 0x417b2b,
	waterColor: 0x2080d0,
	noiseConf: {
		noiseF: 0.015,
		noiseD: 15,
		noiseWaterTreshold: 0.4,
		noiseWaterLevel: 0.2,
	},
};

export class Globe {
	constructor(conf) {
		return createGlobe({ ...globeConf, ...conf }, defaultConf);
	}
}
