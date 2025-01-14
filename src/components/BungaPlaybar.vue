<template>
    <div>
    <section id="slider">
     <o-field id="timer" v-bind:label="displayTime">
        <o-slider v-model="anim_params.animTime" :formatter="(val) => formatTime(val)"
                :min="quake_params.firstTime" :max="quake_params.lastTime"
                :tooltipAlways = "true" ></o-slider> 
       
      <!-- <o-slider v-model="animTime"  :custom-formatter="val => formatTime(val)"
                v-bind:min="firstTime" v-bind:max="lastTime"
                :tooltipAlways = "true" position="bottom"></o-slider>-->
    </o-field>
    </section>
    </div>
</template>

<script setup lang="ts">
import { useQuakeParams } from '@/store/quake_params';
import { useAnimParams } from '@/store/anim_params';

import {  computed } from 'vue'
const anim_params = useAnimParams();
const quake_params = useQuakeParams();

function pad(v:number,size?:number):string {
    var s = String(v);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
function formatTime(dt:number):string {
    let d=new Date(dt);
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) ;
}


//increment: () => store.commit('increment'),
const displayTime = computed(()=> {
    return new Date(anim_params.animTime).toLocaleString('en-GB');
    //return anim_params.animTime;
});
/*const animTime = computed({
    get: ()=> store.state.animParams.animTime ,
    set: (value:number)=> { 
        console.log('animTime set ',value);
        //store.commit(MutationType.SetAnimTime,value);
    },
},)*/

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
