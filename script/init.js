var canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d");

var {
	assign
} = Object;

/**@type {number}*/
var deltaTime;
/**@type {number}*/
var gameTime;
/**@type {number}*/
var ticks;
var {
	random,
	floor,
	round,
	ceil,
	abs,
	sign,
	max,
	min,
	PI
} = Math;

var nothing = () => {};

var delay = time => new Promise(resolve => setTimeout(resolve, time));

var diff = 0;

var frameRate = 0;
var frame = () => {
	var start = Date.now();
	return new Promise(resolve => requestAnimationFrame(() => {
		frameRate = Date.now() - start;
		resolve();
	}));
}

function weight(weights) {
	let total = 0;
	for(let id in weights) {
		let value = weights[id];
		total += value;
	}
	let acu = 0;
	let opt = random() * total;
	let chosen = 0;
	for(let id in weights) {
		let value = weights[id];
		if(acu < opt) {
			chosen = id;
		}
		acu += value;
	}
	return isNaN(chosen)? chosen: +chosen;
}
function irandom(weights) {
	let total = 0;
	for(let id in weights) {
		let value = weights[id];
		total += sign(value);
	}
	let acu = 0;
	let opt = random() * total;
	let chosen = 0;
	for(let id in weights) {
		let value = weights[id];
		if(acu < opt) {
			chosen = id;
		}
		acu += sign(value);
	}
	return isNaN(chosen)? chosen: +chosen;
}

var scale = 40;

var randomFrom = ([...items]) => items[floor(random() * items.length)];
var shuffle = ([...items]) => {
	var {length: l} = items;
	for(let i = 0; i < l; i++) {
		let n = i + floor(random() * (l - i));
		[items[n], items[i]] = [items[i], items[n]];
	}
	return items;
}

/**@type {Set<Blob>}*/
var blobs;