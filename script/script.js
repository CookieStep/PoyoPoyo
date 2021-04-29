var keys = new function KeyMap() {
	const keys = new Map;
	this.press = key => keys.has(key)?
		keys.set(key, 3): keys.set(key, 1);
	this.has = key => keys.has(key);
	this.release = key => keys.delete(key);
	this.first = key => keys.get(key) == 1;
	this.shadow = key => keys.get(key) & 1;

	this.use = key => this.has(key) && keys.set(key, 2);
	this.single = key => this.first(key) && this.use(key);
	this.multi = key => this.shadow(key) && this.use(key);
};

function start() {
	document.body.appendChild(canvas);
	resize();
	update();
}
var blobDownHandler = {
	update() {}
}
ctx.clear = () => ctx.clearRect(0, 0, innerWidth, innerHeight);;
async function update() {
	while(true) {
		var time = Date.now();
		var {lastFrame} = update;
		if(lastFrame) {
			deltaTime = time - lastFrame;
			gameTime += deltaTime;
		}
		update.lastFrame = time;
		if(!mainBlob) new Blob(Color.next());
		if(mainBlob.y >= Grid.lowest(mainBlob.x)) {
			blobs.pop();
			mainBlob = undefined;
		}
		var len = blobs.length;
		for(let b = 0; b < len; b++) {
			blob = blobs[b];
			await blob.update();
		}
		await Grid.fall();
		await delay(10);
	}
}
async function Inactive() {
	var gone = blobs.filter(blob => blob.inactive);
	if(gone.length) {
		console.log(gone);
		// var loops = 1;
		var itera = 40;
		for(let i = 0; i < 20; i++) {
			for(let blob of gone) {
				blob.dead = 1 - abs((i % itera) - itera/2)/itera * 2;
			}
			drawBlobs();
			await delay(1);
		}
	}
	blobs = blobs.filter(blob => !blob.inactive);
}
function drawBlobs() {
	ctx.clear();
	var x = Grid.width * scale + 1
	ctx.moveTo(x, 0);
	ctx.lineTo(x, innerHeight);
	ctx.stroke();
	for(let blob of blobs) blob.draw();
};
function resize() {
	assign(canvas, {
		width: innerWidth,
		height: innerHeight
	});
	scale = innerHeight/Grid.height;
}

addEventListener("keydown", ({code}) => keys.press(code));
addEventListener("keyup", ({code}) => keys.release(code));
addEventListener("focus", () => update.lastFrame = Date.now());
addEventListener("resize", resize);
addEventListener("load", start);