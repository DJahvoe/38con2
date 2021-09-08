import superglobal from './superglobal.js';
export default {
	[superglobal.HOME]: {
		camera: {
			position: {
				x: 13000,
				y: 0,
				z: 0,
			},
		},
		rocket: {
			position: {
				x: 12900,
				y: -10,
				z: 0,
			},
			rotation: {
				x: 0,
				y: 0,
				z: -Math.PI / 2,
			},
		},
	},
	[superglobal.PROJECT]: {
		camera: {
			position: {
				x: superglobal.RING_SIZE + 500,
				y: -100,
				z: 0,
			},
		},
		rocket: {
			position: {
				x: superglobal.RING_SIZE,
				y: 20,
				z: 0,
			},
			rotation: {
				x: 0,
				y: 0,
				z: -Math.PI / 2,
			},
		},
	},
	[superglobal.ABOUT]: {
		camera: {
			position: {
				x: 9000,
				y: 0,
				z: -500,
			},
		},
		rocket: {
			position: {
				x: 9000,
				y: 0,
				z: -500,
			},
			rotation: {
				y: Math.PI / 5,
				z: -Math.PI / 2,
			},
		},
	},
	[superglobal.PROJECT_DETAIL]: {
		camera: {
			position: {
				x: superglobal.RING_SIZE + 400,
				y: -100,
				z: 300,
			},
		},
		rocket: {
			position: {
				x: superglobal.RING_SIZE,
				y: 20,
				z: 0,
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0,
			},
		},
	},
};
