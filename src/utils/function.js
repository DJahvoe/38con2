import routes from '../config/routes';
import { gsap, Elastic } from 'gsap';

export const hexToRgb = (hex) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
};

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

// Objects
//// Rocket
export const setRocketPosition = (rocketObj, rocketPos) => {
	rocketObj.position.set(rocketPos.x, rocketPos.y, rocketPos.z);
};

export const setRocketRotation = (rocketObj, rocketRotation) => {
	rocketObj.rotation.x =
		typeof rocketRotation?.x === 'undefined'
			? rocketObj.rotation.x
			: rocketRotation.x;
	rocketObj.rotation.y =
		typeof rocketRotation?.y === 'undefined'
			? rocketObj.rotation.y
			: rocketRotation.y;
	rocketObj.rotation.z =
		typeof rocketRotation?.z === 'undefined'
			? rocketObj.rotation.z
			: rocketRotation.z;
};

// Elements
export const createTemporalOverlay = () => {
	const overlay = document.createElement('div');
	overlay.style.opacity = 0;
	overlay.style.position = 'fixed';
	overlay.style.top = 0;
	overlay.style.left = 0;
	overlay.style.bottom = 0;
	overlay.style.right = 0;
	overlay.style.zIndex = 1000;
	return overlay;
};

// Routing
export const dispatchChangeSceneEvent = (element, option) => {
	element.dispatchEvent(new CustomEvent('ChangeSceneCanvas', option));
	element.dispatchEvent(new CustomEvent('ChangeSceneApp', option));
};

export const onNavigate = (pathname) => {
	window.history.pushState({}, pathname, window.location.origin + pathname);

	document.getElementById('app').innerHTML = routes[pathname].template;
	routes[pathname].onMount();

	dispatchChangeSceneEvent(window, {
		detail: pathname,
		bubbles: true,
	});
};

export const isRoute = (route) => {
	const location = window.location.pathname + window.location.hash;
	return location === route;
};
