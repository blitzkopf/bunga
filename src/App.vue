<template>
  <div id="app">
    <Bunga  @time="updateTime" />
    <Playbar />
  </div>
</template>

<script lang="ts">

import Bunga from './components/Bunga.vue'
//import TimeDisplay from './components/TimeDisplay.vue'
import Playbar from './components/Playbar.vue'

//import VueGtag from "vue-gtag";
//import  createApp from 'vue'
import { Options, Vue } from 'vue-class-component';

//import { Slider ,Field } from 'buefy/types'
//import 'buefy/dist/buefy.css'

/*const app = new createApp({})*/

/*app.use(Slider)
app.use(Field) */

@Options({
 data: function() {
    return {
      time: ""
    };
  },
  components: {
    Bunga,
    Playbar
  },  
  methods: {
    updateTime(variable: number) {
      this.time= variable;
    }
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  border: none;
}
</style>
