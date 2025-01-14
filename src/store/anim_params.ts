import { defineStore } from "pinia";
import { useQuakeParams } from "./quake_params";
import { earthRadius } from '@/utils/quake';


export type AnimParams = {
    depthMultiplier: number,
    animLength: number, // seconds
    finalSceneLength: number, //seconds
    minQuakeSize: number ,//
    sizeMultiplier: number, //
    mapdepth: number, // km
    greenGiant: boolean,
    time?:number; 
    timeStart:number;
    timeLast:number;
    animTime:number;
  };


  export const useAnimParams = defineStore({
    id: "animParams",
    state: ():AnimParams => ( {
        depthMultiplier: 2.0,
        animLength: 120, // seconds
        finalSceneLength: 30, //seconds
        minQuakeSize: 0 ,//
        sizeMultiplier: .2, //
        mapdepth: -15, // km
        greenGiant: true,
        time:undefined,
        timeStart:0,
        timeLast:Date.now(),
        animTime:Date.now()-54*60*60*1000,
    }),
    actions: {
        startTime() {
            this.timeStart=new Date().getTime();
        },
        newFrame() {
            const quake_params = useQuakeParams();
    
            const timeNow =  Date.now();
            const timeDelta = timeNow-this.timeLast;

            const mplier = Number(quake_params.duration) / this.animLength;

            this.timeLast=timeNow;
            if( this.animTime < quake_params.lastTime! ) {
                this.animTime += timeDelta * mplier*0.001;
            }
            
        },
                
    },
    getters: { 
        mapRadius: (state) => {
            return earthRadius + state.mapdepth *state.depthMultiplier;
        }
    },
});