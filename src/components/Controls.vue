<template>
  <section>
	<div id="controls"  >
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
		<!-- <o-field label="Depth of map">
			<o-slider v-model="mapdepth" min="-40" max="1"></o-slider>
		</o-field> -->
		Depth of map:(pgUp/pgDown)<br><input id="mapdepth" type="range" min="-40" max="2" step="1"
			v-model="mapdepth" >
		<input type="text" id="mapdepthDisp" editable="false" class="disp" v-model="mapdepth"><br>
		<!-- Quake size multiplier: <br><input id="sizeMultiplier" type="range" min="0" max="4" step="0.1" value="0.5"
			onchange="rangeChange(this)" oninput="rangeChange(this)">
		<input type="text" id="sizeMultiplierDisp" editable="false" class="disp"> <br> -->
		Minimum quake size: <br><input id="minQuakeSize" type="range" min="0" max="8" step="0.2"
			v-model="minQuakeSize">
		<input type="text" id="minQuakeSizeDisp"  editable="false" class="disp" v-model="minQuakeSize"> <br>

	Earthquake age in hours: 
	<table><tr>	<th style="background-color:#f00; color:white; width:50px">0-4</th>
				<th style="background-color:#f60; color:white; width:50px">4-12</th>
				<th style="background-color:#ff0; color:black; width:50px">12-24</th>
				<th style="background-color:#36c; color:white; width:50px">24-36</th>
				<th style="background-color:#006; color:white; width:50px">36-48</th>
				<th style="background-color:#666; color:white; width:50px; opacity=0.4">48+</th>
	</tr></table>
	<!-- <table><tr>	<th style="background-color:#0d0; color:white;"> 
		<input id="greenGiant" type="checkbox" >Quakes larger than 3
	</th></tr></table> -->
	The magnitude of each earthquake will detirmine the the size of the bubble.<br>
Also see the Icelandic Meteorological Institute <a href="https://www.vedur.is/skjalftar-og-eldgos/jardskjalftar/reykjanesskagi/">  Reykjanes page</a> <br>
<div class="fb-like" data-href="http://blitzkopf.github.io/" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
 <div id="credits">
<p class="credit-list">Created by <a href="mailto:blitzkopf@gmail.com">Yngvi Þór</a> using WebGL, inspired by <a href="http://baering.github.io">3dBulge</a> 
 data provided by <a href="http://www.rasmuskr.dk" target="_blank">RasmusKr</a> and <a href="https://www.vedur.is/"> Veðurstofa Íslands </a>
</p>
	</div>
	</div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent ,computed}  from 'vue';
import { useStore } from '../store';
import { MutationType } from '../store/mutations'

export default defineComponent({
    name: 'Controls',
    setup() {
        const store = useStore();
        const mapdepth = computed({
            get: ()=> store.state.animParams.mapdepth ,
            set: (value:number)=> { 
                store.commit(MutationType.SetMapdepth,value);
            },
        },)
		const minQuakeSize = computed({
            get: ()=> store.state.animParams.minQuakeSize ,
            set: (value:number)=> { 
                store.commit(MutationType.SetMinQuakeSize,value);
            },
        },)
		const startTime = new Date();
		const endTime = new Date();
		startTime.setTime(endTime.getTime()-7*24*60*60*1000);

        return {mapdepth,minQuakeSize, startTime, endTime}
    },
    data() {
        return {
			open: true,
			overlay: false,
			fullheight: true,
			fullwidth: false,
			right: false,
			expandOnHover: true,
			reduce: true
        }
    },
});


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