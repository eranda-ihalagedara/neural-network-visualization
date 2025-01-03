// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
import * as THREE from 'three';

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
    color: getYlGnBuColor_reverse(0.8),
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


// ==========================

// ==========================
// Color Map
function interpolate(start, end, fraction) {
    return [
        Math.floor(start[0] + fraction * (end[0] - start[0])),
        Math.floor(start[1] + fraction * (end[1] - start[1])),
        Math.floor(start[2] + fraction * (end[2] - start[2])),
    ];
}

function rgbToHex(rgb) {
    return "#" + rgb.map(component => {
        const hex = component.toString(16);
        return hex.length === 1? "0" + hex : hex;
    }).join("");
}

function getViridisColor(value) {
    const viridisColors = [
        [68, 1, 84], // Start
        [33, 144, 141], // Middle
        [253, 231, 37], // End
    ];

    if (value < 0.5) {
        return rgbToHex(interpolate(viridisColors[0], viridisColors[1], value / 0.5));
    } else {
        return rgbToHex(interpolate(viridisColors[1], viridisColors[2], (value - 0.5) / 0.5));
    }
}

function getYlGnBuColor_reverse(value) {
    const YlGnBuColors_r = [
        [8, 28, 88],
        [67, 183, 195],
        [255, 255, 217],
    ];

    if (value < 0.5) {
        return rgbToHex(interpolate(YlGnBuColors_r[0], YlGnBuColors_r[1], value / 0.5));
    } else {
        return rgbToHex(interpolate(YlGnBuColors_r[1], YlGnBuColors_r[2], (value - 0.5) / 0.5));
    }
}
