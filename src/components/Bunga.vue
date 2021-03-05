<template>
  <div id="container"></div>
</template>

<script>

import * as THREE from 'three';
//import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'three-controls';

import { earthRadius , calculatePositions } from '../utils/quake.js'
import { loadDataRasmuskr } from '../utils/data.js'
import { loadMap } from '../utils/map.js'

var animParams = {
	depthScale: 4.0,
	animLength: 120, // seconds
	finalSceneLength: 30, //seconds
	minQuakeSize: 0 ,//
	sizeMultiplier: .2, //
	mapdepth: -15, // km
	flybyRadius: 150, // degrees
	flybyHeight: -2, //
	lookAtDepth: 5,
	rotationSpeed: -1,
	dispVerifiedOnly: false,
	greenGiant: true,
	};

export default {
  name: 'Bunga', 
  methods: {
    init: function() {
    
      //var timeDelta;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( this.renderer.domElement );
      //const controls = new OrbitControls( camera, renderer.domElement );
      this.controls = new TrackballControls( this.camera, this.renderer.domElement );

      /*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );*/
      var gearth = new THREE.SphereGeometry(earthRadius, 360, 180 );
      var mearth = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 1});
      this.earth  = new THREE.Line( gearth, mearth );



      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
      this.scene.add( directionalLight );
      const ambiLight = new THREE.AmbientLight( 0x909090 ); // soft white light
      this.scene.add( ambiLight );

      this.scene.add( this.earth );

      loadDataRasmuskr("http://isapi.rasmuskr.dk/api/earthquakes/?date=72-hoursago",this.addQuakes);


      this.timeStart = new Date().getTime();

      //camera.position.z = earthRadius+10;
      //camera.position.addVectors ( qParams.centerOfMass, new THREE.Vector(10,0,0));

    },
    addQuakes:  function(data) {
        this.quakes = data;
        this.qParams=calculatePositions(this.quakes,animParams);
        for(let i in this.quakes) {
          let q = this.quakes[i];
          let g = new THREE.IcosahedronGeometry(q.size * animParams.sizeMultiplier,4);
          let m = new THREE.MeshLambertMaterial({color: 0x00ff00 });
          let s = new THREE.Mesh(g,m);
          s.position.copy(q.pos);
          this.quakes[i].mesh = s;
          s.visible = false;
          this.earth.add(s);
        }
        /*var COM = new THREE.Object3D();
        COM.position.set(qParams.centerOfMass);
        earth.add(COM);*/
        loadMap(this.earth);
        this.camera.lookAt(this.qParams.centerOfMass);
        this.camera.position.copy ( new THREE.Vector3(100,0,0).add(this.qParams.centerOfMass) );
        this.camera.up.copy(this.qParams.centerOfMass.clone().normalize());	
        
        this.controls.target.copy(this.qParams.centerOfMass);
        this.controls.update();
        this.controls.enablePan = false;
        this.controls.enableDamping = true;

    },

    animate: function () {
      requestAnimationFrame( this.animate );
      if(this.qParams) {
        var timeNow;


        timeNow = new Date().getTime();
        //timeDelta = timeNow-timeLast;
        //t1 = ((timeNow - timeStart) % ((animParams.animLength+animParams.finalSceneLength)*1000))/(animParams.animLength*1000);
        let t1 = (timeNow - this.timeStart) / ((animParams.animLength)*1000);
        if( t1 > 1.0) {
          t1 = 1.0;
        }
        //animTime = new Date(firstQuakeTime.getTime() + t1* duration);
        var animTime = new Date(this.qParams.firstTime.getTime() + t1* this.qParams.duration);
        this.$emit("time",animTime);
        for(let i in this.quakes) {
          let q = this.quakes[i];
          q.setVisParams(animTime,animParams);
          //q.mesh.material.update();
          
        }
        //		if(! qParams.centerOfMass === undefined) {
        //		}
        this.controls.update();

        /*		earth.rotation.x += 0.00001;
        earth.rotation.y += 0.00001;*/
        //camera.position.addVectors ( qParams.centerOfMass,	 new THREE.Vector3(0.1,0.1,0));
        //camera.lookAt(earth.localToWorld(qParams.centerOfMass.clone()));
        //COM.getWorldPosition()
      }
      this.renderer.render(this.scene, this.camera);
      
    }
  },
  mounted() {
      this.init();
      this.animate();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container{
  margin: 0;
}
</style>
