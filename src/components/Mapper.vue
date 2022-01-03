<template>
    <div id="mapid"/>
</template>

<script lang="ts">
import { defineComponent }  from 'vue'
import * as L from 'leaflet';
import * as THREE from 'three'
import { mapState } from 'vuex';
import {cart2Geo } from '../utils/quake'

export default defineComponent({
  name: 'Mapper',
  props: {
    lat: Number,
    lon: Number
  },
  setup (props,context) {
    const canvas = document.createElement('canvas');
    //const canvas = L.svg();
    canvas.height=2048;
    canvas.width=2048;
    var mymap:L.Map|null = null ;

    const loaded = (ev:THREE.Event) => {  
      console.log(`loaded ${ev.target}`)
      console.log(`mymap.bounds ${mymap?.getBounds()}`)  
      console.log(`mymap.pixelBounds ${mymap?.getPixelBounds()}`)  
      const ctx = canvas.getContext('2d');
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      //<div class="leaflet-pane leaflet-map-pane" style="transform: translate3d(-297px, -24px, 0px);">
      //<div class="leaflet-pane leaflet-tile-pane"><div class="leaflet-layer " style="z-index: 1; opacity: 1;">
      const mapPane:any = mymap?.getPane('mapPane');
      const panePos = mapPane._leaflet_pos
      console.log(`mapPane ${mapPane}`)
      mymap?.eachLayer(function(layer){
        layer.bindPopup('Hello');
        //const x  = document.getElementsByClassName("leaflet-tile-container");
        const container = (layer as L.GridLayer).getContainer();
        if (container) {
          const imgs = container.getElementsByTagName("img");
          //const imgs = container.getElementsByClassName("leaflet-tile-loaded");
          //img.leaflet-tile.leaflet-tile-loaded
          for( let img of imgs ) {
            const hakk:any = img
            const pos=hakk._leaflet_pos;
            ctx!.drawImage(img,pos.x+panePos.x,pos.y+panePos.y);
          }
        }
      });

      context.emit('mapLoaded',canvas,mymap);
    };
   
    const mapsetup = (mapView:{lat: number, lon:number,r:number}) => {
    /* this.div = document.createElement('div');
      this.div.height=512;
      this.div.width=512;*/
      if(mymap === null) {
        mymap = L.map('mapid', {
         
        })
      
        /*L.tileLayer('https://689gkroy78.execute-api.eu-west-1.amazonaws.com/test/geoserver/www/imo_basemap_epsg3857/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://vedur.is">Icelandic Met Office 2019</a> | National Land Survey of Iceland 2019 | © OpenStreetMap contributors',
            //id:'EPSG:3857',
            //layers:'LMI_Kort_3857',
            //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
            tileSize: 256,
            //zoomOffset: -2,
            crossOrigin: "anonymous"
          } */
       L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/outdoors-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiYmxpdHprb3BmIiwiYSI6ImNrbThpd3Y2eTBlNzAyd3BobXQydTlxbGUifQ.c8CmH2MD4SzV_4HnMAIJlw',
          crossOrigin: "anonymous"
       }
        ).addTo(mymap).on('load',loaded).on('change',moveend);
      }
      console.log(`initial postion  ${mapView.lat} ${mapView.lon} `);
      mymap.setView([mapView.lat,mapView.lon], 10);
    };
    const moveend = (ev:THREE.Event) => {
      console.log(`moveend ${ev.target}`)
      context.emit('mapLoaded',canvas,mymap);

    }
    const rePosition = (mapView:{lat: number, lon:number,r:number}) => {
      console.log(`Re postion  ${mapView.lat} ${mapView.lon} `);
      mymap!.setView([mapView.lat,mapView.lon], 10);//.on('moveend',moveend);
      //mymap!.panTo([mapView.lat,mapView.lon]);//.on('moveend',moveend);
      
      //context.emit('mapLoaded',canvas,mymap);
    };

    return {canvas, mymap,mapsetup,rePosition}

  },
  computed: mapState(['qParams']),
  watch: {
    "$store.state.quakeParams"(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      if (Object.keys(newValue).length !== 0 ) {
        this.mapsetup(cart2Geo(newValue.centerOfMass.x,newValue.centerOfMass.y,newValue.centerOfMass.z));
      }
    },
  }
})

/*L.tileLayer('https://gis.lmi.is/geoserver/gwc/service/wmts?SERVICE=WMTS&REQUEST=GetCapabilities', {
          attribution: 'Map data &copy; <a href="https://www.lmi.org/is">Landmælingar Íslands</a>',
          layers:'LMI_Kort_3857',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 1024,
          crossOrigin: "anonymous"
      } 
      ).addTo(this.mymap).on('load',this.createCanvas);
      */

     /*L.tileLayer('https://gis.lmi.is/mapcache/wmts?SERVICE=WMTS&REQUEST=GetCapabilities', {
          attribution: 'Map data &copy; <a href="https://www.lmi.org/is">Landmælingar Íslands</a>',
          layers:'LMI_Kort_3857',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 256,
          crossOrigin: "anonymous"
      } 
       ).addTo(this.mymap).on('load',this.loaded);*/
     
     /*L.tileLayer('https://gis.lmi.is/mapcache/wmts/1.0.0/LMI_Kort_3857/default/{id}/{z}/{y}/{x}.png', {
          attribution: 'Map data &copy; <a href="https://www.lmi.org/is">Landmælingar Íslands</a>',
          id:'EPSG:3857',
          layers:'LMI_Kort_3857',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 256,
          //zoomOffset: -2,

          crossOrigin: "anonymous"
      } 
      ).addTo(this.mymap).on('load',this.loaded);*/
     /*L.tileLayer('https://geo.vedur.is/geoserver/www/imo_basemap_epsg3857/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://vedur.is">Icelandic Met Office 2019</a> | National Land Survey of Iceland 2019 | © OpenStreetMap contributors',
          //id:'EPSG:3857',
          //layers:'LMI_Kort_3857',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 512,
          //zoomOffset: -2,
          crossOrigin: "anonymous"
      } 
      ).addTo(this.mymap).on('load',this.loaded);*/
     /*L.tileLayer('https://689gkroy78.execute-api.eu-west-1.amazonaws.com/test/geoserver/www/imo_basemap_epsg3857/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://vedur.is">Icelandic Met Office 2019</a> | National Land Survey of Iceland 2019 | © OpenStreetMap contributors',
          //id:'EPSG:3857',
          //layers:'LMI_Kort_3857',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 256,
          //zoomOffset: -2,
          crossOrigin: "anonymous"
      } 
      ).addTo(this.mymap).on('load',this.loaded);*/
     /* L.tileLayer('https://gisvi.vedur.is/arcgis/rest/services/grunnkort/grunnkort_cache_isn93/MapServer/tile/{z}/{y}/{x}',{ 
        maxZoom: 13,
        minZoom: 5,
        attribution: "<a href='https://gisvi.vedur.is/arcgis/rest/services/grunnkort/grunnkort_cache_isn93/MapServer'>Veðurstofa Íslands © 2014</a>",
        tileSize: 512,
        noWrap: true,
        continuousWorld: true
      }).addTo(this.mymap).on('load',this.loaded);*/
      
     /* L.tileLayer.wms('https://gis.lmi.is/geoserver/wfs', {
          attribution: 'Map data &copy; <a href="https://www.lmi.org/is">Landmælingar Íslands</a>',
          layers:'Ornefni_an_mannvirkja',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 1024,
          crossOrigin: "anonymous"
      } 
      ).addTo(this.mymap).on('load',this.createCanvas);
    *//*  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/outdoors-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiYmxpdHprb3BmIiwiYSI6ImNrbThpd3Y2eTBlNzAyd3BobXQydTlxbGUifQ.c8CmH2MD4SzV_4HnMAIJlw',
          crossOrigin: "anonymous"
      }).addTo( this.mymap ).on('load',this.createCanvas); */


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
#mapid { 
  height: 2048px; 
  width: 2048px ; 
  transform: scale(0);
  position: absolute;
  /*visibility: hidden;*/
  /* display: none; */
}
</style>
