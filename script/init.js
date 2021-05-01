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
	/**@readonly*/
	all: "RBGPY",
	next() {
		var {list} = this
		var set = diff < 2? this.easy: this.normal;;

		if(list.length <= 6) {
			var extra = [];

			for(let i = 0, m = 5, l = 16 * m; i < l; i++) {
				extra.push(i % m);
			}
			for(let i = 0; i < 4; i++) {
				extra.push(-2);
			}

			extra = shuffle(extra);

			list.push(...extra.flat());
		}
		for(let i = 0; i < 8; i++) {
			if(list[i] == -2) {
				list[i] = new Array(diff? diff * 2 + 1: 0).fill(-1);
			}else if(set.indexOf(list[i]) == -1) list[i] = [];
		}
		list = list.flat();
		this.list = list;

		return list.shift();
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
var shuffle = ([...items]) => {
	var {length: l} = items;
	for(let i = 0; i < l; i++) {
		let n = i + floor(random() * (l - i));
		[items[n], items[i]] = [items[i], items[n]];
	}
	return items;
}

/**@type {Set<Blob>}*/
var blobs = new Set;