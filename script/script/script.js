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
ctx.clear = () => {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, innerWidth, innerHeight);
};
async function update() {
	update.run = true;
	while(true) {
		if(!update.run) {
			await unpause;
		}
		var time = Date.now();
		var {lastFrame} = update;
		if(lastFrame) {
			deltaTime = time - lastFrame;
			gameTime += deltaTime;
		}
		update.lastFrame = time;
		if(++ticks % 1000 == 0) resize();
		music();
		if(!mainBlob) {
			await nextBlob();
			new Blob(Color.next());
		}
		if(mainBlob.y >= Grid.lowest(mainBlob.x)) {
			blobs.delete(mainBlob);
			mainBlob = undefined;
		}else await mainBlob.update();
		await Grid.fall();
		await frame();
	}
}
async function nextBlob() {
	for(let a = 0; a < 10; a++) {
		drawBlobs(a/10);
		await frame();
	}
}
async function Inactive(drawAdd) {
	var gone = [...blobs].filter(blob => blob.inactive);
	var groups = new Set;
	var colors = new Set;
	var over = 0;
	if(gone.length) {
		// console.log(gone);
		// var loops = 1;
		var itera = 40;
		for(let blob of gone) {
			colors.add(blob.color);
			let {group} = blob;
			if(group && !groups.has(group)) {
				groups.add(group);
				over += group.size - 4;
			}
		}
		for(let i = 0; i < 20; i++) {
			drawBlobs();
			drawAdd();
			for(let blob of gone) {
				blob.dead = 1 - abs((i % itera) - itera/2)/itera * 2;
				blob.draw(ctx);
				if(i + 1 == 20) blobs.delete(blob);
			}
			await frame();
		}
	}
	var amount = gone.length;
	return {amount, over, groups, colors};
}
function diffSpeed() {
	var speeds = [
		1,
		1.2,
		1.5
	];
	return speeds[diff];
}
function music() {
	var song;
	// }else{
	// 	song = songs.get("Level2");
	// 	songs.stop("Level1");
	if(gameTime < 100000) {
		diff = 0;
		song = songs.get("Level1");
	}else if(gameTime < 200000){
		diff = 1;
		song = songs.get("Level2");
		songs.stop("Level1");
	}else{
		song = songs.get("Level2");
		diff = 2;
	}
	song.play();
	if(!song.H && blobs.size > 45) {
		song.switch(true);
	}else if(song.H && blobs.size < 35) {
		song.switch(false)
	}
}
var drawBlob = function() {
	var shape = shapes.get("square-2");
	return function(x, y, color) {
		ctx.setTransform(scale, 0, 0, scale, x * scale, y * scale);
		ctx.fillStyle = Color.code[color];
		ctx.fill(shape);
		ctx.resetTransform();
	}
}();
var score = 0;
function drawBlobs(a=0) {
	ctx.clear();
	var x = Grid.width * scale + 1;
	ctx.moveTo(x, 0);
	ctx.lineTo(x, innerHeight);
	ctx.stroke();
	ctx.drawImage(Grid.canvas, 0, 0);
	if(mainBlob) mainBlob.draw(ctx);
	for(let i = 4 + ceil(a); i >= 0; i--) {
		if(i == 0) drawBlob(Grid.width + .3 + i * 1.3, .3 - (a * 1.3), Color.list[i]);
		else if(i != 5) drawBlob(Grid.width + .3 + (i - a) * 1.3, .3, Color.list[i]);
		else drawBlob(Grid.width + .3 + (i - 1) * 1.3, .3, Color.list[i]);
	}
	ctx.fillStyle = "black";
	var h = innerHeight/20;
	x += scale * .4;
	ctx.font = `${h}px Arial`;
	ctx.fillText(`${frameRate}ms`, x, innerHeight - h/2);
	ctx.fillText(`${round(10000/frameRate)/10}fps`, x, innerHeight - h * 3/2);

	ctx.fillText(`${score}`, x, h * 4);
};
function resize() {
	assign(canvas, {
		width: innerWidth,
		height: innerHeight
	});
	scale = innerHeight/Grid.height;
	Grid.resizeCanvas();
}

addEventListener("keydown", ({code}) => keys.press(code));
addEventListener("keyup", ({code}) => keys.release(code));
addEventListener("keypress", ({code}) => {
	songs.canPlay = true;
	if(code == "Minus") songs.forEach(song => song.volume(-.1));
	if(code == "Slash") songs.forEach(song => song.volume(-.1));
	if(code == "Equal") songs.forEach(song => song.volume(.1));
});
// addEventListener("focus", () => update.lastFrame = Date.now());
var unpause = 0;
addEventListener("blur", () => {
	update.run = false;
	unpause = new Promise(resolve => {
		var listener = () => {
			removeEventListener("focus", listener);
			update.lastFrame = Date.now()
			update.run = true;
			resolve();
		};
		addEventListener("focus", listener);
	});
});
addEventListener("resize", resize);
addEventListener("load", start);