var canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d");

var {
	assign
} = Object;

var deltaTime = 0;
var gameTime = 0;
var ticks = 0;
var {
	random,
	floor,
	round,
	ceil,
	abs,
	sign,
	max,
	PI
} = Math;

var nothing = () => {};

const Color = {
	/**@readonly*/
	code: [
		"#faa",
		"#aaf",
		"#afa",
		"#daf",
		"#ff5"
	],
	/**@readonly*/
	red: 0,
	/**@readonly*/
	blue: 1,
	/**@readonly*/
	green: 2,
	/**@readonly*/
	purple: 3,
	/**@readonly*/
	yellow: 4,
	/**@readonly*/
	easy: [0, 1, 2, 3],
	/**@readonly*/
	normal: [0, 1, 2, 3, 4],
	next() {
		var {list, weights, uses} = this;

		if(list.length <= 6) {
			var extra = [];
			var set = diff < 2? this.easy: this.normal;

			// if(weights.length < set.length) {
			// 	for(let a = weights.length, b = set.length; a < b; a++) {
					
			// 	}
			// } //missing opposite check
			if(emptyWeights()) {
				console.log(uses);
				for(let a in set) {
					weights[a] = 8;
				}
				if(diff) weights[-1] = 4;
			}

			while(list.length <= 6) {
				var c = irandom(weights);
				--weights[c];
				++uses[c];
				if(c != -1) {
					list.push(set[c]);
				}else{
					list.push(...Array(diff * 2 + 1).fill(-1));
				}
			}

			// list.push(...extra.flat());
		}
		return list.shift();

		function check() {
			var colors = {};
			for(let color of extra) {
				if(color in colors) ++colors[color];
				else colors[color] = 1;
			}
			var counts = new Set(Object.values(colors));
			return !counts.has(1) && !counts.has(2) && !counts.has(8);
		}

		function emptyWeights() {
			for(let i in weights) {
				if(weights[i]) return false;
			}
			return true;
		}
	},
	weights: [],
	uses: [],
	list: []
}
Color.code[-1] = "#555";

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

/**@type {Set<Blob>}*/
var blobs = new Set;