import defaultConf from './Object3D';
import { createStartingPlane } from './factory';

export const startingPlaneConf = {
	position: {
		x: 13050,
		y: -40,
		z: 0,
	},
	scale: {
		u: 500,
		v: 500,
	},
	color: { r: 0.15, g: 0.15, b: 0.15 },
};

export class StartingPlane {
	constructor() {
		return createStartingPlane(startingPlaneConf, defaultConf);
	}
}
