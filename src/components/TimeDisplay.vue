<template>
  <div id="timer">
    {{msg}} {{time}}
  </div>
</template>

<script>

export default {
    name: 'TimeDisplay',
    props: {
        msg:String,
        //time:Date
    },
    computed: {
        time () {
            return new Date(this.$store.state.animTime);
        }
    },
}
</script>

<style>
#timer{
	/*background-color:#000; */
	color:#fff;
	z-index:0;
	position: relative;
	width:600px;
	height:0px;
	margin: 0;
} 
</style>
