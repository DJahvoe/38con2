import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Globe } from './components/Globe';
import { Stars } from './components/Stars';
import { Rocket } from './components/Rocket';
import {
	createTemporalOverlay,
	isRoute,
	rotateAboutPoint,
	setRocketPosition,
	setRocketRotation,
} from './utils/function';

import { gsap, Elastic, Power4 } from 'gsap';
import * as dat from 'dat.gui';
import sceneConfig from './config/scene';
import globes from './config/globes';
import superglobal from './config/superglobal';
import loading from './components/loading';

/**
 * GLobal State
 */
let selectedGlobe = 0;
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

			// gsap.to(camera.position, {
			// 	duration: 3,
			// 	x: 500,
			// 	y: 100,
			// 	z: 0,
			// 	delay: 3,
			// 	ease: Elastic.easeInOut.config(0.08, 0.1),
			// });

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
// const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

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
const globesObj = [];
// const requireContext = require.context(
// 	'../static/img/projects/',
// 	false,
// 	/\.(png|jpe?g)$/
// );
// const imagesCollection = requireContext.keys().map(requireContext);
// console.log(imagesCollection);
globes.forEach((glb, i) => {
	const globe = new Globe(glb);
	rotateAboutPoint(
		globe.mesh,
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 1, 0),
		-(i * 2 * Math.PI) / globes.length
	);
	// glb.userData.leftImageSrc = require('../static' +
	// 	glb.userData.leftImageSrc).default;
	// glb.userData.rightImageSrc = require('../static' +
	// 	glb.userData.rightImageSrc).default;
	// glb.userData.mainImageSrc = require('../static' +
	// 	glb.userData.mainImageSrc).default;
	globesObj.push(globe.mesh);
	scene.add(globe.mesh);
});

// Stars
const stars = new Stars();
scene.add(stars.mesh);

// Rocket
let rocketObj;
const { rocket, rocketPromise } = new Rocket(gltfLoader);
rocketPromise.then((r) => {
	rocketObj = r;
	const url = '/' + window.location.hash;
	const config = sceneConfig[url];
	const rocketPosition = config.rocket.position;
	const rocketRotation = config.rocket.rotation;
	setRocketPosition(rocketObj, rocketPosition);
	setRocketRotation(rocketObj, rocketRotation);

	scene.add(rocketObj);
});

/**
 * Lights
 */
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
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

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
		if (isRoute(superglobal.ABOUT)) {
			rotateAboutPoint(
				rocketObj,
				new THREE.Vector3(0, 0, -500),
				new THREE.Vector3(0, 0, 1),
				Math.PI / 2000
			);
			rotateAboutPoint(
				camera,
				new THREE.Vector3(0, 0, -500),
				new THREE.Vector3(0, 0, 1),
				Math.PI / 2000
			);
		}
		if (isRoute(superglobal.PROJECT_DETAIL)) {
			rotateAboutPoint(
				rocketObj,
				globesObj[selectedGlobe].position,
				new THREE.Vector3(0, 0, 1),
				Math.PI / 200
			);
		}
		rocket.addAfterBurn(scene, rocketObj.position);
	}

	// Globe rotation
	globesObj.forEach((glb) => {
		glb.rotation.x = elapsedTime / 4;
	});
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
	// controls.update();
	if (isRoute(superglobal.HOME)) {
		camera.lookAt(new THREE.Vector3(0, 0, 0));
	}
	if (isRoute(superglobal.PROJECT) || isRoute(superglobal.PROJECT_DETAIL)) {
		camera.lookAt(
			new THREE.Vector3(
				camera.position.x * 2,
				camera.position.y * 0.25,
				camera.position.z * 2
			)
		);
	}

	// Render
	renderer.render(scene, camera);

	// Animate
	animate(elapsedTime);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();

// EventListener
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

let isAnimationPlaying = false;
window.addEventListener('wheel', (event) => {
	if (!isAnimationPlaying && isRoute(superglobal.PROJECT)) {
		const leftImageProject = document.getElementById('project-first-image');
		const rightImageProject = document.getElementById('project-second-image');
		leftImageProject.style.backgroundImage = '';
		leftImageProject.innerHTML = loading;
		rightImageProject.style.backgroundImage = '';
		rightImageProject.innerHTML = loading;

		isAnimationPlaying = true;
		const isPositive = event.deltaY > 0;

		let currentDeg = 0;
		const maxDeg = (2 * Math.PI) / globes.length;
		const regularDeg = maxDeg / 200;

		const rotateInterval = setInterval(() => {
			// Camera
			rotateAboutPoint(
				camera,
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 1, 0),
				isPositive ? -regularDeg : regularDeg
			);
			// Rocket
			rotateAboutPoint(
				rocketObj,
				new THREE.Vector3(0, 20, 0),
				new THREE.Vector3(0, 1, 0),
				isPositive ? -regularDeg : regularDeg
			);

			// Rocket Rotation
			if (isPositive) {
				rocketObj.lookAt(
					new THREE.Vector3(
						rocketObj.position.x * 2,
						20,
						rocketObj.position.z * 2
					)
				);
				rocketObj.rotateX(-Math.PI / 2);
			} else {
				rocketObj.lookAt(new THREE.Vector3(0, 20, 0));
				rocketObj.rotateX(Math.PI / 2);
			}

			currentDeg += regularDeg;
			// Stop Animation
			if (currentDeg > maxDeg) {
				isAnimationPlaying = false;
				// Rotate to initial rotation
				rocketObj.rotateY(isPositive ? Math.PI / 2 : -Math.PI / 2);
				// Change selected globe state on scroll
				isPositive ? selectedGlobe++ : selectedGlobe--;
				if (selectedGlobe > globes.length - 1) selectedGlobe = 0;
				if (selectedGlobe < 0) selectedGlobe = globes.length - 1;

				clearInterval(rotateInterval);
				if (globes[selectedGlobe].userData.leftImageSrc) {
					leftImageProject.innerHTML = '';
					leftImageProject.style.backgroundImage = `url('${globes[selectedGlobe].userData.leftImageSrc}')`;
				}
				if (globes[selectedGlobe].userData.rightImageSrc) {
					rightImageProject.innerHTML = '';
					rightImageProject.style.backgroundImage = `url('${globes[selectedGlobe].userData.rightImageSrc}')`;
				}
			}
		}, 1);
	}
});

window.addEventListener('ChangeSceneCanvas', (e) => {
	isAnimationPlaying = true;
	const config = sceneConfig[e.detail];
	let cameraPos = { ...config.camera.position };
	let rocketPosition = { ...config.rocket.position };
	let rocketRotation = { ...config.rocket.rotation };

	if (rocketObj) {
		setRocketPosition(rocketObj, rocketPosition);
		setRocketRotation(rocketObj, rocketRotation);

		// Position Camera and Rocket according to currently selected globes
		if (isRoute(superglobal.PROJECT) || isRoute(superglobal.PROJECT_DETAIL)) {
			const initialDegree = -((2 * Math.PI) / globesObj.length) * selectedGlobe;
			// Camera
			cameraPos = new THREE.Vector3(cameraPos.x, cameraPos.y, cameraPos.z);
			cameraPos.sub(new THREE.Vector3(0, 20, 0));
			cameraPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), initialDegree);
			cameraPos.add(new THREE.Vector3(0, 20, 0));

			// Rocket
			rocketObj.position.x = superglobal.RING_SIZE * Math.cos(initialDegree);
			rocketObj.position.z = superglobal.RING_SIZE * Math.sin(-initialDegree);
		}
	}

	if (isRoute(superglobal.PROJECT)) {
		// Load Image
		const leftImageProject = document.getElementById('project-first-image');
		const rightImageProject = document.getElementById('project-second-image');
		if (globes[selectedGlobe].userData.leftImageSrc) {
			leftImageProject.innerHTML = '';
			leftImageProject.style.backgroundImage = `url('${globes[selectedGlobe].userData.leftImageSrc}')`;
		}
		if (globes[selectedGlobe].userData.rightImageSrc) {
			rightImageProject.innerHTML = '';
			rightImageProject.style.backgroundImage = `url('${globes[selectedGlobe].userData.rightImageSrc}')`;
		}
	}

	if (isRoute(superglobal.PROJECT_DETAIL)) {
		const { mainImageSrc, title, description, viewUrl, githubUrl } =
			globes[selectedGlobe].userData;

		// Load title
		const titleDOM = document.querySelector('.project-detail--title');
		titleDOM.innerText = title;

		// Load Description
		const descriptionDOM = document.querySelector(
			'.project-detail--description'
		);
		descriptionDOM.innerText = description;

		// Load Image
		const imageDOM = document.querySelector('.project-detail--image');
		imageDOM.style.backgroundImage = `url('${mainImageSrc}')`;

		// Load View Link
		const viewLinkDOM = document.getElementById('project-detail--view-link');
		viewLinkDOM.href = viewUrl;

		// Load Github Link
		const githubLinkDOM = document.getElementById(
			'project-detail--github-link'
		);
		githubLinkDOM.style.display = githubUrl ? 'inline' : 'none';
		githubLinkDOM.href = githubUrl;
	}

	const root = document.getElementById('root');
	const overlay = createTemporalOverlay();
	root.appendChild(overlay);
	root.style.opacity = 0;
	const tl = gsap.timeline({
		onComplete: () => {
			isAnimationPlaying = false;
			root.removeChild(overlay);
		},
	});
	tl.to(camera.position, {
		x: cameraPos.x,
		y: cameraPos.y,
		z: cameraPos.z,
		duration: 3,
		ease: Elastic.easeInOut.config(0.08, 0.1),
	});
	tl.to(root, {
		duration: 1,
		opacity: 1,
	});
});
