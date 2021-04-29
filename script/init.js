var canvas = document.createElement("canvas"),
	ctx = canvas.getContext("2d");

var {
	assign
} = Object;

var deltaTime = 0;
var gameTime = 0;
var {
	random,
	floor,
	round,
	ceil,
	abs,
	PI
} = Math;

var Falling;

const Color = {
	/**@readonly*/
	code: [
		"#faa",
		"#aaf",
		"#afa",
		"#faf",
		"#ffa"
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
	// yellow: 4,
	/**@readonly*/
	all: [0, 1, 2, 3],
	next() {
		var {list} = this;

		if(!list.length) {
			for(let color of this.all) {
				for(let i = 0; i < 12; i++) list.push(color);
			}
			list.sort(() => random() - .5);
			console.log(list);
		}

		return list.pop();
	},
	list: []
}

var delay = time => new Promise(resolve => setTimeout(resolve, time));

var scale = 40;

var randomFrom = ([...items]) => items[floor(random() * items.length)];

/**@type {Blob[]}*/
var blobs = [];