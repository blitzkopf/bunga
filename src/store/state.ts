import * as THREE from 'three';

export type QuakeParams = {
  firstTime?: number,
  lastTime?: number,
  duration?: number,
  centerOfMass?:THREE.Vector3,
};
export type AnimParams = {
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
  timeLast:number;
  animTime:number;
};
export type State = {
    ready:boolean,
    quakeParams?: QuakeParams,
    animParams:AnimParams
};

export const state: State = {
    ready:false,
    quakeParams:{
      firstTime: 0,
      lastTime: 120,
      duration: 120,
      centerOfMass:new THREE.Vector3(0,0,0),
    },
    animParams: {
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
      time:undefined,
      timeStart:0,
      timeLast:Date.now(),
      animTime:Date.now()-54*60*60*1000,
  }
};