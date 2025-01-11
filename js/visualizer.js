// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
import * as THREE from 'three';
import { getYlGnBuColor_r } from './colormap.js';


export class Visualizer {

    constructor() {
        this.container = document.querySelector('#viz-container');
        this.canvas = document.querySelector('#viz-canvas');
        
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        const fov = 45 // AKA Field of View
        const near = 0.1 // the near clipping plane
        const far = 100 // the far clipping plane

        this.scene = new THREE.Scene();
        // scene.background = new THREE.Color('#777777')

        this.camera = new THREE.PerspectiveCamera(fov, this.width/this.height, near, far)
        this.camera.position.set(10, 30, 30);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // camera.position.z = 5;
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 2, 5);
        this.scene.add(directionalLight);

        this.cursor = new THREE.Vector3(1, 0, 0);
        this.step = 1;

        // this.plotCube(1, getYlGnBuColor_r(0.8), 0.5, new THREE.Vector3(1, 2, 0));
        // this.renderScene();
    }

    plotCube(size, cubeColor, opacity, position) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshMatcapMaterial({
            color: cubeColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity }); 
        const cube = new THREE.Mesh(geometry, material);
        // cube.position.add(new THREE.Vector3(1, 0, -3));
        cube.position.set(position.x, position.y, position.z);

        // cube.rotation.set(0.5, 0.5, 0);
        this.scene.add(cube);
    }

    renderScene() {
        const canvas = this.canvas;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.width, this.height);
        renderer.render(this.scene, this.camera);
        console.log(`Elements: ${this.scene.children.length}`);
    }

    clearScene() {
        this.scene.clear();
        this.cursor.set(0, 0, 0);
        this.renderScene();
    }

    plotLayer(layerActivations, shape) {
        this.clearScene();

        const dims = shape.length;
        console.log(`dims: ${dims}`);
        if(dims > 3 ){
            console.log('Layer has more than 3 dimensions');
            return;
        }

        const startPos = [0, 0, 0];
        shape.forEach((dim, i) => {
            startPos[i] = - dim/2;
        })
        
        this.cursor.x = startPos[0];
        this.cursor.y = startPos[1];

        const unitVecs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        if (dims === 1) {
            const maxVal = Math.max(...layerActivations);   
            const minVal = Math.min(...layerActivations);
            const aRange = maxVal - minVal;
            for (let i = 0; i < layerActivations.length; i++) {
                this.plotCube(0.8, getYlGnBuColor_r((layerActivations[i]-minVal)/aRange), 0.5, this.cursor);
                this.cursor.x += this.step;
            }
        } else if (dims === 2) {
            const maxVal = Math.max(...layerActivations.flat());   
            const minVal = Math.min(...layerActivations.flat());
            const aRange = maxVal - minVal;
            for (let i = 0; i < layerActivations.length; i++) {
                for (let j = 0; j < layerActivations[i].length; j++) {
                    this.plotCube(0.8, getYlGnBuColor_r((layerActivations[i][j]-minVal)/aRange), 0.5, this.cursor);
                    this.cursor.x += this.step;
                }
                this.cursor.x = startPos[0];
                this.cursor.y += this.step;
            }
        } else if (dims === 3) {
            const maxVal = Math.max(...layerActivations.flat().flat());
            const minVal = Math.min(...layerActivations.flat().flat());
            const aRange = maxVal - minVal;
            for (let i = 0; i < layerActivations.length; i++) {
                for (let j = 0; j < layerActivations[i].length; j++) {
                    for (let k = 0; k < layerActivations[i][j].length; k++) {
                        this.plotCube(0.8, getYlGnBuColor_r((layerActivations[i][j][k]-minVal)/aRange), 0.5, this.cursor);
                        this.cursor.x += this.step;
                    }
                    this.cursor.x = startPos[0];
                    this.cursor.y += this.step;
                }
                this.cursor.y = startPos[1];
                this.cursor.z += this.step;
            }            
        }

        // for (let i = 0; i < layerActivations.length; i++) {
        //     for (let j = 0; j < layerActivations[i].length; j++) {
        //         for (let k = 0; k < layerActivations[i][j].length; k++) {
        //             this.plotCube(1, getYlGnBuColor_r(layerActivations[i][j][k]), 0.5, this.cursor);
        //             this.cursor.x += 1;
        //         }
        //         this.cursor.x = startPos[0];
        //         this.cursor.y += 1;
        //     }
        //     this.cursor.y = startPos[1];
        // }

        this.renderScene();
    }


    
}