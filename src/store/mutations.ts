// /store/mutations.ts
import { MutationTree } from 'vuex'
import { State, QuakeParams } from './state'

export enum MutationType {
  SaveQuakeParams = 'SAVE_QUAKE_PARAMS',
  SetAnimTime = 'SET_ANIM_TIME',
  SetAnimTimeLast = 'SET_ANIM_TIME_LAST',
  AddAnimTime = 'ADD_ANIM_TIME',
  StartTime = 'START_TIME',
  SetMapdepth = 'SET_MAPDEPTH',
  SetMinQuakeSize = 'SET_MIN_QUAKE_SIZE'
  
}

export type Mutations = {
    [MutationType.SaveQuakeParams](state: State, qParams: QuakeParams): void,
    [MutationType.SetAnimTime](state: State, time: number): void,
    [MutationType.SetAnimTimeLast](state: State, time: number): void,
    [MutationType.AddAnimTime](state: State, time: number): void,
    [MutationType.StartTime](state: State): void,
    [MutationType.SetMapdepth](state: State, depth:number): void,
    [MutationType.SetMinQuakeSize](state: State, size:number): void,

  }

// /store/mutation.js
export const mutations: MutationTree<State> & Mutations = {
  [MutationType.SaveQuakeParams](state, qParams) {
    state.quakeParams=qParams;
    state.ready=true;
  },
  [MutationType.SetAnimTime](state, time) {
    state.animParams.animTime=time;
  },
  [MutationType.SetAnimTimeLast](state, time) {
    state.animParams.timeLast=time;
  },
  [MutationType.AddAnimTime](state, time) {
    state.animParams.animTime += time;
  },
  [MutationType.StartTime](state) {
    state.animParams.timeStart = new Date().getTime();
  },
  [MutationType.SetMapdepth](state, depth) {
    state.animParams.mapdepth = depth;
  },
  [MutationType.SetMinQuakeSize](state, size) {
    state.animParams.minQuakeSize = size;
  },

}
