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
        },
        timeStart:0,
        animTime:new Date(Date.now())
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
            let quakes=[];
            for (const q of  data.items) {
                quakes.push(new Quake(q.lat,q.long,q.depth,new Date(q.date*1000),q.size,q.verified));
            }
            state.qParams=calculatePositions(quakes,state.animParams);
            /* figure out how to get this out of state */
            //const hour = 60*60;
            //const times = [0, 4*hour, 12*hour, 24*hour, 36*hour, 48*hour];
            //const values = [0, 1, 0, 1, 0];
            //const cValues = [0,1,0, 1,0,0, 1,0.4,0 , 1,1,0, .2,.4,.8 , 0,0,.4];
            //const bValues=  [false,true,true,true,true,true];

            //const opacityKF = new THREE.NumberKeyframeTrack('.material.opacity', times, values);
            /*let colorKF = new THREE.ColorKeyframeTrack (".material.color",times,cValues,THREE.InterpolateSmooth)
            let visKF =   new THREE.BooleanKeyframeTrack (".visible",times,bValues,THREE.InterpolateDiscrete)*/
            /*let moveBlinkClip = new THREE.AnimationClip('quake-age', -1, [
                colorKF,
                visKF
                //opacityKF
              ]);*/

            for(const q of quakes) {
                let g = new THREE.IcosahedronGeometry(q.size * state.animParams.sizeMultiplier,4);
                let m = new THREE.MeshLambertMaterial({color: 0xffffff }).clone();
                let s = new THREE.Mesh(g,m);
               /* let mixer = new THREE.AnimationMixer(s);
                const times = [q.date , q.date+4*hour, q.date+12*hour, q.date+24*hour, q.date+36*hour, q.date+48*hour];
                let colorKF = new THREE.ColorKeyframeTrack (".material.color",times,cValues,THREE.InterpolateSmooth)
                let visKF =   new THREE.BooleanKeyframeTrack (".visible",times,bValues,THREE.InterpolateDiscrete)
                let moveBlinkClip = new THREE.AnimationClip('quake-age', -1, [
                    colorKF,
                    visKF
                    //opacityKF
                  ]);
                let action = mixer.clipAction(moveBlinkClip);
               
               
                s.visible = true;
                action.play();
                */
                s.position.copy(q.pos);
                state.qGroup.add(s);
                q.mesh = s;
                //q.mixer = mixer;

            }
            state.quakes=quakes;
            
        },
        startTime(state) {
            state.timeStart = new Date().getTime();
        },
        setTime(state, time) {
            state.time=time;
        },
        newFrame(state) {

            let timeNow = new Date().getTime();

            let t1 = (timeNow - state.timeStart) / ((state.animParams.animLength)*1000);
            if( t1 > 1.0) {
              t1 = 1.0;
            }
            state.animTime= new Date(state.qParams.firstTime.getTime() + t1* state.qParams.duration);
        }
    },
})