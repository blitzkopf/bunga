import {   cart2Sphere, sphere2Cart } from '../utils/quake.js'
import * as THREE from 'three';

// instantiate a loader
//const loader = new THREE.TextureLoader();
const loader = new THREE.ImageBitmapLoader();

export function loadMap(earth) {
	let depth=6731-4
	let box= {
			"p1": [64.25,-24.88], // nv
			"p2": [62.9,-24.6],   // sv
			"p3": [64.35,-21.1],  // ne
			"p4": [63.0,-21.0]    // se
		};
	let	p1 = sphere2Cart(box.p1[0],box.p1[1],1);
	let p2 = sphere2Cart(box.p2[0],box.p2[1],1);
	let p3 = sphere2Cart(box.p3[0],box.p3[1],1);
	let p4 = sphere2Cart(box.p4[0],box.p4[1],1);
	/*let vertices = new Float32Array( [
	     p3.x,  p3.y,  p3.z,
         p4.x,  p4.y,  p4.z,
         p2.x,  p2.y,  p2.z,

		 p2.x,  p2.y,  p2.z,
		 p1.x,  p1.y,  p1.z,
	     p3.x,  p3.y,  p3.z,
	]);*/
	let vertices = [
		p1.x,  p1.y,  p1.z,
		p2.x,  p2.y,  p2.z,
		p3.x,  p3.y,  p3.z,
		p4.x,  p4.y,  p4.z,
	];
    // load a resource
    loader.load(
        // resource URL
        require('../assets/reykjaneshryggur.png'),
        //'test.jpg',
        // onLoad callback
        function ( imageBitmap ) {
            const texture = new THREE.CanvasTexture( imageBitmap );
            
    /*	// onLoad callback
        function ( texture ) {*/
            // in this example we create the material when the texture is loaded
            const material = new THREE.MeshBasicMaterial( {
                map: texture,
                opacity: 0.6,
                transparent: true,
                side: THREE.DoubleSide 
            } );
            //let geometry = new THREE.PlaneGeometry( 5, 20, 32 );
            const geometry = new THREE.PolyhedronGeometry( vertices, [2,3,1 , 1,0,2 ], depth, 4 );
            let pos = geometry.getAttribute('position');
            let uv = new Float32Array(pos.count * 2);
            for( let i=0;i<pos.count;i++) {
                let p = cart2Sphere(pos.array[3*i],pos.array[3*i+1],pos.array[3*i+2]);
                let u = (p.phi - 64.35) / ( 62.9 - 64.35);
                let v = (p.theta - -24.88) / ( -21.0 - -24.88);
                uv[2*i ] = v;
                uv[2*i +1] = u;

            }
            geometry.setAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
            
            //let geometry = new THREE.BufferGeometry();
            // itemSize = 3 because there are 3 values (components) per vertex
            //geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            let plane = new THREE.Mesh( geometry, material );
            //plane.position.copy(qParams.centerOfMass);
            earth.add( plane );
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' + err );
        }
    );
}