export {}
/*import {Quake} from './quake.js'
import * as $ from 'jquery';


export function loadDataRasmuskr(url,callback) {
	$.getJSON(url,function(resp) {
		var quakes = [];
		for (var i in resp.items) {
			var q=resp.items[i];
			quakes.push(new Quake(q.lat,q.long,q.depth,new Date(q.date*1000),q.size,q.verified));
		}
		//qParams=calculatePositions(quakes,animParams);
		callback(quakes);
	});

	
}*/