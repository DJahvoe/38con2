import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

import { getRandom3dCoord, getRandomArbitrary } from '../utils/function';

import atmosphereVertexShader from '../shaders/atmosphere/vertex.glsl';
import atmosphereFragmentShader from '../shaders/atmosphere/fragment.glsl';

const simplex = new SimplexNoise();

export function createGlobe(globeConf, defaultConf) {
	const { radius, detail, groundColor, waterColor, noiseConf } = globeConf;
	const { noiseF, noiseD, noiseWaterTreshold, noiseWaterLevel } = noiseConf;
	const time = Date.now() * 0.001;

	// noise buffer for faces colors
	const noises = [];

	// noise function
	const vNoise = (v, f, i) => {
		const nv = new THREE.Vector3(v.x, v.y, v.z)
			.multiplyScalar(f)
			.addScalar(time);
		let noise = (simplex.noise3D(nv.x, nv.y, nv.z) + 1) / 2;
		noise = noise > noiseWaterTreshold ? noise : noiseWaterLevel;
		if (Number.isInteger(i)) noises[i] = noise;
		return noise;
	};

	// displacement function
	const dispV = (v, i) => {
		const dv = new THREE.Vector3(v.x, v.y, v.z);
		dv.add(
			dv
				.clone()
				.normalize()
				.multiplyScalar(vNoise(dv, noiseF, i) * noiseD)
		);
		v.x = dv.x;
		v.y = dv.y;
		v.z = dv.z;
	};

	// globe geometry
	const geometry = new THREE.IcosahedronGeometry(radius, detail);
	geometry.mergeVertices();
	for (let i = 0; i < geometry.vertices.length; i++)
		dispV(geometry.vertices[i], i);
	geometry.computeFlatVertexNormals();

	// globe geometry - faces colors
	for (let i = 0; i < geometry.faces.length; i++) {
		const f = geometry.faces[i];
		f.color.set(groundColor);
		if (
			noises[f.a] === noiseWaterLevel &&
			noises[f.b] === noiseWaterLevel &&
			noises[f.c] === noiseWaterLevel
		) {
			f.color.set(waterColor);
		}
	}

	// globe material
	const material = new THREE.MeshPhongMaterial({
		shininess: 30,
		flatShading: true,
		vertexColors: THREE.VertexColors,
	});

	// globe mesh
	const globeMesh = new THREE.Mesh(geometry, material);

	// atmosphere mesh
	const atmosphereMesh = new THREE.Mesh(
		// new THREE.SphereGeometry(radius * 1.15, 50, 50),
		geometry,
		new THREE.ShaderMaterial({
			vertexShader: atmosphereVertexShader,
			fragmentShader: atmosphereFragmentShader,
			blending: THREE.AdditiveBlending,
			side: THREE.BackSide,
			uniforms: {
				uColor: {
					value: new THREE.Color(0.3, 0.6, 1.0),
				},
			},
		})
	);
	atmosphereMesh.scale.set(1.025, 1.025, 1.025);

	// full mesh
	const mesh = new THREE.Object3D();
	mesh.add(globeMesh);
	mesh.add(atmosphereMesh);
	const { x, y, z } = defaultConf.position;
	mesh.position.set(x, y - radius * 1.4, z);
	// mesh.castShadow = true;
	// mesh.receiveShadow = true;

	return { mesh, globeConf, vNoise, dispV };
}

export async function createRocket(gltfLoader, rocketConf, defaultConf) {
	let { scale } = rocketConf;
	let rocket = new THREE.Object3D();
	let rocketModel;
	let gltf = await gltfLoader.loadAsync('/models/rocket/rocket.gltf');
	rocketModel = gltf.scene;
	gltf.scene.scale.set(scale, scale, scale);
	gltf.scene.position.set(10, -2, 0);

	// Rotate to (entering viewer) face
	// gltf.scene.rotation.z = Math.PI * 0.5;
	gltf.scene.rotateY(Math.PI * 0.5);

	gltf.scene.castShadow = true;
	gltf.scene.receiveShadow = true;

	rocket.add(rocketModel);
	return rocket;
}

export function createStars(starsConf, defaultConf) {
	const { count, size, color, minPos, maxPos, offset, radius } = starsConf;
	/**
	 * Geometry
	 */
	const stars = new THREE.Group();
	const geometry = new THREE.BufferGeometry();

	const positions = new Float32Array(count * 3);
	const colors = new Float32Array(count * 3);

	for (let i = 0; i < count; i++) {
		// Position
		const i3 = i * 3;

		const { x, y, z } = getRandom3dCoord(minPos, maxPos, offset);

		const sqrtOfXYZ = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
		const randomRadius = getRandomArbitrary(offset, radius);
		positions[i3] = (x / sqrtOfXYZ) * randomRadius;
		positions[i3 + 1] = (y / sqrtOfXYZ) * randomRadius;
		positions[i3 + 2] = (z / sqrtOfXYZ) * randomRadius;

		// Color
		colors[i3] = color.r;
		colors[i3 + 1] = color.g;
		colors[i3 + 2] = color.b;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

	/**
	 * Material
	 */
	// const material = new THREE.ShaderMaterial({
	// 	vertexShader: atmosphereVertexShader,
	// 	fragmentShader: atmosphereFragmentShader,
	// 	blending: THREE.AdditiveBlending,
	// 	side: THREE.BackSide,
	// 	uniforms: {
	// 		uColor: {
	// 			value: new THREE.Color(0.3, 0.6, 1.0),
	// 		},
	// 	},
	// });
	const material = new THREE.PointsMaterial({
		size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
	});

	/**
	 * Points Mesh
	 */
	const points = new THREE.Points(geometry, material);
	stars.add(points);
	return { mesh: stars };
}
