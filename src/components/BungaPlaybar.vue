<template>
    <section id="slider">
     <o-field id="timer" v-bind:label="displayTime">
      <o-slider v-model="animTime"  :custom-formatter="val => formatTime(val)"
                v-bind:min="firstTime" v-bind:max="lastTime"
                :tooltipAlways = "true" position="bottom"></o-slider>
    </o-field> 
    </section>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { MutationType } from '../store/mutations'
import {  computed } from 'vue'


function pad(v:number,size?:number):string {
    var s = String(v);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
function formatTime(dt:number) {
            let d=new Date(dt);
            return pad(d.getHours()) + ':' + pad(d.getMinutes()) ;
        }

const store = useStore();

//increment: () => store.commit('increment'),
const firstTime=  computed(()=>  {return store.state.quakeParams!.firstTime;});
const lastTime=  computed(()=>  {return store.state.quakeParams!.lastTime; });
const displayTime = computed(()=> {
    return new Date(store.state.animParams.animTime).toLocaleString('en-GB');
});
const animTime = computed({
    get: ()=> store.state.animParams.animTime ,
    set: (value:number)=> { 
        store.commit(MutationType.SetAnimTime,value);
    },
},)

</script>
<style>
#timer{
	background-color:transparent;
    color: white;
	/*z-index:0;*/
    width: 95%;
    top: 18px;
    left: 0;
	position: absolute;
	/*width:600px;*/
	margin: 10;
    /*opacity: 0.7;*/

}
.o-slider.tooltip-content{
	color:#000;
}
.orderClass{
    position: bottom;
}

</style>
