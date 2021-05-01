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
	all: [0, 1, 2, 3],
	next() {
		var {list} = this;

		if(list.length <= 6) {
			var extra = [];
			for(let color of this.all) {
				for(let i = 0; i < 8; i++) extra.push(color);
			}
			for(let i = 0; i < 5; i++) extra.sort(() => random() - .5);
			list.push(...extra);
		}

		return list.shift();
	},
	list: []
}

var delay = time => new Promise(resolve => setTimeout(resolve, time));

var frameRate = 0;
var frame = () => {
	var start = Date.now();
	return new Promise(resolve => requestAnimationFrame(() => {
		frameRate = Date.now() - start;
		resolve();
	}));
}
var scale = 40;

var randomFrom = ([...items]) => items[floor(random() * items.length)];

/**@type {Set<Blob>}*/
var blobs = new Set;