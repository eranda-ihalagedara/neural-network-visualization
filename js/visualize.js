// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
import * as THREE from 'three';
import { getYlGnBuColor_r } from './colormaps.js';

const container = document.querySelector('#viz-container');
const canvas = document.querySelector('#viz-canvas');
console.log(canvas);
const fov = 45 // AKA Field of View
const width = container.offsetWidth;
const height = container.offsetHeight;
const near = 0.1 // the near clipping plane
const far = 100 // the far clipping plane

const scene = new THREE.Scene();
// scene.background = new THREE.Color('#777777')

const camera = new THREE.PerspectiveCamera(fov, width/height, near, far)
camera.position.set(0, 0, 15)
// camera.lookAt(new THREE.Vector3(0, 0, 0));

// camera.position.z = 5;
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 5);
scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshMatcapMaterial({
    color: getYlGnBuColor_r(0.8),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5 }); 
const cube = new THREE.Mesh(geometry, material);
// cube.position.add(new THREE.Vector3(1, 0, -3));
cube.rotation.set(0.5, 0.5, 0);
scene.add(cube);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.render(scene, camera);
