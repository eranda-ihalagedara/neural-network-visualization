// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { getYlGnBuColor, getYlGnBuColor_r } from './colormap.js';


export class Visualizer {

    constructor() {
        this.container = document.querySelector('#viz-container');
        const canvas = document.querySelector('#viz-canvas');
        
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        const fov = 45 // AKA Field of View
        const near = 0.1 // the near clipping plane
        const far = 100 // the far clipping plane

        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color('#111111');

        this.camera = new THREE.PerspectiveCamera(fov, this.width/this.height, near, far)
        this.camera.position.set(0, 30, 30);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        // camera.position.z = 5;
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 2, 5);
        this.scene.add(directionalLight);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);

        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );

        this.cursor = new THREE.Vector3(1, 0, 0);
        this.step = 1;

        // this.plotCube(1, getYlGnBuColor_r(0.8), 0.5, new THREE.Vector3(1, 2, 0));
        
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        // this.controls.addEventListener( 'change', ()=>{
        //     this.renderScene();
        // } );
        // this.controls.update();
        
        // this.controls = new ArcballControls( this.camera, this.renderer.domElement, this.scene );
        // this.controls.addEventListener( 'change', ()=>{
        //     this.renderScene();
        // } );
        // this.controls.update();

        this.clock = new THREE.Clock();
        // this.controls = new FirstPersonControls( this.camera, this.renderer.domElement );
        // this.controls.movementSpeed = 10;
        // this.controls.lookSpeed = 0.1;

        this.renderer.setAnimationLoop( this.renderScene.bind(this));

        // this.renderScene();
    }

    plotCube(size, cubeColor, opacity, position) {
        
        const material = new THREE.MeshBasicMaterial({
            color: cubeColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity });

        const cube = new THREE.Mesh(this.geometry, material);
        cube.scale.set(size, size, size);
        cube.position.set(position.x, position.y, position.z);

        this.scene.add(cube);
    }

    renderScene() {
        this.controls.update( this.clock.getDelta() );
        this.renderer.render(this.scene, this.camera);
    }

    clearScene() {
        this.scene.clear();
        this.cursor.set(0, 0, 0);
        // this.renderScene();
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
        startPos[2] = this.cursor.z;

        const unitVecs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

        if (dims === 1) {
            const maxVal = Math.max(...layerActivations);   
            const minVal = Math.min(...layerActivations);
            const aRange = maxVal - minVal;
            for (let i = 0; i < layerActivations.length; i++) {
                this.plotCube(0.8, getYlGnBuColor((layerActivations[i]-minVal)/aRange), 0.5, this.cursor);
                this.cursor.x += this.step;
            }
        } else if (dims === 2) {
            const maxVal = Math.max(...layerActivations.flat());   
            const minVal = Math.min(...layerActivations.flat());
            const aRange = maxVal - minVal;
            for (let i = 0; i < layerActivations.length; i++) {
                for (let j = 0; j < layerActivations[i].length; j++) {
                    this.plotCube(0.8, getYlGnBuColor((layerActivations[i][j]-minVal)/aRange), 0.5, this.cursor);
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
                        const actVal = (layerActivations[i][j][k]-minVal)/aRange;
                        this.plotCube(actVal, getYlGnBuColor(actVal), 0.5, this.cursor);
                        this.cursor.z -= this.step;
                    }
                    this.cursor.z = startPos[2];
                    this.cursor.y += this.step;
                }
                this.cursor.y = startPos[1];
                this.cursor.x += this.step;
            }            
        }

        // this.renderScene();
    }


    
}