<template>
  <div id="controls">
	<o-field>
		<o-switch :value="true" v-model="open">
		hide/show controls
		</o-switch>
    </o-field>
		<!-- <a href="javascript:void(0)" onclick="hide_controls();"> hide/show controls</a>-->
		<div id="innerC" v-show="open">
		<h1>Bunga-Bunga</h1>
		<h2> Earthquake the movie </h2>
		<h3> Earthquakes in Iceland in 3D animation</h3>
		<o-field label="period">
			<o-select @change="handlePresets()" v-model="presetSel">
			<option value="-1"> Now </option>
			<option v-for="(p,i) in presets" v-bind:key="i" v-bind:value="i"> 
				{{p.name}} 
			</option>
			</o-select>
		</o-field>
		<o-field label="start time">
			<o-datetimepicker rounded placeholder="Click to select..." icon="calendar" 
			locale="en-gb" :datepicker="{ 'show-week-number':false }" 
			:timepicker="{ 'enable-seconds':false, 'hour-format':'24' }"
			v-model="startTime">
			</o-datetimepicker>
		</o-field>
		<o-field label="end time">
			<o-datetimepicker rounded placeholder="Click to select..." icon="calendar" 
			locale="en-gb" :datepicker="{ 'show-week-number':false }" 
			:timepicker="{ 'enable-seconds':false, 'hour-format':'24' }"
			v-model="endTime">
			</o-datetimepicker>
		</o-field> 
		<o-button @click="fetch">Play</o-button>
		<!-- <o-field label="Depth of map">
			<o-slider v-model="mapdepth" min="-40" max="1"></o-slider>
		</o-field> -->
		Depth of map:(pgUp/pgDown)<br><input id="mapdepth" type="range" min="-40" max="2" step="1"
			v-model="anim_params.mapdepth" >
		<input type="text" id="mapdepthDisp" editable="false" class="disp" v-model="anim_params.mapdepth"><br>
		<!-- Quake size multiplier: <br><input id="sizeMultiplier" type="range" min="0" max="4" step="0.1" value="0.5"
			onchange="rangeChange(this)" oninput="rangeChange(this)">
		<input type="text" id="sizeMultiplierDisp" editable="false" class="disp"> <br> -->
		Minimum quake size: <br><input id="minQuakeSize" type="range" min="0" max="8" step="0.2"
			v-model="anim_params.minQuakeSize">
		<input type="text" id="minQuakeSizeDisp"  editable="false" class="disp" v-model="anim_params.minQuakeSize"> <br>
		Depth multiplier:(pgUp/pgDown)<br><input id="depthmult" type="range" min="0.5" max="4" step="0.1"
			v-model="anim_params.depthMult" >
		<input type="text" id="depthmultDisp" editable="false" class="disp" v-model="anim_params.depthMult"><br>
	Earthquake age in hours: 
	<table><tbody><tr>	<th style="background-color:#f00; color:white; width:50px">0-4</th>
				<th style="background-color:#f60; color:white; width:50px">4-12</th>
				<th style="background-color:#ff0; color:black; width:50px">12-24</th>
				<th style="background-color:#36c; color:white; width:50px">24-36</th>
				<th style="background-color:#006; color:white; width:50px">36-48</th>
				<th style="background-color:#666; color:white; width:50px; opacity:0.4">48+</th>
	</tr></tbody></table>
	<!-- <table><tr>	<th style="background-color:#0d0; color:white;"> 
		<input id="greenGiant" type="checkbox" >Quakes larger than 3
	</th></tr></table> -->
	The magnitude of each earthquake will detirmine the the size of the bubble.<br>
Also see the Icelandic Meteorological Institute <a href="https://www.vedur.is/skjalftar-og-eldgos/jardskjalftar/reykjanesskagi/">  Reykjanes page</a> <br>
<div class="fb-like" data-href="http://blitzkopf.github.io/" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
 <div id="credits">
<p class="credit-list">Created by <a href="mailto:blitzkopf@gmail.com">Yngvi Þór</a> using WebGL, inspired by <a href="http://baering.github.io">3dBulge</a>.
<br>
Data provided by <a href="https://www.vedur.is/"> Veðurstofa Íslands </a>
</p>
	</div>
	</div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent ,computed, onMounted,ref }  from 'vue';
//import { useStore } from '../store';
import { MutationType } from '../store/mutations'
import  apiClient from '../dataloads'
import { loadQuakesSkjalftalisa } from '../utils/quake'
import { useAnimParams } from '@/store/anim_params';

export interface Props {
  open?: boolean,
	overlay: boolean,
	fullheight: boolean,
	fullwidth: boolean,
	right: boolean,
	expandOnHover: boolean,
	reduce: boolean
}


const emit = defineEmits( ['quakesLoaded']);

//const store = useStore();
const anim_params = useAnimParams();
/*const mapdepth = computed({
		get: ()=> store.state.animParams.mapdepth ,
		set: (value:number)=> { 
				store.commit(MutationType.SetMapdepth,value);
		},
},)
const depthMult = computed({
				get: ()=> store.state.animParams.depthMultiplier ,
				set: (value:number)=> { 
						store.commit(MutationType.SetDepthMultiplier,value);
				},
		},)
const minQuakeSize = computed({
				get: ()=> store.state.animParams.minQuakeSize ,
				set: (value:number)=> { 
						store.commit(MutationType.SetMinQuakeSize,value);
				},
		},)*/
/*var eT = Date.now();
const endTime = computed ({
	get: () =>  { return new Date(eT);},
	set: (value:Date) => {
		eT = value.getDate();
	}
})*/
const presets= [ 
	{
		name: 'Bárðarbunga 2014',
		start_time :"2014-08-13 21:30:00",
		end_time :"2014-08-30 21:30:00",
	},
	{
		name: 'Geldingadalir 2021',
		start_time:"2021-03-05 21:30:00",
		end_time:"2021-03-19 21:30:00",
	},
	{
		name: '5vh 2010',
		start_time:"2010-03-14 21:30:00",
		end_time:"2010-03-20 23:30:00",
	},
	{
		name: 'Eyjafjallajökull 2010',
		start_time:"2010-04-07 21:30:00",
		end_time:"2010-04-14 23:30:00",
	},			{
		name: 'Grímsvötn 2011',
		start_time :"2011-05-19 21:30:00",
		end_time :"2011-05-23 00:00:00",
	},


];
const tTime = new Date() 
const endTime = ref(new Date());
tTime.setTime(tTime.getTime()-7*24*60*60*1000);
const startTime = ref(tTime);
const presetSel = ref(-1);

const fetch= () => {
	//Vue.axios.get('earthquakes/',{params:{date:'72-hoursago'}}).then( result=> {
	//        return loadQuakesRasmus(result.data,this.$store.state.animParams);  

	console.log(this);

	apiClient.post('/array',{
		"start_time":startTime.value.toISOString().substring(0,19).replace('T',' '),
		"end_time":endTime.value.toISOString().substring(0,19).replace('T',' '),
		//"start_time":"2021-03-05 21:30:00",
		//"end_time":"2021-03-19 21:30:00",
		//"start_time":"2014-08-13 21:30:00",
		//"end_time":"2014-08-30 21:30:00",
		//"start_time":"2010-04-07 21:30:00",
		//"end_time":"2010-04-14 23:30:00",

		"depth_min":0,"depth_max":25,"size_min":0,"size_max":18,
		"magnitude_preference":["Mlw","Autmag"],"event_type":["qu"],"originating_system":["SIL picks","SIL aut.mag"],
		"area":[[68,-32],[61,-32],[61,-4],[68,-4]],
		"fields":["event_id","lat","long","depth","time","magnitude","event_type","originating_system"]
	})
	.then( result=> {
		console.log(this);
		return loadQuakesSkjalftalisa(result.data,anim_params);
		})
	.then(qdata => {
			emit('quakesLoaded',qdata);
		})
	.catch(error => {
		console.log(error);

		throw new Error(`API ${error}`);
		});
}
const handlePresets = () => {
	const selection = presets[presetSel.value];
	startTime.value = new Date(selection.start_time);
	endTime.value = new Date(selection.end_time);
	fetch();

}
const mounted = async () => {
	await fetch()
}

onMounted(mounted);


const open=ref(true);

/*const props = withDefaults(defineProps<Props>(), {
	open: true,
			overlay: false,
			fullheight: true,
			fullwidth: false,
			right: false,
			expandOnHover: true,
			reduce: true,
})
*/
			
</script>

<style>
#controls{ 
	color: #aaa;
	position: absolute;
	top:50px;
	left: 0px;
	margin: 0;
	width: 310px;
	/*visibility: hidden;*/
	/*display: none;*/
}
input.disp{
	color:#777;
	background-color:none;
	width:4em;
	/*opacity: 0.5;*/
}
.p-1 {
  padding: 1em;
}
</style>