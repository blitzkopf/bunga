<template>
  <div id="container" @mousemove="mouseMove" class="content">
    <b-sidebar
      type="is-light"
      :fullheight="false"
      :fullwidth="false"
      :overlay="false"
      :right="true"
      v-model="showDetail"
    >
   <h3>Skjálfti</h3>
   <table>
    <tbody>
      <tr> <td class="qi-desc">Dags</td> <td class="qi-detail">{{ new Date(qDetail.time ).toLocaleString('en-GB')}}</td></tr>
      <tr> <td class="qi-desc">Breidd</td> <td class="qi-detail">{{ qDetail.lat  }}</td></tr>
      <tr> <td class="qi-desc">Lengd</td> <td class="qi-detail">{{ qDetail.lon }}</td></tr>
      <tr> <td class="qi-desc">Dýpi</td> <td class="qi-detail">{{ qDetail.depth }}</td></tr>
      <tr> <td class="qi-desc">Stærð</td> <td class="qi-detail">{{ qDetail.size  }}</td></tr>
      <tr> <td class="qi-desc">Staður</td> <td class="qi-detail">{{qDetail.loc_info.dist}} km {{qDetail.loc_info.dir}} {{qDetail.loc_info.name}}</td></tr>
      <tr> <td class="qi-desc">Gæði</td> <td class="qi-detail">{{ qDetail.quality }}</td></tr>

    </tbody>
  </table>

    </b-sidebar>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from "axios";
import VueAxios from "vue-axios";
import * as THREE from 'three';
import { Sidebar } from 'buefy';

Vue.use(Sidebar);

//import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
import { TrackballControls } from 'three-controls';

import { earthRadius , loadQuakes} from '../utils/quake.js'
//import { loadDataRasmuskr } from '../utils/data.js'
import { loadMap } from '../utils/map.js'
//import { mapGetters } from 'vuex'

Vue.use(VueAxios,axios);

Vue.axios.defaults.baseURL = "https://isapi.rasmuskr.dk/api/"; // earthquakes/?date=72-hoursago

export default {
  name: 'Bunga', 
  data() {
    return {
        showDetail: false,
        qDetail: {loc_info:{name:''}},
    }
  },
  methods: {
    init: function() {
    
      //var timeDelta;
      //let container = document.getElementById('container');

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      this.renderer = new THREE.WebGLRenderer();

      this.renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( this.renderer.domElement );
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();  
      document.addEventListener( 'mousemove', this.mouseMove, false );


      Vue.axios.get('earthquakes/',{params:{date:'72-hoursago'}}).then( result=> {
        return loadQuakes(result.data,this.$store.state.animParams);
      }).then(qdata => {
        this.quakes=qdata.quakes;
        this.$store.commit('SAVE_QPARAMS',qdata.qParams);
        this.qGroup = new THREE.Group();
        for( const  q of this.quakes) {
          this.qGroup.add(q.mesh);
        }
        this.earth.add(this.qGroup);
        this.setCamera();

      }) /*.
        catch(error => {
          throw new Error(`API ${error}`);
        })*/;

      //const controls = new OrbitControls( camera, renderer.domElement );
      this.controls = new TrackballControls( this.camera, this.renderer.domElement );

      var gearth = new THREE.SphereGeometry(earthRadius, 360, 180 );
      const wireframe = new THREE.WireframeGeometry( gearth );
      var mearth = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 1});
      //this.earth  = new THREE.Line( gearth, mearth );
      this.earth  = new THREE.Line( wireframe, mearth );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
      this.scene.add( directionalLight );
      const ambiLight = new THREE.AmbientLight( 0x909090 ); // soft white light
      this.scene.add( ambiLight );

      this.scene.add( this.earth );
      loadMap(this.earth);

      //loadDataRasmuskr("http://isapi.rasmuskr.dk/api/earthquakes/?date=72-hoursago",this.addQuakes);

      //this.timeStart = new Date().getTime();
      this.$store.commit('startTime');

      //camera.position.z = earthRadius+10;
      //camera.position.addVectors ( qParams.centerOfMass, new THREE.Vector(10,0,0));

    },
    setCamera: function() {
        this.camera.lookAt(this.$store.state.qParams.centerOfMass);
        this.camera.position.copy ( new THREE.Vector3(50,50,-20).add(this.$store.state.qParams.centerOfMass) );
        this.camera.up.copy(this.$store.state.qParams.centerOfMass.clone().normalize());	
        
        this.controls.target.copy(this.$store.state.qParams.centerOfMass);
        this.controls.update();
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.cameraSet = true;
    },
    mouseMove(event) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },
    animate: function () {
      requestAnimationFrame( this.animate );
      if('centerOfMass' in  this.$store.state.qParams)  {
        /*var timeNow;

        timeNow = new Date().getTime();
        //timeDelta = timeNow-timeLast;
        //t1 = ((timeNow - timeStart) % ((animParams.animLength+animParams.finalSceneLength)*1000))/(animParams.animLength*1000);
        let t1 = (timeNow - this.timeStart) / ((this.$store.state.animParams.animLength)*1000);
        if( t1 > 1.0) {
          t1 = 1.0;
        }
        //animTime = new Date(firstQuakeTime.getTime() + t1* duration);
        var animTime = new Date(this.$store.state.qParams.firstTime.getTime() + t1* this.$store.state.qParams.duration);
        this.$store.commit('setTime',animTime); */
        this.$store.commit('newFrame');

        let quakes = this.quakes;
        for(const q of quakes) {
          q.setVisParams(this.$store.state.animTime,this.$store.state.animParams);
          //q.mesh.material.update();
          //q.mixer.setTime(animTime.getTime()/1000);         
        }
        //		if(! qParams.centerOfMass === undefined) {
        //		}
        this.controls.update();
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects( this.qGroup.children );

        if(intersects.length > 0 && this.last_intersect != intersects[0]) {
          intersects[ 0 ].object.material.color.set( 0xffffff );
          this.qDetail = intersects[0].object.quake;
          this.showDetail = true;
          intersects[ 0 ].object.material.color.set( 0xffffff );
          this.last_intersect = intersects[0];
        } else {
          this.showDetail = false;
          this.last_intersect = null;
        }
        /*		earth.rotation.x += 0.00001;
        earth.rotation.y += 0.00001;*/
        //camera.position.addVectors ( qParams.centerOfMass,	 new THREE.Vector3(0.1,0.1,0));
        //camera.lookAt(earth.localToWorld(qParams.centerOfMass.clone()));
        //COM.getWorldPosition()
      }
      this.renderer.render(this.scene, this.camera);
      
    }
  },
  /*created() {
    this.$store.dispatch('loadQuakes');
  },*/
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
#container{
  margin: 0;
}
.qi-desc {
  style: bold;
}
.qi-detail {
  text-align: right;
}
</style>
