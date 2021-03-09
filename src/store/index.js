import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import VueAxios from "vue-axios";
import * as THREE from 'three';
import {  calculatePositions } from '../utils/quake.js'
import {Quake} from '../utils/quake.js'



Vue.use(Vuex);
Vue.use(VueAxios,axios);

Vue.axios.defaults.baseURL = "http://isapi.rasmuskr.dk/api/"; // earthquakes/?date=72-hoursago


export default new Vuex.Store({
    state: {
        time: '',
        quakes: [],
        qParams: {},
        qGroup: new THREE.Group(),
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
        }
    },
    actions: {
        loadQuakes({commit}) {
        Vue.axios.get('earthquakes/',{params:{date:'72-hoursago'}}).then(result => {
            commit('SAVE_QUAKES', result.data);
        }).catch(error => {
            throw new Error(`API ${error}`);
        });
        }
    },
    mutations: {
        SAVE_QUAKES(state, data) {
            state.quakes=[];
            for (let  i in data.items) {
                let q=data.items[i];
                state.quakes.push(new Quake(q.lat,q.long,q.depth,new Date(q.date*1000),q.size,q.verified));
            }
            state.qParams=calculatePositions(state.quakes,state.animParams);
            /* figure out how to get this out of state */
            for(let i in state.quakes) {
                let q = state.quakes[i];
                let g = new THREE.IcosahedronGeometry(q.size * state.animParams.sizeMultiplier,4);
                let m = new THREE.MeshLambertMaterial({color: 0x00ff00 });
                let s = new THREE.Mesh(g,m);
                
                s.position.copy(q.pos);
                state.quakes[i].mesh = s;
                s.visible = false;
                state.qGroup.add(s);
            }
        },
        setTime(state, time) {
            state.time=time;
        }
    },
})