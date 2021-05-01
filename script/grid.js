var Grid = {
	async add(blob) {
		var {height, array} = this;
		var {x, y} = blob;
		y = this.lowest(x);
		blob.y = y;
		blob.active = false;
		array[y * height + x] = blob;

		blob.settle();
		mainBlob = false;
	},
	lowest(x) {
		for(var y = Grid.height - 1; y >= 0; --y) {
			if(!this.get(x, y)) return y;
		}
		return y;
	},
	clean() {
		var {array} = this;
		for(let blob of array) {
			if(!blob || !blob.inactive) continue;
			delete array[array.indexOf(blob)];
		}
	},
	async fall() {
		var {width, height} = this;
		var fall, moved, attach;
		var colors = new Set, amount = 0, groups = new Set, over = 0, length = 0;
		var add = () => length * amount * (colors.size + groups.size + over);
		function drawAdd() {
			var amo = add();
			if(amo) {
				var x = Grid.width * scale + 1
				
				ctx.fillStyle = "green";
				var h = innerHeight/20;
				x += scale * .4;
				ctx.font = `${h}px Arial`;

				ctx.fillText(`+${amo}`, x, h * 5.5);
			}
		}
		do{
			attach = false;
			moved = new Set;
			this.clean();
			let {groups: gc, amount: ac, colors: cc, over: oc} = await Inactive(drawAdd);
			if(ac) {
				colors = new Set([...cc, ...colors]);
				groups = new Set([...gc, ...groups]);
				amount += ac;
				over += oc;
				++length;
			}
			do{
				fall = false;
				let mov = new Set;
				for(let x = 0; x < width; x++) {
					for(let y = height - 2; y >= 0; --y) {
						let blob = this.get(x, y);
						if(blob && !this.get(x, y + 1)) {
							fall = true;
							attach = true;
							blob.falling = true;
							blob.unattach();
							moved.add(blob);
							mov.add(blob);
							this.delete(x, y);
							this.set(x, y + 1, blob);
						}
					}
				}
				this.reDraw();
				if(fall) for(let i = 0; i < 5; i++) {
					drawBlobs();
					for(let blob of mov) {
						blob.y += .2;
						blob.draw(ctx);
						blob.falling = false;
					}
					drawAdd();
					await frame();
				}
			}while(fall);
			var poof;
			for(let blob of moved) {
				blob.y = round(blob.y);
				blob.settle() && (poof = true);
				attach = true;
				blob.falling = false;
			}
			this.reDraw();
			drawBlobs();
			drawAdd();
			// if(poof) {
			// 	await delay(100);
			// 	console.log("Poof");
			// }
		}while(attach);
		score += add();
		update.lastFrame = Date.now();
	},
	/**@returns {Blob}*/
	get(x, y) {
		var {height, array} = this;
		return array[y * height + x];
	},
	set(x, y, blob) {
		var {height, array} = this;
		array[y * height + x] = blob;
	},
	delete(x, y) {
		var {height, array} = this;
		delete array[y * height + x];
	},
	resizeCanvas() {
		this.canvas.width = scale * this.width;
		this.canvas.height = scale * this.height;
		this.reDraw();
	},
	reDraw() {
		var {canvas, ctx} = this;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(let id in this.array) {
			let blob = this.array[id];
			if(!blob.falling) blob.draw(ctx);
		}
	},
	// get amount() {
	// 	return this.array.filter(blob => blob).length;
	// },
	width: 6,
	height: 12,
	canvas: document.createElement("canvas"),
	array: []
}
Grid.ctx = Grid.canvas.getContext("2d");