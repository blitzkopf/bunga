import { describe,it,expect } from 'vitest'
import { geo2Cart } from '../quake'
import * as THREE from 'three';


describe('geo2Cart utility function',() => { 
    it('does return THREE.Vector3',() => { 
        expect(geo2Cart(0,0,1))
            .toBeInstanceOf(THREE.Vector3)
    })
    // ACHTUNG: I think there is a mixup between lat and lon ( or x y ) in the code 
    it('returns unit up on z for 0,0 on unit sphere',() => { 
        expect(geo2Cart(0,0,1).distanceTo(new THREE.Vector3(0.0,0.0,1.0)))
            .toBeCloseTo(0.0)
            //.toBe(new THREE.Vector3(0.0,0.0,1.0))
    })
    it('returns 1 up on x for 90° long on unit sphere',() => { 
        expect(geo2Cart(0,90,1).distanceTo(new THREE.Vector3(1.0,0.0,0.0)))
            .toBeCloseTo(0.0)
            //.toBe(new THREE.Vector3(0.0,0.0,1.0))
    })
    it('returns -1 on z for 180° lat on unit sphere',() => { 
        expect(geo2Cart(180,0,1).distanceTo(new THREE.Vector3(0.0,0.0,-1.0)))
            .toBeCloseTo(0.0)
            //.toBe(new THREE.Vector3(0.0,0.0,1.0))
    })

})