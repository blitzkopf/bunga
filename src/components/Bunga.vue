<template>
  <div id="container" ref="container" class="content" >
    <o-sidebar
      :open = "true"
      v-show = "showDetail"
      :fullheight="false"
      :overlay="false"
      :right="true"
    >
    <div> 
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
</div>
    </o-sidebar>
    <Mapper ref="mapper" @mapLoaded="loadMapHandler"/>
    <Controls @quakesLoaded="quakesLoaded"/> 
  <div id="footer" class="content has-text-centered" >
    <span class="credit-list">Created by <a href="mailto:blitzkopf@gmail.com">Yngvi Þór</a> using Three.js, data provided by <a href="http://www.rasmuskr.dk" target="_blank">RasmusKr</a> and <a href="https://www.vedur.is/"> Veðurstofa Íslands </a></span>
  <span   v-html="attribution" ></span> 
  </div>
  </div>
</template>

<script lang="ts" >
import { defineComponent, watch }  from 'vue'
import * as THREE from 'three';
import * as L from 'leaflet';
import Mapper from './Mapper.vue'
import Controls from './BungaControls.vue'
import {cart2Geo, Quake } from '../utils/quake'

/*Vue.use(Sidebar);
Vue.use(Mapper);*/

//import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';
//import  { TrackballControls}  from 'three-controls';
import  { TrackballControls}  from 'three/examples/jsm/controls/TrackballControls';

import { earthRadius } from '../utils/quake'
import { loadMap } from '../utils/map'

//import { useStore } from '../store'
import { ActionTypes } from '../store/actions'
import { MutationType } from '../store/mutations';
//import { QuakeParams } from '../store/state';
import { useAnimParams } from '@/store/anim_params';
import { useQuakeParams , QuakeParams} from '@/store/quake_params';

//import { Mapper } from 'vuex';

let quakes:Quake[] = []

export default  defineComponent({
  name: 'BungaBunga',
  data() {
    return {
        showDetail: false,
        qDetail: {loc_info:{name:''}},
        attribution: '',
    }
  },
  components: {
    Mapper,
    Controls 
    //Sidebar
  },
  setup() {
      //const store = useStore();
      const anim_params = useAnimParams();
      const quake_params = useQuakeParams();


      //const container = ref<HTMLDOMElement>()

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );

      document.body.appendChild( renderer.domElement );
      //container!.appendChild( renderer.domElement );

      //document.addEventListener( 'mousemove', this.mouseMove, false );
      const controls = new TrackballControls( camera as THREE.Camera , renderer.domElement );
      //controls.addEventListener( 'change', this.onChange  );

      const gearth = new THREE.SphereGeometry(earthRadius, 360, 180 );
      const wireframe = new THREE.WireframeGeometry( gearth );
      const mearth = new THREE.LineBasicMaterial( { color: 0x900090, linewidth: .5});
      //this.earth  = new THREE.Line( gearth, mearth );
      const earth  = new THREE.Line( wireframe, mearth );

      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
      scene.add( directionalLight );
      const ambiLight = new THREE.AmbientLight( 0x909090 ); // soft white light
      scene.add( ambiLight );

      scene.add( earth );
      const raycaster = new THREE.Raycaster();
      const mouse =  new THREE.Vector2();

      const qGroup = new THREE.Group();
      var texture:any = null;

      const last_intersect:THREE.Intersection<THREE.Mesh>|null = null;

      watch(() => anim_params.mapdepth, 
        (newValue,oldValue) => {
          console.log(`value changes detected via vuex watch ${oldValue} -> ${newValue}`);
          const plane = earth.getObjectByName('plane');
          if(plane) {
            const scale = 6731 + Number(newValue);
            plane.scale.set(scale,scale,scale);
          }
        });
      const setCamera= () => {
        //const store=useStore();
        camera.position.copy ( new THREE.Vector3(-20,50,50).add(quake_params!.centerOfMass!) );
        camera.up.copy(quake_params!.centerOfMass!.clone().normalize());	
        camera.lookAt(quake_params!.centerOfMass!);

        controls.target.copy(quake_params!.centerOfMass!);
        controls.update();
        //threeData.controls!.enablePan = false;
        //threeData.controls!.enableDamping = true;
      };
    const quakesLoaded = (qdata:{quakes:Quake[],qParams:QuakeParams}) =>{
          for ( const q of quakes ) {
            qGroup.remove(q.mesh)
            q.mesh.material.dispose();
            //q.mesh.dispose();
          }
          quakes=qdata.quakes;
          /*store.commit(MutationType.SaveQuakeParams,qdata.qParams);*/
          quake_params.setQuakeParams(qdata.qParams);
          for( const  q of quakes) {
            qGroup.add(q.mesh);
          }
          earth.add(qGroup);
          setCamera();
          console.log(`first time  ${quake_params.firstTime}`);
          anim_params.animTime=quake_params.firstTime;
        }
      const keyHandler = (e:KeyboardEvent) => {
        console.log("keypress:"+e.code);
        if( e.code === "PageDown") {
          store.commit(MutationType.AdjustMapdepth,-.5);
        } else if( e.code === "PageUp") {
          store.commit(MutationType.AdjustMapdepth,.5);
        }
      }
      window.addEventListener('keydown', keyHandler);
    /* Where should this go ? 
      beforeDestroy() {
      window.removeEventListener('keyup', this.handler);
    } */
      return {scene,camera,renderer,controls,earth,mouse, raycaster, qGroup, 
        texture,last_intersect,setCamera,quakesLoaded,quake_params,anim_params};
  },
  methods: {
    init: function() {
      //const store = useStore();
     
      document.addEventListener( 'mousemove', this.mouseMove, false );

      this.controls.addEventListener( 'change', this.onChange  );
      // this.$store.commit(MutationType.StartTime);
      const anim_params = useAnimParams();

      anim_params.startTime();

      //camera.position.z = earthRadius+10;
      //camera.position.addVectors ( qParams.centerOfMass, new THREE.Vector(10,0,0));

    },
    loadMapHandler: function(canvas:HTMLCanvasElement,map:L.Map) {
      let attr='';
      // ACHTUNG: Check attribution
      // map.eachLayer(function(layer)  {attr =layer.getAttribution();});
      this.attribution = attr;
      this.texture=loadMap(this.earth,canvas,map);
    },
    
    mouseMove(event:THREE.Event) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },
    onChange ( event:THREE.Event ) {
        console.log("Target:"+event.target.target.x);
        /*const g = new THREE.IcosahedronGeometry(1,6);
        const m = new THREE.MeshLambertMaterial({color: 0xffffff }).clone();
        const s:any = new THREE.Mesh(g,m);
        s.position.copy(event.target.target);
        this.earth.add(s);
*/
        //this.scene.remove(this.texture)
        //this.texture.material.dispose();
        /*const  selectedObject = this.earth.getObjectByName('kort');
        if(selectedObject) {
          this.earth.remove( selectedObject );
          selectedObject.clear(); 
        }*/
        //event;
        // ACHTUNG: where is the mapper? Hér ætti að elta viewið
        (this.$refs.mapper as typeof Mapper).rePosition(cart2Geo(event.target.target.x,event.target.target.y,event.target.target.z));
        /*if(typeof this.texture !== 'undefined') {
          this.texture.needsUpdate = true;
        }*/
        //(this.$refs.mapper as typeof Mapper).mapsetup(cart2Geo(event.target.target.x,event.target.target.y,event.target.target.z));
    }, 
    animate: function () {
      requestAnimationFrame( this.animate );
      //if('centerOfMass' in  this.$store.state.qParams 
      //  && typeof this.$store.state.qParams.centerOfMass === 'object')
      //const store = useStore();  
      if(this.quake_params.ready)
      {
        this.anim_params.newFrame();
        


        //let quakes = quakes;
        for(const q of quakes) {
          q.setVisParams(this.anim_params.animTime,this.anim_params);
          //q.mesh.material.update();
          //q.mixer.setTime(animTime.getTime()/1000);         
        }
        //		if(! qParams.centerOfMass === undefined) {
        //		}
        this.controls.update();
        this.camera.up.copy(this.camera!.position.clone().normalize());	

        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        const intersects:any[] = this.raycaster.intersectObjects( this.qGroup.children );

        if(intersects.length > 0 && this.last_intersect != intersects[0]) {
          intersects[ 0 ].object.material.color.set( 0xffffff );
          this.qDetail = intersects[0].object.quake;
          this.showDetail = true;
          intersects[ 0 ].object.material.color.set( 0xffffff );
          this.last_intersect = intersects[0];
        } else {
          this.showDetail = false;
          this.last_intersect = null ;
        }
        /*		earth.rotation.x += 0.00001;
        earth.rotation.y += 0.00001;*/
        //camera.position.addVectors ( qParams.centerOfMass,	 new THREE.Vector3(0.1,0.1,0));
        //camera.lookAt(earth.localToWorld(qParams.centerOfMass.clone()));
        //COM.getWorldPosition()
      }
      this.renderer.render(this.scene! /*as THREE.Object3D*/, this.camera!);
      
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
  z-index:-1;

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
