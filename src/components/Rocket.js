import * as THREE from 'three';
import gsap from 'gsap';
import defaultConf from './Object3D';
import rocketAfterBurnerFragmentShader from '../shaders/rocketAfterBurner/fragment.glsl';
import rocketAfterBurnerVertexShader from '../shaders/rocketAfterBurner/vertex.glsl';
import { createRocket } from './factory';

export const rocketConf = {
	scale: 12,
	afterBurner: {
		scale: 12,
		color: {
			r: 0.3,
			g: 0.6,
			b: 1.0,
		},
	},
};

export class Rocket {
	constructor(gltfLoader) {
		this.initAfterBurn();
		return {
			rocket: this,
			rocketPromise: createRocket(gltfLoader, rocketConf, defaultConf),
		};
	}
	/**
	 * AfterBurn
	 */
	initAfterBurn() {
		this.afterBurnGeometry = new THREE.BoxBufferGeometry(
			rocketConf.afterBurner.scale,
			rocketConf.afterBurner.scale,
			rocketConf.afterBurner.scale
		);
		this.afterBurnMaterial = new THREE.ShaderMaterial({
			vertexShader: rocketAfterBurnerVertexShader,
			fragmentShader: rocketAfterBurnerFragmentShader,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide,
			uniforms: {
				uColor: {
					value: new THREE.Color(
						rocketConf.afterBurner.color.r,
						rocketConf.afterBurner.color.g,
						rocketConf.afterBurner.color.b
					),
				},
			},
		});
	}
	addAfterBurn(scene, { x, y, z }) {
		const afterBurnMesh = new THREE.Mesh(
			this.afterBurnGeometry,
			this.afterBurnMaterial
		);
		const randRotation = Math.random() * Math.PI;
		afterBurnMesh.position.set(x, y, z);
		afterBurnMesh.rotation.set(randRotation, randRotation, randRotation);
		scene.add(afterBurnMesh);
		const timer = Math.random() * 1500;
		const tl = gsap.timeline({
			onComplete: () => {
				scene.remove(afterBurnMesh);
			},
		});
		tl.to(afterBurnMesh.scale, { duration: timer / 1000, x: 0, y: 0, z: 0 });
	}
}
