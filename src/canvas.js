import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Globe } from './components/Globe';
import { Stars } from './components/Stars';
import { Rocket } from './components/Rocket';
import { rotateAboutPoint } from './utils/function';

import { gsap, Elastic } from 'gsap';
import * as dat from 'dat.gui';

/**
 * dat.GUI
 */
// const gui = new dat.GUI();

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar');
const loadingManager = new THREE.LoadingManager(
	// Loaded
	() => {
		// Wait a little
		window.setTimeout(() => {
			// Animate overlay
			gsap.to(overlayMaterial.uniforms.uAlpha, {
				duration: 3,
				value: 0,
				delay: 1,
			});

			const root = document.querySelector('#root');
			root.style = 'z-index: 100;';
			gsap.to(root, {
				duration: 3,
				opacity: 1,
				delay: 1,
			});

			gsap.to(camera.position, {
				duration: 3,
				x: 500,
				y: 100,
				z: 0,
				delay: 3,
				ease: Elastic.easeInOut.config(0.08, 0.1),
			});

			// Update loadingBarElement
			loadingBarElement.classList.add('ended');
			loadingBarElement.style.transform = '';
		}, 500);
	},

	// Progress
	(itemUrl, itemsLoaded, itemsTotal) => {
		// Calculate the progress and update the loadingBarElement
		const progressRatio = itemsLoaded / itemsTotal;
		loadingBarElement.style.transform = `scaleX(${progressRatio})`;
	}
);
const gltfLoader = new GLTFLoader(loadingManager);

/**
 * Base
 */
// Debug
const debugObject = {
	rocketRotation: {
		x: 0,
		y: 0,
		z: 0,
	},
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 500, 7000);

// AxesHelper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
	// wireframe: true,
	transparent: true,
	uniforms: {
		uAlpha: { value: 1 },
	},
	vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
	fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

scene.background = new THREE.Color(0x000000);

/**
 * Objects
 */
// Earth
const globe = new Globe();
scene.add(globe.mesh);

// Stars
const stars = new Stars();
scene.add(stars.mesh);

// Rocket
let rocketObj;
const { rocket, rocketPromise } = new Rocket(gltfLoader);
rocketPromise.then((r) => {
	rocketObj = r;
	r.position.set(12900, -10, 0);
	scene.add(r);
});

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight('#808080', 2);
const ambientLight = new THREE.AmbientLight('#55aaff', 4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.02;
directionalLight.position.set(2, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	20000
);
camera.position.set(13000, 0, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new THREE.Clock();

/**
 * Each Tick
 */
const animate = (elapsedTime) => {
	// Rocket rotating globe
	if (rocketObj) {
		// rotateAboutPoint(
		// 	rocketObj,
		// 	globe.mesh.position,
		// 	new THREE.Vector3(0, 0, 1),
		// 	Math.PI / 200
		// );
		rocket.addAfterBurn(scene, rocketObj.position);
	}

	// Globe rotation
	globe.mesh.rotation.x = elapsedTime / 4;
	// Stars rotation
	stars.mesh.rotation.x = elapsedTime / 100;
};

/**
 * Animate
 */
const tick = () => {
	// Clock
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Animate
	animate(elapsedTime);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();

controls.addEventListener('change', () => {
	const { position, rotation, aspect } = camera;
	console.log('-----------------');
	console.log(position);
	console.log(rotation);
	console.log(aspect);
});
