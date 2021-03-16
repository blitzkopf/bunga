<template>
    <section id="slider">
        <b-field id="timer" v-bind:label="displayTime">
            <b-slider v-model="animTime" :custom-formatter="(val) => formatTime(val)" :tooltip="false" indicator  locale="en-GB"
                v-bind:min="firstTime" v-bind:max="lastTime"></b-slider>
        </b-field>
    </section>
</template>

<script>
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
                return d.getHours() + ':' + d.getMinutes() ;
        }
    },
    }
</script>
<style>
#slider{
	/*background-color:#000; */
	/*z-index:0;*/
	position: relative;
	/*width:600px;*/
	height:0px;
	margin: 0;
}
.b-slider.tooltip-content{
	color:#000;
}

#timer .label {
    color:#fff;
} 
</style>
