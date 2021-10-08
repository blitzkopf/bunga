<template>
  <section>
    <div>
        <div id="controls"  >
		<!-- <a href="javascript:void(0)" onclick="hide_controls();"> hide/show controls</a>-->
		<div id="innerC">
		<h1>Bunga-Bunga</h1>
		<h2> Earthquake the movie </h2>
		<h3> Earthquakes in Iceland in 3D animation</h3>		
		Depth of map:(pgUp/pgDown)<br><input id="mapdepth" type="range" min="-40" max="2" step="1"
			v-model="mapdepth" >
		<input type="text" id="mapdepthDisp" editable="false" class="disp"><br>
	<!-- (The map is slightly offset, I'm trying to figure it out)<br> -->
		Quake size multiplier: <br><input id="sizeMultiplier" type="range" min="0" max="4" step="0.1" value="0.5"
			onchange="rangeChange(this)" oninput="rangeChange(this)">
		<input type="text" id="sizeMultiplierDisp" editable="false" class="disp"> <br>
		Minimum quake size: <br><input id="minQuakeSize" type="range" min="0" max="8" step="0.2" value="0"
			onchange="rangeChange(this)" oninput="rangeChange(this)">
		<input type="text" id="minQuakeSizeDisp"  editable="false" class="disp"> <br>
		<input id="dispVerifiedOnly" type="checkbox" > Only display verified earthquakes
		<br>

	Earthquake age in hours: 
	<table><tr>	<th style="background-color:#f00; color:white; width:50px">0-4</th>
				<th style="background-color:#f60; color:white; width:50px">4-12</th>
				<th style="background-color:#ff0; color:black; width:50px">12-24</th>
				<th style="background-color:#36c; color:white; width:50px">24-36</th>
				<th style="background-color:#006; color:white; width:50px">36-48</th>
				<th style="background-color:#666; color:white; width:50px; opacity=0.4">48+</th>
	</tr></table>
	<table><tr>	<th style="background-color:#0d0; color:white;"> 
		<input id="greenGiant" type="checkbox" >Quakes larger than 3
	</th></tr></table>
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

        return {mapdepth}
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
.p-1 {
  padding: 1em;
}
</style>