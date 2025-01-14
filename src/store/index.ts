//import Vuex from 'vuex'
// https://soshace.com/building-web-apps-with-vue-3-composition-api-typescript-vuex4-0/
import {
  createStore,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  createLogger
} from 'vuex'
import { State, state } from './state'
import { Mutations, mutations } from './mutations'
import { Actions, actions } from './actions'
import { Getters, getters } from './getters'

export const store = createStore<State>({
    // plugins: process.env.NODE_ENV === 'development' ? [/*createLogger()*/] : [],
    plugins: import.meta.env.NODE_ENV === 'development' ? [/*createLogger()*/] : [],
    state,
    mutations,
    actions,
    getters
  })
  export function useStore() {
    return store as Store
  }
  export type Store = Omit<
    VuexStore<State>,
    'getters' | 'commit' | 'dispatch'
  > & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
      key: K,
      payload: P,
      options?: CommitOptions
    ): ReturnType<Mutations[K]>
  } & {
    dispatch<K extends keyof Actions>(
      key: K,
      payload?: Parameters<Actions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<Actions[K]>
  } & {
    getters: {
      [K in keyof Getters]: ReturnType<Getters[K]>
    }
  }
/*export type  Store = AnimParamsStore<Pick<RootState, 'animParams'>>
& QParamsStore<Pick<RootState, 'qParams'>>; */

// Plug in logger when in development environment
//const debug = process.env.NODE_ENV !== 'production';
//const plugins = debug ? [createLogger({})] : [];

/*
export const store = createStore({
    //plugins,
    modules: {
        animParams:animParams,
        qParams:qParams,
    },
});
/*
newFrame(state) {

            if( state.qParams.duration !== null && state.qParams.lastTime  !== null ) {

                const timeNow =  Date.now();
                const timeDelta = timeNow-state.timeLast;

                const mplier = Number(state.qParams.duration!) / state.animParams.animLength
                state.timeLast=timeNow;
                if( state.animTime < state.qParams.lastTime! ) {
                    state.animTime += timeDelta * mplier*0.001;
                }
                /*let t1 = (timeNow - state.timeStart) / ((state.animParams.animLength)*1000);
                if( t1 > 1.0) {
                t1 = 1.0;
                }
                state.animTime= new Date(state.qParams.firstTime.getTime() + t1* state.qParams.duration);* /
            }
        }*/  



/*const store = new  Vuex.Store({
    state: {
        time: '',
        timeStart:0,
        timeLast:Date.now(),
        animTime:Date.now()-54*60*60*1000
    }, 
    mutations: {
        }
    },
});
/
export function useStore(): Store {
    return store as Store;
  }
  
*/
export default store;