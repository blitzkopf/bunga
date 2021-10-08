import { createStore, createLogger } from 'vuex';

export type State = {
    depthScale: number,
    animLength: number, // seconds
    finalSceneLength: number, //seconds
    minQuakeSize: number ,//
    sizeMultiplier: number, //
    mapdepth: number, // km
    flybyRadius: number, // degrees
    flybyHeight: number, //
    lookAtDepth: number,
    rotationSpeed: number,
    dispVerifiedOnly: boolean,
    greenGiant: boolean,
    time?:number; 
    timeStart:number;
    timeLast:Date;
    animTime:Date;

  };

export const store = createStore({
    state:{
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
        time:'',
        timeStart:0,
        timeLast:Date.now(),
        animTime:Date.now()-54*60*60*1000,
    },
    mutations: {
        
        setTime(state, time) {
            state.time=time;
        },
       
    }

});
