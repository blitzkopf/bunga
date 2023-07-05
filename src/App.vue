<template>
  <div id="app">
    <Bunga />
    <BungaPlaybar />
  </div>
</template>

<script setup lang="ts">

import Bunga from './components/Bunga.vue'
//import TimeDisplay from './components/TimeDisplay.vue'
import BungaPlaybar from './components/BungaPlaybar.vue'

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0 !important;
  border: none;
}
body {
  margin: 0 !important;
}
</style>
