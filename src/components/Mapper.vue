<template>
    <div id="mapid"/>
</template>

<script>
import * as L from 'leaflet';
import { mapState } from 'vuex';

export default {
  name: 'Mapper',
  props: {
    lat: Number,
    lon: Number
  },
  methods: {
    createCanvas: function() {

      var canvas = document.createElement('canvas');
      canvas.height=512;
      canvas.width=512;
      var ctx = canvas.getContext('2d');

      var x  = document.getElementsByClassName("leaflet-tile-container");
      var imgs = x[0].getElementsByTagName("img");
      for( let img of imgs ) {
        let pos=img._leaflet_pos;
        ctx.drawImage(img,pos.x,pos.y);
      }

      this.$emit('mapLoaded',canvas,this.mymap);
    },

    mapsetup: function() {
    /* this.div = document.createElement('div');
      this.div.height=512;
      this.div.width=512;*/
      
      this.mymap = L.map('mapid', {
        renderer: L.canvas()
      }).setView([63.863, -22.338], 9);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/outdoors-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiYmxpdHprb3BmIiwiYSI6ImNrbThpd3Y2eTBlNzAyd3BobXQydTlxbGUifQ.c8CmH2MD4SzV_4HnMAIJlw',
          crossOrigin: "anonymous"
      }).addTo( this.mymap ).on('load',this.createCanvas);
    
    }  

  },
  computed: mapState(['qParams']),
  watch: {
    "$store.state.qParams"(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      if (Object.keys(newValue).length !== 0 ) {
        this.mapsetup();
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
  height: 512px; 
  width: 512px ; 
  transform: scale(0);
  position: absolute;
  /*visibility: hidden;*/
  /* display: none; */
}
</style>
