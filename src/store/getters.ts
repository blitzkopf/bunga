import { earthRadius } from '@/utils/quake';
import { GetterTree } from 'vuex';

import { State } from './state';

export type Getters = {
  mapRadius(state: State): number;
}

export const getters:  Getters = {
    mapRadius: (state) => {
        return earthRadius + state.animParams.mapdepth *state.animParams.depthMultiplier;
    }
};