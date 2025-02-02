import * as THREE from 'three';

const randomizeMatrix = function () {

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function ( matrix ) {

        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        quaternion.random();

        scale.x = scale.y = scale.z = Math.random() * 1;

        matrix.compose( position, quaternion, scale );

    };

}();

function makeInstanced( geometry, material, scene) {

    const matrix = new THREE.Matrix4();
    const mesh = new THREE.InstancedMesh( geometry, material, 1000 );

    for ( let i = 0; i < 1000; i ++ ) {

        randomizeMatrix( matrix );
        mesh.setMatrixAt( i, matrix );

    }

    scene.add( mesh );

}

export { makeInstanced };