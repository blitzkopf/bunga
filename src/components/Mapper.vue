<template>
    <div id="mapid"/>
</template>

<script type="ts">
import * as L from 'leaflet';
import { mapState } from 'vuex';
import {cart2Geo } from '../utils/quake'

export default {
  name: 'Mapper',
  props: {
    lat: Number,
    lon: Number
  },
  methods: {
    loaded: function() {
      if(typeof this.canvas === 'undefined') {
        this.canvas = document.createElement('canvas');
        this.canvas.height=1024;
        this.canvas.width=1024;
      } 
      var ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var x  = document.getElementsByClassName("leaflet-tile-container");
      var imgs = x[0].getElementsByTagName("img");
      for( let img of imgs ) {
        let pos=img._leaflet_pos;
        ctx.drawImage(img,pos.x,pos.y);
      }

      this.$emit('mapLoaded',this.canvas,this.mymap);
    },

    mapsetup: function(mapView) {
    /* this.div = document.createElement('div');
      this.div.height=512;
      this.div.width=512;*/
      console.log(`initial postion  ${mapView.lat} ${mapView.lon} `);

      this.mymap = L.map('mapid', {
        renderer: L.canvas()
      }).setView([mapView.lat,mapView.lon], 9);
       
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
     L.tileLayer('https://689gkroy78.execute-api.eu-west-1.amazonaws.com/test/geoserver/www/imo_basemap_epsg3857/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://vedur.is">Icelandic Met Office 2019</a> | National Land Survey of Iceland 2019 | © OpenStreetMap contributors',
          //id:'EPSG:3857',
          //layers:'LMI_Kort_3857',
          //layers:'LMI_hillshade,LMI_Kort,Ornefni_an_mannvirkja',
          tileSize: 256,
          //zoomOffset: -2,
          crossOrigin: "anonymous"
      } 
      ).addTo(this.mymap).on('load',this.loaded);
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

    
    } ,
    rePosition: function(mapView) {
      console.log(`repostion  ${mapView.lat} ${mapView.lon} `);

      this.mymap.setView([mapView.lat,mapView.lon], 9);  
    }

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
#mapid { 
  height: 1024px; 
  width: 1024px ; 
  transform: scale(0);
  position: absolute;
  /*visibility: hidden;*/
  /* display: none; */
}
</style>
