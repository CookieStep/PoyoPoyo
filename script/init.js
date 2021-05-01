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
		var {list} = this;

		if(list.length <= 6) {
			var extra = [];
			var set = diff < 2? this.easy: this.normal;
			for(let color of set) {
				for(let i = 0; i < 12; i++) {
					extra.push(color);
				}
			}
			if(diff > 0) for(let i = 0; i < 3; i++) extra.push(-1);
			for(let i = 0; i < 10; i++) extra.sort((a, b) => {
				var num = random() * 2 - 1;
				if(a == b && a != -1) num -= 1/3;
				else if(a > b && a != -1) num -= 1/3;
				return num;
			});
			for(let i in extra) {
				if(extra[i] == -1) {
					extra[i] = new Array(diff == 1? 3: 5).fill(-1);
				}
			}
			list.push(...extra.flat());
		}
		return list.shift();

		function copyCheck() {
			var col = -2, cou = 0;
			for(let color of extra) {
				if(col != color) {
					cou = 0;
					col = color;
				}else{
					++cou;
					if(cou > 4)
					return true;
				}
			}
		}
	},
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
	let total = 0
	for(let value of weights) {
		total += value;
	}
	let acu = 0;
	let opt = Math.random() * total
	let chosen = 0;
	for(let id = 0; id < weights.length; id++) {
		let value = weights[id]
		if(acu < opt)
		chosen = id
		acu += value
	}
	return chosen
}

var scale = 40;

var randomFrom = ([...items]) => items[floor(random() * items.length)];

/**@type {Set<Blob>}*/
var blobs = new Set;