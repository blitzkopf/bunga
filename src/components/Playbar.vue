<template>
    <section id="slider">
        <b-field label="Custom format (bypass locale)">
            <b-slider v-model="animTime" :custom-formatter="(val) => formatTime(val)" :tooltip="false" indicator :max="1615335331000" :min="1615114938000"></b-slider>
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

                value1: 6000,
                value2: 40,
            }
        },
        computed: {
            animTime: function () {

                return this.$store.state.animTime.getTime() ;
            },
       
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
	color:#000;
	z-index:0;
	position: relative;
	/*width:600px;*/
	height:0px;
	margin: 0;
} 
</style>
