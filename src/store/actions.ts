import { ActionContext, ActionTree } from 'vuex'
import { Mutations, MutationType } from './mutations'
import { State } from './state'
import { useQuakeParams } from './quake_params';


export enum ActionTypes {
  newFrame = 'NEW_FRAME',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
}
export type Actions = {
  [ActionTypes.newFrame](context: ActionAugments): void
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.newFrame]({ commit, state }) {
    const quake_params = useQuakeParams();

    if (quake_params.ready) {

      const timeNow = Date.now();
      const timeDelta = timeNow - state.animParams.timeLast;

      const mplier = Number(quake_params.duration) / state.animParams.animLength;
      commit(MutationType.SetAnimTimeLast, timeNow);
      //state.animParams.timeLast=timeNow;
      if (state.animParams.animTime < quake_params.lastTime!) {
        commit(MutationType.AddAnimTime, timeDelta * mplier * 0.001);
        //state.animParams.animTime += timeDelta * mplier*0.001;
      }
      /*let t1 = (timeNow - state.timeStart) / ((state.animParams.animLength)*1000);
      if( t1 > 1.0) {
      t1 = 1.0;
      }
      state.animTime= new Date(state.qParams.firstTime.getTime() + t1* state.qParams.duration);*/
    }
  }
};