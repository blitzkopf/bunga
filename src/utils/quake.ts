import * as THREE from 'three';

export const earthRadius = 6731.0;

export class Quake {
	lat:number;
	lon:number;
	depth:number;
	time:number;
	size:number;
	verified:boolean;
	quality:number;
	loc_info:object;
	mesh:any;
	pos:any;

	constructor (lat:number,lon:number,depth:number,time:number,size:number,
		verified:boolean,quality:number,loc_info:object) 
	{
		this.lat = lat;
		this.lon = lon;
		this.depth = depth;
		this.time = time;
		this.size =size;
		this.verified = verified;
		this.loc_info = loc_info;
		this.quality = quality;

	}
	setVisParams(currentTime:number,animParams:any) {
		if(this.time < currentTime) {
			this.mesh.visible=true;
		} else {
			this.mesh.visible=false;
			return;
		}
		const hours = Number(currentTime - this.time ) / ( 1000*60*60);
		if (this.size >= 3 && animParams.greenGiant ) {
			this.mesh.material.color.setHex(0x00ff00);
		}
		
		if ( hours <= 0.2 ) {
			this.mesh.material.color.setHex(0xffffff);
		} else if ( hours <= 4.0 ) {
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
		/*let scale = 1;
		if (this.size >= 3) {
			scale = 1 / Math.min(0.2+hours/5.0,1);

		} else  {
			scale = 1 / Math.min(0.5+hours/5.0,1);
		}
		this.mesh.scale.set(scale,scale,scale);*/ 
	}
}

export function loadQuakesRasmus( data:any ,animParams:any) {
	const quakes=[];
	for (const q of  data.items) {
		if (q.size > 0){
			quakes.push(new Quake(q.lat,q.long,q.depth,q.date*1000,q.size,q.verified,q.quality,{ dir:q.loc_dir, dist:q.loc_dist, name:q.loc_name }));
		}
	}
	return processQuakes(quakes,animParams)
}
export function loadQuakesSkjalftalisa( input:any,animParams:any) {
	const data = input.data;
	const quakes=[];
	for (let i = 0; i < data.event_type.length; i++) { 

		if (data.magnitude[i] > 0){
			//quakes.push(new Quake(q.lat,q.long,q.depth,q.date*1000,q.size,q.verified,q.quality,{ dir:q.loc_dir, dist:q.loc_dist, name:q.loc_name }));
			quakes.push(new Quake(data.lat[i],data.long[i],data.depth[i],
				data.time[i]*1000,data.magnitude[i],false/* q.verified*/ ,0 /*q.quality*/,
				{} /*{ dir:q.loc_dir, dist:q.loc_dist, name:q.loc_name }*/));
		}
	}
	return processQuakes(quakes,animParams)
}

function processQuakes(quakes: Quake[],animParams:any) {
	const qParams=calculatePositions(quakes,animParams);
	/* figure out how to get this out of state */
	//const hour = 60*60;
	//const times = [0, 4*hour, 12*hour, 24*hour, 36*hour, 48*hour];
	//const values = [0, 1, 0, 1, 0];
	//const cValues = [0,1,0, 1,0,0, 1,0.4,0 , 1,1,0, .2,.4,.8 , 0,0,.4];
	//const bValues=  [false,true,true,true,true,true];

	//const opacityKF = new THREE.NumberKeyframeTrack('.material.opacity', times, values);
	/*let colorKF = new THREE.ColorKeyframeTrack (".material.color",times,cValues,THREE.InterpolateSmooth)
	let visKF =   new THREE.BooleanKeyframeTrack (".visible",times,bValues,THREE.InterpolateDiscrete)*/
	/*let moveBlinkClip = new THREE.AnimationClip('quake-age', -1, [
		colorKF,
		visKF
		//opacityKF
		]);*/

	for(const q of quakes) {
		const g = new THREE.IcosahedronGeometry(q.size * animParams.sizeMultiplier,4);
		const m = new THREE.MeshLambertMaterial({color: 0xffffff }).clone();
		const s:any = new THREE.Mesh(g,m);
		/* let mixer = new THREE.AnimationMixer(s);
		const times = [q.date , q.date+4*hour, q.date+12*hour, q.date+24*hour, q.date+36*hour, q.date+48*hour];
		let colorKF = new THREE.ColorKeyframeTrack (".material.color",times,cValues,THREE.InterpolateSmooth)
		let visKF =   new THREE.BooleanKeyframeTrack (".visible",times,bValues,THREE.InterpolateDiscrete)
		let moveBlinkClip = new THREE.AnimationClip('quake-age', -1, [
			colorKF,
			visKF
			//opacityKF
			]);
		let action = mixer.clipAction(moveBlinkClip);
			
		s.visible = true;
		action.play();
		*/
		s.position.copy(q.pos);
		/* Achtung : Typescript is not happy */
		s.quake=q;
		q.mesh = s;
		//q.mixer = mixer;

	}
	return {quakes:quakes,qParams:qParams};
		
}

export function geo2Cart(lat:number,lon:number,r:number) {
	const polar =THREE.MathUtils.degToRad(90 - lat);// phi
	const azim = THREE.MathUtils.degToRad(lon); // theta

	return new THREE.Vector3().setFromSphericalCoords(r,polar,azim );
}

export function cart2Geo(x:number,y:number,z:number) {
	const res=new THREE.Spherical().setFromCartesianCoords(x,y,z);

	const latitude = 90 - THREE.MathUtils.radToDeg( res.phi) ;
	const longitude = THREE.MathUtils.radToDeg( res.theta);
	
	return {lat: latitude, lon:longitude,r:res.radius};
}

export function calculatePositions(qList:Quake[],animParams:any) {
	const params:any={};
	let M=0;
	//var mr = vec3.create([0,0,0]);
	const mr= new THREE.Vector3(0,0,0);

	for(const q of qList) {

		//qList[i].pos = sphere2Cart(q.lat, q.lon, earthRadius - animParams.depthScale*q.depth)
		q.pos = geo2Cart(q.lat,q.lon,earthRadius - animParams.depthScale*q.depth);
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
	qList.sort((a,b)=>{return Number(b.time-a.time)});
	return params;
}
