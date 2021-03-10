<template>
  <div id="app">
    <TimeDisplay msg="Welcome" :time="time" /> 
    <Bunga  @time="updateTime" />
    <Playbar />
  </div>
</template>

<script>
import Bunga from './components/Bunga.vue'
import TimeDisplay from './components/TimeDisplay.vue'
import Playbar from './components/Playbar.vue'

import VueGtag from "vue-gtag";
import Vue from 'vue'
import { Slider ,Field } from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Slider)
Vue.use(Field)

Vue.use(VueGtag, {
  config: { id: "G-00K6EYE0VE" }
});

export default {
  name: 'App',
  data: function() {
    return {
      time: ""
    };
  },
  components: {
    Bunga,
    TimeDisplay,
    Playbar
  },  
  methods: {
    updateTime(variable) {
      this.time= variable;
    }
  }
}
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
