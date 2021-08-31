import defaultConf from './Object3D';
import { createStars } from './factory';

export const starsConf = {
	count: 7500,
	size: 30,
	color: { r: 255, g: 255, b: 255 },
	minPos: { x: -1000, y: -1000, z: -1000 },
	maxPos: { x: 1000, y: 1000, z: 1000 },
	radius: 10000,
	offset: 7000,
};

export class Stars {
	constructor() {
		return createStars(starsConf, defaultConf);
	}
}
