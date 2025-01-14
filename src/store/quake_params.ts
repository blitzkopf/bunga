import { defineStore } from "pinia";
import * as THREE from 'three';

export type QuakeParams = {
    firstTime?: number,
    lastTime?: number,
    duration?: number,
    centerOfMass?:THREE.Vector3,
    ready?:boolean,
  };

export const useQuakeParams = defineStore({
    id: "quakeParams",
    state: ():QuakeParams => ({
        firstTime: 0,
        lastTime: 120,
        duration: 120,
        centerOfMass:new THREE.Vector3(0,0,0),
        ready:false,
    }),
    /*getters: {
        duration: (state) => state.duration,
        firstTime: (state) => state.firstTime,
        lastTime: (state) => state.lastTime,
        centerOfMass: (state) => state.centerOfMass,
    },*/
    actions: {
        setDuration(duration:number) {
            this.duration=duration;
        },
        setFirstTime(firstTime:number) {
            this.firstTime=firstTime;
        },
        setLastTime(lastTime:number) {
            this.lastTime=lastTime;
        },
        setCenterOfMass(centerOfMass:THREE.Vector3) {
            this.centerOfMass=centerOfMass;
        },
        setQuakeParams(quakeParams:QuakeParams) {
            this.duration=quakeParams.duration;
            this.firstTime=quakeParams.firstTime;
            this.lastTime=quakeParams.lastTime;
            this.centerOfMass=quakeParams.centerOfMass;
            this.ready=true;
        }
    },
});