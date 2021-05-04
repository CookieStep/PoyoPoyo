class Grid{
	async add(blob) {
		var {height, array} = this;
		var {x, y} = blob;
		y = this.lowest(x);
		blob.y = y;
		blob.active = false;
		array[y * height + x] = blob;

		blob.settle();
		mainBlob = false;
		this.reDraw();
	}
	lowest(x) {
		for(var y = grid.height - 1; y >= 0; --y) {
			if(!this.get(x, y)) return y;
		}
		return y;
	}
	clean() {
		var {array} = this;
		for(let blob of array) {
			if(!blob || !blob.inactive) continue;
			delete array[array.indexOf(blob)];
		}
	}
	async fall() {
		var {width, height} = this;
		var fall, moved, attach;
		var colors = new Set, amount = 0, groups = new Set, over = 0, length = 0;
		var O = {size: 0};
		var add = (l=0, a=0, c=O, g=O, o=0) => round((length + l) * (amount + a) * ((c.size || colors.size) + (g.size || groups.size) + over + o));
		function drawAdd(l=0, a=0, c=O, g=O, o=0) {
			var amo = add();
			var x = grid.width * scale + 1;
			
			var h = innerHeight/20;
			x += scale * .4;
			ctx.font = `${h}px Arial`;
			if(amo) {
				ctx.fillStyle = "green";
				ctx.fillText(`+${amo}`, x, h * 5.5);
			}
			if(l) {
				var baa = add(l, a, new Set([...c, ...colors]), new Set([...g, ...groups]), o) - amo;
				// ctx.fillStyle = "green";
				ctx.fillText(`+${baa}`, x, h * 7);
			}
		}
		do{
			attach = false;
			moved = new Set;
			this.clean();
			let {groups: gc, amount: ac, colors: cc, over: oc} = await Inactive(drawAdd);
			if(ac) {
				this.reDraw();
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
							blob.t = y + 1;
							blob.unattach();
							moved.add(blob);
							mov.add(blob);
							this.delete(x, y);
							blob.falling = true;
							this.set(x, y + 1, blob);
						}
					}
				}
				if(fall) {
					this.reDraw();
					let fall;
					do{
						let a = main.speed(20);
						fall = false;
						drawBlobs();
						for(let blob of mov) {
							blob.f += .3 * a;
							blob.y += a/5 * blob.f;
							if(blob.y > blob.t) {
								blob.y = blob.t;
							}else fall = true;
							blob.draw(ctx);
							blob.falling = false;
						}
						drawAdd();
						await gameUpdate();
					}while(fall);
				}
			}while(fall);
			for(let blob of moved) {
				blob.y = blob.t;
				blob.f = 0;
				blob.settle();
				attach = true;
				blob.falling = false;
			}
			if(attach) this.reDraw();
			drawBlobs();
			drawAdd();
		}while(attach);
		score += add();
		main.lastFrame = Date.now();
	}
	/**@returns {Blob}*/
	get(x, y) {
		var {height, array} = this;
		return array[y * height + x];
	}
	set(x, y, blob) {
		var {height, array} = this;
		array[y * height + x] = blob;
	}
	delete(x, y) {
		var {height, array} = this;
		delete array[y * height + x];
	}
	resizeCanvas() {
		this._resizeCanvas();
		this.reDraw();
	}
	_resizeCanvas() {
		var {canvas, width, height} = this;
		canvas.width = scale * width;
		canvas.height = scale * height;
	}
	reDraw() {
		var {canvas, ctx} = this;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(let id in this.array) {
			let blob = this.array[id];
			if(!blob.falling) blob.draw(ctx);
		}
	}
	constructor() {
		var {canvas} = Grid;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}
	static canvas = document.createElement("canvas");
	// get amount() {
	// 	return this.array.filter(blob => blob).length;
	// },
	width = 6;
	height = 12;
	array = [];
}
/**@type {Grid}*/
var grid;