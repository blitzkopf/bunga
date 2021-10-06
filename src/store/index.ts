import Vuex from 'vuex'

/*
if(q.time < params.firstTime || params.firstTime == null) {
    params.firstTime=q.time;
}
if(q.time > params.lastTime || params.lastTime == null) {
    params.lastTime=q.time;
}
M += q.size;
//vec3.add(mr,[q.pos[0]*q.size,q.pos[1]*q.size,q.pos[2]*q.size]);
mr.addScaledVector(q.pos,q.size);

}
/*params.centerOfMass=[
mr[0]/M,
mr[1]/M,
mr[2]/M,
]*
mr.divideScalar(M);
params.centerOfMass=mr;

params.duration = params.lastTime - params.firstTime;
qList.sort(function(a,b){return b.time-a.time});
return params; */

const store = new  Vuex.Store({
    state: {
        time: '',
        ready:false,
        qParams: {
            firstTime: null,
            lastTime: null,
            duration: null,
            centerOfMass:[],
        },
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
        timeLast:Date.now(),
        animTime:Date.now()-54*60*60*1000
    }, 
    mutations: {
        SAVE_QPARAMS(state,qParams) {
            state.qParams=qParams;
            state.ready = true;
        },
        startTime(state) {
            state.timeStart = new Date().getTime();
        },
        setTime(state, time) {
            state.time=time;
        },
        setAnimTime(state, time) {
            state.animTime=time;
        },
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
                state.animTime= new Date(state.qParams.firstTime.getTime() + t1* state.qParams.duration);*/
            }
        }
    },
});

export default store;