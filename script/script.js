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
ctx.clear = () => ctx.clearRect(0, 0, innerWidth, innerHeight);;
async function update() {
	await new Promise(resolve => addEventListener("mousedown", resolve));
	while(true) {
		var time = Date.now();
		var {lastFrame} = update;
		if(lastFrame) {
			deltaTime = time - lastFrame;
			gameTime += deltaTime;
		}
		update.lastFrame = time;
		music();
		if(!mainBlob) new Blob(Color.next());
		if(mainBlob.y >= Grid.lowest(mainBlob.x)) {
			blobs.delete(mainBlob);
			mainBlob = undefined;
		}
		for(let blob of blobs) {
			await blob.update();
		}
		await Grid.fall();
		await frame();
	}
}
async function Inactive() {
	var gone = [...blobs].filter(blob => blob.inactive);
	if(gone.length) {
		// console.log(gone);
		// var loops = 1;
		var itera = 40;
		for(let i = 0; i < 20; i++) {
			for(let blob of gone) {
				blob.dead = 1 - abs((i % itera) - itera/2)/itera * 2;
				blob.draw();
				if(i + 1 == 20) blobs.delete(blob);
			}
			drawBlobs();
			await frame();
		}
	}
}
function music() {
	var song;
	if(gameTime < 100000) {
		song = songs.get("Level1");
	}else{
		song = songs.get("Level2");
		songs.stop("Level1");
	}
	song.play();
	if(!song.H && blobs.length > 55) {
		song.switch(true);
	}else if(song.H && blobs.length < 45) {
		song.switch(false)
	}
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