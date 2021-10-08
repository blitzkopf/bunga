<template>
  <div id="container" class="content">
    <o-sidebar
      :open = "showDetail"
      type="is-light"
      :fullheight="false"
      :fullwidth="false"
      :overlay="false"
      :right="true"
    >
   <h3>Skjálfti</h3>
   <table>
    <tbody>
      <tr> <td class="qi-desc">Dags</td> <td class="qi-detail">{{ new Date(qDetail.time ).toLocaleString('en-GB')}}</td></tr>
      <tr> <td class="qi-desc">Breidd</td> <td class="qi-detail">{{ qDetail.lat  }}</td></tr>
      <tr> <td class="qi-desc">Lengd</td> <td class="qi-detail">{{ qDetail.lon }}</td></tr>
      <tr> <td class="qi-desc">Dýpi</td> <td class="qi-detail">{{ qDetail.depth }}</td></tr>
      <tr> <td class="qi-desc">Stærð</td> <td class="qi-detail">{{ qDetail.size  }}</td></tr>
      <!-- <tr> <td class="qi-desc">Staður</td> <td class="qi-detail">{{qDetail.loc_info.dist}} km {{qDetail.loc_info.dir}} {{qDetail.loc_info.name}}</td></tr> -->
      <tr> <td class="qi-desc">Gæði</td> <td class="qi-detail">{{ qDetail.quality }}</td></tr>

    </tbody>
  </table>

    </o-sidebar> 
    <Mapper ref="mapper" @mapLoaded="loadMapHandler"/>
  <div id="footer" class="content has-text-centered" >
    <span class="credit-list">Created by <a href="mailto:blitzkopf@gmail.com">Yngvi Þór</a> using Three.js, data provided by <a href="http://www.rasmuskr.dk" target="_blank">RasmusKr</a> and <a href="https://www.vedur.is/"> Veðurstofa Íslands </a></span>
  <span   v-html="attribution" /> 
  </div>
    </div>
</template>

<script lang="ts" >
import { defineComponent }  from 'vue'
import * as THREE from 'three';
import * as L from 'leaflet';
import Mapper from './Mapper.vue'
import {/*cart2Geo,*/ Quake } from '../utils/quake'
import { useStore } from '../store'
import { ActionTypes } from '../store/actions'


/*Vue.use(Sidebar);
Vue.use(Mapper);*/

//import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
//import  { TrackballControls}  from 'three-controls';
import  { TrackballControls}  from 'three/examples/jsm/controls/TrackballControls';

import { earthRadius , loadQuakesSkjalftalisa} from '../utils/quake'
import { loadMap } from '../utils/map'
import  apiClient from '../dataloads'
//import { Mapper } from 'vuex';

interface THREEData {
        scene:THREE.Scene;
        camera:THREE.PerspectiveCamera;
        renderer:THREE.WebGLRenderer;
        earth:THREE.Line;
        last_intersect: THREE.Intersection<THREE.Mesh>|null ;
        qGroup: THREE.Group;
        raycaster: THREE.Raycaster;
        mouse: THREE.Vector2;
        controls: TrackballControls;
        texture: THREE.Texture;
}
const threeData = {          
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2()
} as Partial<THREEData>;

let quakes:Quake[] = []

export default  defineComponent({
  name: 'Bunga',
  data() {
    return {
        showDetail: false,
        qDetail: {loc_info:{name:''}},
        attribution: '',
        //quakes: [] as Quake[],
        /*three: {
          raycaster: new THREE.Raycaster(),
          mouse: new THREE.Vector2()
        } as Partial<OptionalData>*/
    }
  },
  /*props: {
    scene: {
      type: THREE.Scene,
      required: true
    },
    camera: {
      type: THREE.Camera,
      required: true
    },
    renderer: {
      type: THREE.WebGLRenderer,
      required: true
    },

  },*/
  components: {
    Mapper, 
    //Sidebar
  },  
  methods: {
    init: function() {
      const store = useStore();
      //var timeDelta;
      //let container = document.getElementById('container');

      threeData.scene = new THREE.Scene();
      threeData.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

      threeData.renderer = new THREE.WebGLRenderer();

      threeData.renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( threeData.renderer.domElement );
      document.addEventListener( 'mousemove', this.mouseMove, false );


      //Vue.axios.get('earthquakes/',{params:{date:'72-hoursago'}}).then( result=> {
      //        return loadQuakesRasmus(result.data,this.$store.state.animParams);  
      let now = new Date();
      let three_days_ago = new Date();
      three_days_ago.setTime(now.getTime()-7*24*60*60*1000);

      console.log(this);
      apiClient.post('/array',{
          //"start_time":three_days_ago.toISOString().substring(0,19).replace('T',' '),
          //"end_time":now.toISOString().substring(0,19).replace('T',' '),
          //"start_time":"2021-03-05 21:30:00",
          //"end_time":"2021-03-19 21:30:00",
          "start_time":"2014-08-13 21:30:00",
          "end_time":"2014-08-30 21:30:00",
          //"start_time":"2010-04-07 21:30:00",
          //"end_time":"2010-04-14 23:30:00",

          "depth_min":0,"depth_max":25,"size_min":0,"size_max":18,
          "magnitude_preference":["Mlw","Autmag"],"event_type":["qu"],"originating_system":["SIL picks"],
          "area":[[68,-32],[61,-32],[61,-4],[68,-4]],
          "fields":["event_id","lat","long","depth","time","magnitude","event_type","originating_system"]
        })
        .then( result=> {
          console.log(this);
          return loadQuakesSkjalftalisa(result.data,store.state.animParams);
        })
        .then(qdata => {
          quakes=qdata.quakes;
          this.$store.commit('SAVE_QUAKE_PARAMS',qdata.qParams);
          threeData.qGroup = new THREE.Group();
          for( const  q of quakes) {
            threeData.qGroup.add(q.mesh);
          }
          threeData.earth!.add(threeData.qGroup);
          this.setCamera();

        }) /*.
        catch(error => {
          throw new Error(`API ${error}`);
        })*/;

      //const controls = new OrbitControls( camera, renderer.domElement );
      threeData.controls = new TrackballControls( threeData.camera as THREE.Camera , threeData.renderer.domElement );
      threeData.controls.addEventListener( 'change', this.onChange  );

      var gearth = new THREE.SphereGeometry(earthRadius, 360, 180 );
      const wireframe = new THREE.WireframeGeometry( gearth );
      var mearth = new THREE.LineBasicMaterial( { color: 0x900090, linewidth: .5});
      //this.earth  = new THREE.Line( gearth, mearth );
      threeData.earth  = new THREE.Line( wireframe, mearth );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
      threeData.scene.add( directionalLight );
      const ambiLight = new THREE.AmbientLight( 0x909090 ); // soft white light
      threeData.scene.add( ambiLight );

      threeData.scene.add( threeData.earth );
    
      //loadDataRasmuskr("http://isapi.rasmuskr.dk/api/earthquakes/?date=72-hoursago",this.addQuakes);

      //this.timeStart = new Date().getTime();
      this.$store.commit('START_TIME');

      //camera.position.z = earthRadius+10;
      //camera.position.addVectors ( qParams.centerOfMass, new THREE.Vector(10,0,0));

    },
    loadMapHandler: function(canvas:HTMLCanvasElement,map:L.Map) {
      let attr='';
      // ACHTUNG: Check attribution
      // map.eachLayer(function(layer)  {attr =layer.getAttribution();});
      this.attribution = attr;
      threeData.texture=loadMap(threeData.earth!,canvas,map);
    },
    setCamera: function() {
        const store=useStore();
        threeData.camera!.position.copy ( new THREE.Vector3(-20,50,50).add(store.state.quakeParams!.centerOfMass!) );
        threeData.camera!.up.copy(store.state.quakeParams!.centerOfMass!.clone().normalize());	
        threeData.camera!.lookAt(store.state.quakeParams!.centerOfMass!);

        threeData.controls!.target.copy(store.state.quakeParams!.centerOfMass!);
        threeData.controls!.update();
        //threeData.controls!.enablePan = false;
        //threeData.controls!.enableDamping = true;
    },
    mouseMove(event:THREE.Event) {
      threeData.mouse!.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      threeData.mouse!.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },
    onChange ( event:THREE.Event ) {
        console.log("Target:"+event.target.target.x);
        //event;
        // ACHTUNG: where is the mapper? Hér ætti að elta viewið
        /*(this.$refs["mapper"] as typeof Mapper).rePosition(cart2Geo(event.target.target.x,event.target.target.y,event.target.target.z));
        if(typeof this.texture !== 'undefined') {
          this.texture.needsUpdate = true;
        }*/
    }, 
    animate: function () {
      requestAnimationFrame( this.animate );
      //if('centerOfMass' in  this.$store.state.qParams 
      //  && typeof this.$store.state.qParams.centerOfMass === 'object')
      const store = useStore();  
      if(store.state.ready)
      {

        store.dispatch(ActionTypes.newFrame);

        //let quakes = quakes;
        for(const q of quakes) {
          q.setVisParams(store.state.animParams.animTime,store.state.animParams);
          //q.mesh.material.update();
          //q.mixer.setTime(animTime.getTime()/1000);         
        }
        //		if(! qParams.centerOfMass === undefined) {
        //		}
        threeData.controls!.update();
        threeData.camera!.up.copy(threeData.camera!.position.clone().normalize());	

        // update the picking ray with the camera and mouse position
        threeData.raycaster!.setFromCamera( threeData.mouse!, threeData.camera! );

        // calculate objects intersecting the picking ray
        const intersects:any[] = threeData.raycaster!.intersectObjects( threeData.qGroup!.children );

        if(intersects.length > 0 && threeData.last_intersect != intersects[0]) {
          intersects[ 0 ].object.material.color.set( 0xffffff );
          this.qDetail = intersects[0].object.quake;
          this.showDetail = true;
          intersects[ 0 ].object.material.color.set( 0xffffff );
          threeData.last_intersect = intersects[0];
        } else {
          this.showDetail = false;
          threeData.last_intersect = null ;
        }
        /*		earth.rotation.x += 0.00001;
        earth.rotation.y += 0.00001;*/
        //camera.position.addVectors ( qParams.centerOfMass,	 new THREE.Vector3(0.1,0.1,0));
        //camera.lookAt(earth.localToWorld(qParams.centerOfMass.clone()));
        //COM.getWorldPosition()
      }
      threeData.renderer!.render(threeData.scene! /*as THREE.Object3D*/, threeData.camera!);
      
    }
  },
  /*created() {
    this.$store.dispatch('loadQuakes');
  },*/
  mounted() {
      this.init();
      this.animate();
  }
});

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
  font-weight: bold;
}
.qi-detail {
  text-align: right;
}
#footer {
    position: fixed;
    bottom: 0;
    width: 100%;
}
</style>
