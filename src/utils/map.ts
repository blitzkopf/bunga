import {   cart2Geo, geo2Cart } from '../utils/quake'
import * as L from 'leaflet';

import * as THREE from 'three';
//import store from '../store'


// instantiate a loader
//const loader = new THREE.TextureLoader();
//const loader = new THREE.ImageBitmapLoader();

let texture:any = null;

export function loadMap(earth:THREE.Object3D,canvas:HTMLCanvasElement,map:L.Map):THREE.Texture
{
	const depth=6731-30
    const pixels = 1024;    
    const box = {
            "p1": map.layerPointToLatLng(L.point(1,1)),     // nv
			"p2": map.layerPointToLatLng(L.point(1,pixels)),   // sv
			"p3": map.layerPointToLatLng(L.point(pixels,1)),   // ne
			"p4": map.layerPointToLatLng(L.point(pixels,pixels)), // se
    }
/*    let box= {
			"p1": [64.25,-24.88], // nv
			"p2": [62.9,-24.6],   // sv
			"p3": [64.35,-21.1],  // ne
			"p4": [63.0,-21.0]    // se
		};*/
	const p1 = geo2Cart(box.p1.lat,box.p1.lng,1);
	const p2 = geo2Cart(box.p2.lat,box.p2.lng,1);
	const p3 = geo2Cart(box.p3.lat,box.p3.lng,1);
	const p4 = geo2Cart(box.p4.lat,box.p4.lng,1);
	/*let vertices = new Float32Array( [
	     p3.x,  p3.y,  p3.z,
         p4.x,  p4.y,  p4.z,
         p2.x,  p2.y,  p2.z,

		 p2.x,  p2.y,  p2.z,
		 p1.x,  p1.y,  p1.z,
	     p3.x,  p3.y,  p3.z,
	]);*/
	const vertices = [
		p1.x,  p1.y,  p1.z,
		p2.x,  p2.y,  p2.z,
		p3.x,  p3.y,  p3.z,
		p4.x,  p4.y,  p4.z,
	];
    if (  /*loadMap.*/texture === null ) {
        /*loadMap.*/texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.MeshBasicMaterial( {
            map: /*loadMap.*/texture,
            opacity: 0.3,
            transparent: true,
            side: THREE.DoubleSide 
        } );

        const geometry = new THREE.PolyhedronGeometry( vertices, [2,3,1 , 1,0,2 ], depth, 4 );

        const pos = geometry.getAttribute('position');
        const uv = new Float32Array(pos.count * 2);
        for( let i=0;i<pos.count;i++) {
            const p = cart2Geo(pos.array[3*i],pos.array[3*i+1],pos.array[3*i+2]);
            /*let u = (p.lat - box.p1.lat) / ( box.p4.lat - box.p1.lat);
            const v = (p.lon - box.p1.lng) / (box.p4.lng - box.p1.lng);*/
            const vu = map.latLngToLayerPoint(L.latLng(p.lat,p.lon));
            uv[2*i ] = vu.x/pixels;
            uv[2*i +1] = 1.0-vu.y/pixels;

        }
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
        
        //let geometry = new THREE.BufferGeometry();
        // itemSize = 3 because there are 3 values (components) per vertex
        //geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const plane = new THREE.Mesh( geometry, material );
        //plane.position.copy(qParams.centerOfMass);
        earth.add( plane );

        /*let ll = this.mymap.layerPointToLatLng(L.point(1,1));
        console.log(`lat : ${ll.lat}  lon:${ll.lng}`);            */
    } 
    else {
        /*loadMap.*/texture.needsUpdate = true;
    }
    return /*loadMap.*/texture;
}