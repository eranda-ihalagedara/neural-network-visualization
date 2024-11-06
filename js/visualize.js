import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"

const container = document.querySelector('#viz-container');
const canvas = document.querySelector('#viz-canvas');

const scene = new THREE.Scene();
// scene.background = new THREE.Color('#00b140')

const fov = 45 // AKA Field of View
const width = container.offsetWidth;
const height = container.offsetHeight;
const near = 0.1 // the near clipping plane
const far = 100 // the far clipping plane
const camera = new THREE.PerspectiveCamera(fov, width/height, near, far)
camera.position.set(0, 0, 10)

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshPhysicalMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
cube.rotation.set(0.5, 0.5, 0);
scene.add(cube);

// camera.position.z = 5;
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 5);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.render(scene, camera);