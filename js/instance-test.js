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

const setComposition = function () {

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function ( matrix, i ) {

        matrix.decompose( position, quaternion, scale );

        position.x = i%10;
        position.y = Math.floor(i/10)%10;
        position.z = Math.floor(i/100);
        scale.x = scale.y = scale.z = 0.8;

        matrix.compose( position, quaternion, scale );
        console.log(i, position.x, position.y, position.z);
    };

}();

function makeInstanced( geometry, material, scene) {

    const matrix = new THREE.Matrix4();
    const mesh = new THREE.InstancedMesh( geometry, material, 1000 );

    for ( let i = 0; i < 1000; i ++ ) {

        setComposition( matrix, i );
        mesh.setMatrixAt( i, matrix );
        mesh.setColorAt( i, new THREE.Color( 1000*i ) );

    }

    scene.add( mesh );
    return mesh;
}

export { makeInstanced };