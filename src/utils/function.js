export const getRandomArbitrary = (min, max) => {
	return Math.random() * (max - min) + min;
};

export const getRandom3dCoord = (min, max, offset = 0) => {
	let coord = { x: 0, y: 0, z: 0 };
	coord.x = getRandomArbitrary(min.x, max.x);
	coord.y = getRandomArbitrary(min.y, max.y);
	coord.z = getRandomArbitrary(min.z, max.z);

	return coord;
};

export const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
	pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

	if (pointIsWorld) {
		obj.parent.localToWorld(obj.position);
	}

	obj.position.sub(point);
	obj.position.applyAxisAngle(axis, theta);
	obj.position.add(point);

	if (pointIsWorld) {
		obj.parent.worldToLocal(obj.position);
	}

	obj.rotateOnAxis(axis, theta);
};