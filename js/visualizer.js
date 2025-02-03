// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js' 

import { getYlGnBuColor, getYlGnBuColor_r } from './colormap.js';

import { makeInstanced } from './instance-test.js';

export class Visualizer {

    constructor(containerId, canvasId) {
        this.container = document.querySelector(containerId);
        const canvas = document.querySelector(canvasId);
        
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        const fov = 45 // AKA Field of View
        const near = 1 // the near clipping plane
        const far = 1000 // the far clipping plane

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#333333');

        this.camera = new THREE.PerspectiveCamera(fov, this.width/this.height, near, far)
        this.camera.position.set(30, 30, 30);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 2, 5);
        this.scene.add(directionalLight);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8 });

        this.cursor = new THREE.Vector3(1, 0, 0);
        this.step = 1;
        this.layerGap = 20;
        
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);

        this.clock = new THREE.Clock();
        this.renderer.setAnimationLoop( () => this.renderScene());

        this.setControls();
        
        this.loadFont();
    }

    plotModel(layerValues) {
        const modelLength = this.getModelLength(layerValues.layerShapes);
        this.cursor.z = modelLength/2;
 
        for (let layerId = 0; layerId < layerValues.layerActivations.length; layerId++) {
            this.plotLayer(layerValues.layerActivations[layerId], layerValues.layerShapes[layerId]);
            this.addLabel(`layerId: ${layerId}`, {x: 10, y: 5, z: this.cursor.z});
            this.cursor.z -= this.layerGap;
        }

        this.camera.position.set(25, 25, modelLength*0.6);

        this.camera.lookAt(0, 0, 0);
    }

    plotLayer(layerActivations, shape) {

        const dims = shape.length;

        if(dims > 3 ){
            console.log('Layer has more than 3 dimensions');
            return;
        }

        // Set an anchor position for the layer activations are centred around z-axis
        const anchorPos = shape.map((dim, i) => -dim / 2).concat([0, 0, 0]).slice(0, 3);
        anchorPos[1] = -anchorPos[1];
        [this.cursor.x, this.cursor.y] = anchorPos;
        anchorPos[2] = this.cursor.z;

        const matrix = new THREE.Matrix4();
        let mesh;

        if (dims === 1) {
            const maxVal = Math.max(...layerActivations);   
            const minVal = Math.min(...layerActivations);
            const aRange = maxVal - minVal;
            
            mesh = new THREE.InstancedMesh( this.geometry, this.material, layerActivations.length );

            for (let i = 0; i < layerActivations.length; i++) {
                const actVal = (layerActivations[i]-minVal)/aRange;
                matrix.compose( this.cursor, new THREE.Quaternion(), new THREE.Vector3(0.8, 0.8, 0.8) );
                
                mesh.setMatrixAt( i, matrix );
                mesh.setColorAt( i, new THREE.Color(getYlGnBuColor_r(actVal)) );
                this.cursor.x += this.step;
            }

        } else if (dims === 2) {
            const maxVal = Math.max(...layerActivations.flat());   
            const minVal = Math.min(...layerActivations.flat());
            const aRange = maxVal - minVal;

            mesh = new THREE.InstancedMesh( this.geometry, this.material, layerActivations.length*layerActivations[0].length );
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(0.8, 0.8, 0.8);
            
            for (let i = 0; i < layerActivations.length; i++) {
                for (let j = 0; j < layerActivations[0].length; j++) {
                    const actVal = (layerActivations[i]-minVal)/aRange;
                    matrix.compose( this.cursor, quaternion, scale );
                    
                    mesh.setMatrixAt( i*layerActivations[0].length + j, matrix );
                    mesh.setColorAt( i*layerActivations[0].length + j, new THREE.Color(getYlGnBuColor_r(actVal)) );
                    
                    this.cursor.x += this.step;
                }
                this.cursor.x = anchorPos[0];
                this.cursor.y += this.step;
            }

        } else if (dims === 3) {
            const maxVal = Math.max(...layerActivations.flat().flat());
            const minVal = Math.min(...layerActivations.flat().flat());
            const aRange = maxVal - minVal;

            mesh = new THREE.InstancedMesh( this.geometry, this.material, layerActivations.length*layerActivations[0].length*layerActivations[0][0].length );

            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(0.8, 0.8, 0.8);
            
            for (let i = 0; i < layerActivations.length; i++) {
                for (let j = 0; j < layerActivations[0].length; j++) {
                    for (let k = 0; k < layerActivations[0][0].length; k++) {
                        const actVal = (layerActivations[i][j][k]-minVal)/aRange;
                        scale.x = scale.y = scale.z = actVal;
                        matrix.compose( this.cursor, quaternion, scale );

                        mesh.setMatrixAt( i*layerActivations[0].length*layerActivations[0][0].length + j*layerActivations[0][0].length + k, matrix );
                        mesh.setColorAt( i*layerActivations[0].length*layerActivations[0][0].length + j*layerActivations[0][0].length + k, new THREE.Color(getYlGnBuColor_r(actVal)) );
                        
                        this.cursor.z -= this.step;
                    }
                    this.cursor.z = anchorPos[2];
                    this.cursor.x += this.step;
                }
                this.cursor.x = anchorPos[0];
                this.cursor.y -= this.step;
            }
            
            this.cursor.z -= layerActivations[0][0].length * this.step;
        }

        if (mesh) {
            this.scene.add( mesh );
        };
    }

    renderScene() {
        this.controls.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
    }

    clearScene() {
        this.scene.clear();
        this.cursor.set(0, 0, 0);
    }

    setControls() {
        // this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.controls = new FirstPersonControls( this.camera, this.renderer.domElement );
        this.controls.movementSpeed = 10;
        this.controls.lookSpeed = 0.2;

        canvas.addEventListener('mouseout', () => { this.controls.activeLook = false; this.controls.lookAt(0, 0, 0)});
        canvas.addEventListener('mouseover', () => { this.controls.activeLook = true});
    }

    plotCube(size, cubeColor, opacity, position) {
        
        const material = new THREE.MeshBasicMaterial({
            color: cubeColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: opacity });

        this.material.color = 0xaa8855;

        const cube = new THREE.Mesh(this.geometry, this.material);
        cube.scale.set(size, size, size);
        cube.position.set(position.x, position.y, position.z);

        this.scene.add(cube);
    }

    getModelLength(shapes) {
        let length = 0;
        shapes.forEach(shape => {
            length += shape[shape.length-1] * this.step + this.layerGap;
        })
        return length - this.layerGap;
    }
    
    loadFont() {
        const loader = new FontLoader();
        loader.load(
            // resource URL
            'fonts/helvetiker_regular.typeface.json',

            // onLoad callback
            ( font ) => {
                this.font = font;
            },

            // onProgress callback
            function ( xhr ) {
            },

            // onError callback
            function ( err ) {
                console.log( 'Error in loading font' );
            }
        );
    }
    addLabel(text, position) {
        const textGeometry = new TextGeometry(text, {
            font: this.font,
            size: 2,
            depth: 0.2,
            curveSegments: 12,
            bevelEnabled: false
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x1f1d1d });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);
        // this.scene.add(textMesh);

        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
        
        // Create card geometry
        const padding = 0.5;
        const cardGeometry = new THREE.PlaneGeometry(
            textWidth + padding * 2,
            textHeight + padding * 2
        );

        // Create materials
        const cardMaterial = new THREE.MeshBasicMaterial({ color: 0xeb4034 });
        
        // Create meshes
        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        
        // Position text on card
        cardMesh.position.set(position.x + textWidth/2, position.y + textHeight/2, position.z - 0.01);
        
        // Create a group to hold both card and text
        const group = new THREE.Group();
        group.add(cardMesh);
        group.add(textMesh);
        
        // Add group to scene
        this.scene.add(group);
    }
}