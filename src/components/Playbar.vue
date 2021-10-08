<template>
    <section id="slider">
        <!-- <b-field id="timer" v-bind:label="displayTime">
            <b-slider v-model="animTime" :custom-formatter="(val) => formatTime(val)" :tooltip="false" indicator  locale="en-GB"
                v-bind:min="firstTime" v-bind:max="lastTime"></b-slider>
        </b-field> -->
    <o-field id="timer" v-bind:label="displayTime">
      <o-slider v-model="animTime"  :custom-formatter="val => formatTime(val)"
                v-bind:min="firstTime" v-bind:max="lastTime"
                :tooltipAlways = "true" position="bottom"></o-slider>
    </o-field>
    </section>
</template>

<script lang="ts">
import { defineComponent ,computed}  from 'vue';
import { useStore } from '../store';
import { MutationType } from '../store/mutations'


function pad(v:number,size?:number):string {
    var s = String(v);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

export default defineComponent({
    name: 'Playbar',
    setup() {
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

        return {store,firstTime,lastTime,displayTime,animTime}
    },
    data() {
        return {
            format: "raw",
            locale: undefined, // Browser locale
        }
    },
    methods: {
        formatTime(dt:number) {
            let d=new Date(dt);
            return pad(d.getHours()) + ':' + pad(d.getMinutes()) ;
        }
    },
});
</script>
<style>
#slider{
	background-color:#000;
	/*z-index:0;*/
	position: relative;
	/*width:600px;*/
	height:0px;
	margin: 0;
}
.o-slider.tooltip-content{
	color:#000;
}
.orderClass{
    position: bottom;
}

#timer .label {
    color:#fff;
} 
</style>
