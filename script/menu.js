async function update() {
	while(true) {
		if(mainMenu.active) {
			mainMenu.run();
		}else{
			if(main.run) {
				if(!main.paused) {
					resPromises();
					if(!main.running) main();
				}else{
					pauseMenu.run();
				}
			}else if(multiplayer.active) {
				if(!multiplayer.running) multiplayer.run();
			}
		}

		await frame();
	}

	function resPromises(bool=true) {
		for(let res of promises) {
			res(bool);
			promises.delete(res);
		}
	}
}
const EXIT = Symbol();
var promises = new Set;
var gameUpdate = () => {
	var callback = resolve => promises.add(bool => {
		deltaTime = frameRate;
		gameTime += deltaTime;
		resolve(bool);
	});
	return new Promise(callback);
}
var pauseMenu = {
	run() {
		if(!this.ctx) {
			this.draw();
		}
		ctx.drawImage()
	},
	draw() {
		drawBlobs();
		this.canvas = document.createElement("canvas");
		var ctx = this.canvas.getContext("2d");
		this.ctx = true;
		ctx.drawImage(canvas, 0, 0);
	},
	resize() {
		delete this.canvas;
	},
	/**@type {HTMLCanvasElement}*/
	canvas: 0
};
var mainMenu = {
	active: true,
	/**@type {HTMLCanvasElement}*/
	canvas: 0,
	draw() {
		this.canvas = document.createElement("canvas");
		var square2 = shapes.get("square-2");
		var {width, height} = canvas;
		this.canvas.width = canvas.width;
		this.canvas.height = canvas.height;
		var ctx = this.canvas.getContext("2d");
		var i = 0, h = height/12;
		this.h = h;
		ctx.font = `${h}px Arial`;
		var mw = 0;
		for(let {text} of this.list) {
			let {width: w} = ctx.measureText(text);
			w *= 1.1;
			if(w > mw) mw = w;
		}
		var len = this.list.length;
		for(let i = 0; i < len; i++) {
			let item = this.list[i];
			let {color, text} = item;
			let {width: w} = ctx.measureText(text);
			let x = (width - w)/2;
			let y = (i * h * 1.75) + h * 2;

			let w2 = mw;
			let x2 = (width - w2)/2;
			
			ctx.fillStyle = color;
			ctx.strokeStyle = "black";
			ctx.zoom(x2, y, w2, h * 1.3);
			ctx.fill(square2);
			ctx.resetTransform();
			ctx.lineWidth = h/10;
			let path = new Path2D();
			path.addPath(square2, ctx.zoomMatrix(x2, y, w2, h * 1.3));
			// ctx.stroke(path);
			item.path = path;

			ctx.fillStyle = "#000";
			ctx.fillText(text, x, y + h);
		}
	},
	list: [
		{
			text: "SinglePlayer",
			color: "#55f",
			use() {
				mainMenu.close();
				main();
			}
		},
		{
			text: "Multiplayer",
			color: "#f55",
			use() {
				mainMenu.close();
				multiplayer.startup();
			}
		},
		{
			text: "Options",
			color: "#5f5"
		}
	],
	run() {
		if(!this.canvas) this.draw();
		ctx.clear();
		ctx.drawImage(this.canvas, 0, 0);

		ctx.strokeStyle = "black";
		ctx.lineWidth = this.h/8;
		ctx.stroke(this.list[this.selected].path);

		if(keys.multi("KeyS") || keys.multi("ArrowDown")) {
			++this.selected;
		}
		if(keys.multi("KeyW") || keys.multi("ArrowUp")) {
			--this.selected;
		}
		if(keys.single("Enter") || keys.single("Space")) {
			this.list[this.selected].use?.();
		}
		this.selected += this.list.length;
		this.selected %= this.list.length;
	},
	close() {
		this.active = false;
		this.resize();
	},
	selected: 0,
	resize() {
		delete this.canvas;
	}
}