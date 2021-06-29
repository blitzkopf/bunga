import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        time: '',
        qParams: {},
        animParams : {
            depthScale: 4.0,
            animLength: 120, // seconds
            finalSceneLength: 30, //seconds
            minQuakeSize: 0 ,//
            sizeMultiplier: .2, //
            mapdepth: -15, // km
            flybyRadius: 150, // degrees
            flybyHeight: -2, //
            lookAtDepth: 5,
            rotationSpeed: -1,
            dispVerifiedOnly: false,
            greenGiant: true,
        },
        timeStart:0,
        timeLast:Date.now(),
        animTime:Date.now()-504*60*60*1000
    }, 
    mutations: {
        SAVE_QPARAMS(state,qParams) {
            state.qParams=qParams;
        },
        startTime(state) {
            state.timeStart = new Date().getTime();
        },
        setTime(state, time) {
            state.time=time;
        },
        setAnimTime(state, time) {
            state.animTime=time;
        },
        newFrame(state) {

            let timeNow =  Date.now();
            let timeDelta = timeNow-state.timeLast;

            let mplier = state.qParams.duration / state.animParams.animLength
            state.timeLast=timeNow;
            if( state.animTime < state.qParams.lastTime ) {
                state.animTime += timeDelta * mplier*0.001;
            }
            /*let t1 = (timeNow - state.timeStart) / ((state.animParams.animLength)*1000);
            if( t1 > 1.0) {
              t1 = 1.0;
            }
            state.animTime= new Date(state.qParams.firstTime.getTime() + t1* state.qParams.duration);*/
        }
    },
})