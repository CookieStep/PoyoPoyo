async function main() {
	if(main.running) return;
	main.run = true;
    main.running = true;
    grid = new Grid;
    blobs = new Set;
    deltaTime = 0;
    gameTime = 0;
    ticks = 0;
    diff = 0;
	Color.list = [];
	Color.list.unshift(Color.next());
    resize();
	while(true) {
		if(!main.run) {
			await gameUpdate();
		}
		ticks %= 100;
		if(ticks++ == 0) resize();
		music();
		if(!mainBlob) {
			await nextBlob();
			new Blob(Color.next());
			if(mainBlob.y >= grid.lowest(mainBlob.x)) {
				blobs.delete(mainBlob);
				mainBlob = undefined;
			}else if(multiplayer) {
				multiplayer.updatePlace();
			}
		}
		if(mainBlob) await mainBlob.update();
		await grid.fall();
		if(multiplayer) await multiplayer.dropBad();
		await gameUpdate();
	}
}
main.speed = n => deltaTime * diffSpeed()/n;
async function nextBlob() {
	for(let a = 0; a < 10; a += main.speed(20)) {
		drawBlobs(a/10);
		await gameUpdate();
	}
}
async function Inactive(drawAdd) {
	var gone = [...blobs].filter(blob => blob.inactive);
	var groups = new Set;
	var colors = new Set;
	var over = 0;
	if(gone.length) {
		var itera = 40;
		for(let blob of gone) {
			colors.add(blob.color);
			let {group} = blob;
			if(group && !groups.has(group)) {
				groups.add(group);
				over += group.size - 4;
			}
		}
		for(let i = 0; i < 20; i += main.speed(10)) {
			drawBlobs();
			drawAdd(1, gone.length, colors, groups, over);
			for(let blob of gone) {
				blob.dead = 1 - abs((i % itera) - itera/2)/itera * 2;
				blob.draw(ctx);
                blobs.delete(blob);
			}
            await gameUpdate();
		}
	}
	var amount = gone.length;
	return {amount, over, groups, colors};
}
function diffSpeed() {
	var speeds = [
		1,
		1.2,
		1.5,
		2
	];
	return speeds[diff];
}
function music() {
	if(!multiplayer) {
		var song;
		// }else{
		// 	song = songs.get("Level2");
		// 	songs.stop("Level1");
		if(gameTime < 100000) {
			diff = 0;
			song = songs.get("Level1");
		}else if(gameTime < 200000) {
			diff = 1;
			song = songs.get("Level2");
			songs.stop("Level1");
		}else if(gameTime < 300000) {
			song = songs.get("Level2");
			diff = 2;
		}else{
			song = songs.get("Level2");
			diff = 3;
		}
		song.play();
		if(!song.H && blobs.size > 45) {
			song.switch(true);
		}else if(song.H && blobs.size < 35) {
			song.switch(false)
		}
	}else{

	}
}
var drawBlob = function() {
	var mctx = () => ctx;
	var shape = shapes.get("square-2");
	return function(x, y, color, ctx=mctx()) {
		ctx.zoom(x * scale, y * scale, scale, scale);
		ctx.fillStyle = Color.code[color];
		ctx.fill(shape);
		ctx.resetTransform();
	}
}();
var score = 0;
function drawBlobs(a=0) {
	ctx.clear();
	var x = grid.width * scale + 1;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
	ctx.moveTo(x, 0);
	ctx.lineTo(x, innerHeight);
	ctx.stroke();
	if(multiplayer) {
		let grid = multiplayer.enemyGrid.canvas;
		ctx.drawImage(grid, innerWidth - grid.width, 0);
		let x = innerWidth - (grid.width + 1);
		ctx.moveTo(x, 0);
		ctx.lineTo(x, innerHeight);
		ctx.stroke();
	}
	ctx.drawImage(grid.canvas, 0, 0);
	if(mainBlob) mainBlob.draw(ctx);
	for(let i = 4 + ceil(a); i >= 0; i--) {
		if(i == 0) drawBlob(grid.width + .3 + i * 1.3, .3 - (a * 1.3), Color.list[i]);
		else if(i != 5) drawBlob(grid.width + .3 + (i - a) * 1.3, .3, Color.list[i]);
		else drawBlob(grid.width + .3 + (i - 1) * 1.3, .3, Color.list[i]);
	}
	if(multiplayer) {
		multiplayer.drawBad();
	}
	ctx.fillStyle = "black";
	var h = innerHeight/20;
	x += scale * .4;
	ctx.font = `${h}px Josefin Sans`;
	ctx.fillText(`${frameRate}ms`, x, innerHeight - h/2);
	ctx.fillText(`${round(10000/frameRate)/10}fps`, x, innerHeight - h * 3/2);
	ctx.fillText(`Level ${diff + 1}`, x, innerHeight - h * 5/2);

	ctx.fillText(`${score}`, x, h * 4);
};
function resize() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	if(grid) {
        scale = innerHeight/grid.height;
	    grid.resizeCanvas();
		if(multiplayer) {
			multiplayer.enemyGrid.resizeCanvas();
		}
    }else{
        scale = 40;
    }
	mainMenu.resize();
	pauseMenu.resize();
}