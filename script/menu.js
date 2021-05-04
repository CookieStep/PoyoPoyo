async function update() {
	while(true) {
		if(main.run) {
			if(!main.paused) {
				resPromises();
				if(!main.running) main();
			}else{
				pauseMenu.run();
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
		if(!this.canvas) {
			this.draw();
		}
		ctx.drawImage()
	},
	draw() {
		this.canvas = document.createElement("canvas");
		var ctx = this.canvas.getContext("2d");
		ctx.drawImage(canvas, 0, 0);
	},
	/**@type {HTMLCanvasElement}*/
	canvas: 0,
	resize() {
		delete this.canvas;
	}
}