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

<script>
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

    export default {
        name: 'Playbar',
        data() {
            return {
                format: "raw",
                locale: undefined, // Browser locale
            }
        },
        computed: {
            animTime: {
                get () { 
                    return this.$store.state.animTime ;
                },
                set (value) { 
                    this.$store.commit('setAnimTime',value);
                },
            },
            firstTime () {
                return this.$store.state.qParams.firstTime;
            },
            lastTime () {
                return this.$store.state.qParams.lastTime;
            },
            displayTime () {
                return new Date(this.$store.state.animTime).toLocaleString('en-GB');
            }
       
        },
        methods: {
            formatTime(dt) {
                let d=new Date(dt);
                return d.getHours().pad() + ':' + d.getMinutes().pad() ;
        }
    },
    }
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
