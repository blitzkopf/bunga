import * as THREE from 'three';

export const earthRadius = 6731.0;

export function Quake(lat,lon,depth,time,size,verified) {
	this.lat = lat;
	this.lon = lon;
	this.depth = depth;
	this.time = time;
	this.size =size;
	this.verified = verified;
	this.setVisParams = function(currentTime,animParams) {
		if(this.time < currentTime) {
			this.mesh.visible=true;
		} else {
			this.mesh.visible=false;
			return;
		}
		var hours = (currentTime - this.time ) / ( 1000*60*60);
		if (this.size >= 3 && animParams.greenGiant ) {
			this.mesh.material.color.setHex(0x00ff00);
		}
		if ( hours <= 4.0 ) {
			this.mesh.material.color.setHex(0xff0000);
		} else if(hours <= 12) {
			this.mesh.material.color.setHex(0xff6000);
		}
		else if(hours <= 24) {
			this.mesh.material.color.setHex(0xffff00);
		}
		else if(hours <= 36) {
			this.mesh.material.color.setHex(0x3060c0);
		}
		else {
			this.mesh.material.color.setHex(0x000060);
		}
	
		/*  Have yo figure this out later */
		let scale = 1;
		if (this.size >= 3) {
			scale = 1 / Math.min(0.2+hours/5.0,1);

		} else  {
			scale = 1 / Math.min(0.5+hours/5.0,1);
		}
		this.mesh.scale.set(scale,scale,scale); 
	}
}

export function sphere2Cart(lat,lon,r) {
	var phi = THREE.Math.degToRad(lat);
	var theta = THREE.Math.degToRad(90-lon);

	return new THREE.Vector3().setFromSphericalCoords(r,phi,theta );
}

export function cart2Sphere(x,y,z) {
	let res=new THREE.Spherical().setFromCartesianCoords(x,y,z);
	res.phi = THREE.Math.radToDeg( res.phi);
	res.theta = 90 - THREE.Math.radToDeg( res.theta);

	return res;
}

export function calculatePositions(qList,animParams) {
	var params={};
	var M=0;
	//var mr = vec3.create([0,0,0]);
	var mr= new THREE.Vector3(0,0,0);

	for(var i in qList) {
		var q  = qList[i];

		//qList[i].pos = sphere2Cart(q.lat, q.lon, earthRadius - animParams.depthScale*q.depth)
		qList[i].pos = sphere2Cart(q.lat,q.lon,earthRadius - animParams.depthScale*q.depth);
		//new THREE.Vector3().setFromSpherical(new THREE.Spherical(earthRadius - animParams.depthScale*q.depth,THREE.Math.degToRad( q.lat) , THREE.Math.degToRad( q.lon)));


		if(q.time < params.firstTime || params.firstTime == null) {
			params.firstTime=q.time;
		}
		if(q.time > params.lastTime || params.lastTime == null) {
			params.lastTime=q.time;
		}
		M += q.size;
		//vec3.add(mr,[q.pos[0]*q.size,q.pos[1]*q.size,q.pos[2]*q.size]);
		mr.addScaledVector(q.pos,q.size);

	}
	/*params.centerOfMass=[
		mr[0]/M,
		mr[1]/M,
		mr[2]/M,
	]*/
	mr.divideScalar(M);
	params.centerOfMass=mr;

	params.duration = params.lastTime - params.firstTime;
	qList.sort(function(a,b){return b.time-a.time});
	return params;
}
