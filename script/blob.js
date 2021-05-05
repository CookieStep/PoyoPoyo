class Blob{
	constructor(color) {
		this.color = color;
		this.shape = shapes.get("square-2");
		// this.texture = (new Texture()
		// 	.set("h", 1)
		// 	.set("w", 1)
		// 	.use(this)
		// 		.for("y")
		// 	.link("x", () => {
		// 		if(this.active) return this.sx;
		// 		else return this.x;
		// 	})
		// 	.set("shape", shapes.get("square-2"))
		// 	.link("fill", () => Color.code[this.color])
		// );
		// this.glow = (new Texture()
		// 	.set("h", 1)
		// 	.set("w", 1)
		// 	.use(this)
		// 		.for("x", "y")
		// 	.set("shape", shapes.get("square-2"))
		// 	.link("fill", () => `rgba(255, 255, 255, ${this.dead})`)
		// );
		// this.bottom = (new Texture()
		// 	.set("h", 1)
		// 	.set("w", 1)
		// 	.use(this)
		// 		.as(
		// 			["bx", "x"],
		// 			["by", "y"]
		// 		)
		// 	.set("shape", shapes.get("square-2"))
		// 	.link("fill", () => Color.code[this.color] + "a")
		// 	.set("stroke", "#000")
		// );
		this.x = round(grid.width/2);
		this.by = grid.height;
		this.sx = this.x;
		this.bx = this.x;
		mainBlob = this;
		blobs.add(this);
	}
	slip(n=this.x) {
		return this.y - 1 < grid.lowest(n);
	}
	check(n=this.x) {
		return this.y < grid.lowest(n);
	}
	zombify() {
		this.color = Color.zombie;
		if(this.group) {
			this.group.delete(this);
			delete this.group;
		}
	}
	settle() {
		if(this.color == Color.barrier) return;
		if(this.color == Color.zombie) {
			this.explode().forEach(blob => (blob.zombify(), blob.attach(this)));
		}else{
			var blobs = [
				[0, 1],
				[-1, 0],
				[1, 0]
			].map(([x, y]) => grid.get(this.x + x, this.y + y));
			for(let blob of blobs) {
				if(!blob || (blob.color != this.color && blob.color != Color.rainbow && this.color != Color.rainbow)) continue;
				blob.attach(this);
			}
		}
	}
	explode() {
		if(this.color == Color.barrier) return;
		var blobs = [
			[0, 1],
			[-1, 0],
			[1, 0],
			[0, -1]
		].map(([x, y]) => grid.get(this.x + x, this.y + y));
		var barriers = [];
		if(this.color == Color.zombie) {
			return blobs.filter(blob => blob);
		}else{
			for(let blob of blobs) {
				if(!blob || (blob.color != Color.barrier && blob.color != Color.zombie)) continue;
				barriers.push(blob);
			}
		}
		return barriers;
	}
	attach(blob) {
		if(this.color != Color.barrier) {
			var {group} = this;
			if(!group) {
				/**@type {Set<Blob>}*/
				this.group = group = new Set([this]);
			}
			if(!blob.group) {
				group.add(blob);
				blob.group = group;
			}else{
				var group = new Set([...group, ...blob.group]);
				for(let blob of group) {
					blob.group = group;
				}
			}
			if(group.size >= 4) {
				var allZom = true,
					hasZom = false;
				for(let blob of group) {
					if(blob.color == Color.zombie) hasZom = true;
					else allZom = false;
				}
				if(allZom) return;
				/**@type {Blob[][]}*/
				var barriers = [];
				for(let blob of group) {
					barriers.push(blob.explode());
					blob.inactive = true;
				}
				barriers.flat().forEach(barrier => {
					barrier.inactive = true;
				});
				return true;
			}
		}
	}
	unattach() {
		var {group} = this;
		if(group) {
			delete this.group;
			group.delete(this);
		}
	}
	pickX() {
		var weights = [];
		for(let i = 0; i < grid.width; i++) {
			weights.push((grid.lowest(i) + 1) ** 2);
		}
		this.x = weight(weights);
	}
	async update() {
		if(this.active) {
			if(this.color == Color.barrier || this.color == Color.zombie) {
				if(!multiplayer) {
					this.pickX();
				}
				this.active = false;
				while(this.y + 1 < grid.lowest(this.x)) {
					let a = main.speed(10);
					this.f += a * .3;
					this.y += a/5 * this.f;
					drawBlobs();
					await gameUpdate();
				}
				this.f = 0;
				this.y = grid.height;

				grid.add(this);
			}else{
				if(keys.single("KeyE") || keys.single("ShiftRight")) {
					var {list} = Color;
					if(list[0] != Color.barrier && list[0] != Color.zombie) [list[0], this.color] = [this.color, list[0]];
				}
				var moved;
				if(keys.multi("KeyD") && this.slip(this.x + 1)) {
					++this.x;
					moved = true;
				}
				if(keys.multi("ArrowRight") && this.slip(this.x + 1)) {
					++this.x;
					moved = true;
				}
				if(keys.multi("KeyA") && this.slip(this.x - 1)) {
					--this.x;
					moved = true;
				}
				if(keys.multi("ArrowLeft") && this.slip(this.x - 1)) {
					--this.x;
					moved = true;
				}
				if(keys.has("KeyS") || keys.has("ArrowDown")) this.y += main.speed(50);// * (1 + gameTime/100000);
				else this.y += main.speed(500);// * (1 + gameTime/100000);

				if(this.x < 0) this.x = 0;
				if(this.x >= grid.width) this.x = grid.width - 1;
				
				if(moved && multiplayer) {
					multiplayer.sendX();
				}

				if(keys.multi("KeyW") || keys.multi("ArrowUp")) {
					this.active = true;
					this.safety = false;
					while(this.y + 1 < grid.lowest(this.x)) {
						let a = main.speed(10);
						this.f += a * .3;
						this.y += a/5 * this.f;
						drawBlobs();
						await gameUpdate();
					}
					this.f = 0;
					this.y = grid.height;
				}

				this.sx = scrollTo(this.sx, this.x, main.speed(250))
				var y = grid.lowest(this.x);
				this.bx = snapTo(this.bx, this.x, main.speed(50));
				this.by = snapTo(this.by, y, main.speed(50));
				if(!this.check(this.x)) {
					if(this.safety > 0) {
						this.safety -= main.speed(500);
						this.y = grid.lowest(this.x);
					}else grid.add(this);
				}
			}
		}
	}
	draw(ctx) {
		var {bx, by, shape, sx, x, y} = this;
		var color = Color.code[this.color];
		if(this.active) {
			ctx.zoom(bx * scale, by * scale, scale, scale);
			ctx.fillStyle = color;
			ctx.globalAlpha = 0.5;
			ctx.lineWidth = 1/50;
			ctx.strokeStyle = `rgba(0, 0, 0, ${this.safety})`;
			ctx.fill(shape);
			ctx.globalAlpha = 1;
			ctx.stroke(shape);
			x = bx;
		}
		ctx.zoom(x * scale, y * scale, scale, scale);
		ctx.fillStyle = color;
		ctx.fill(shape);
		if(this.dead) {
			ctx.fillStyle = `rgba(255, 255, 255, ${this.dead})`;
			ctx.fill(shape);
		}
		ctx.resetTransform();
	}

	active = true;
	inactive = false;
	safety = 1;
	x = 0;
	y = -1;
	f = 0;
	t = 0;
	fall = 0;
	dead = 0;
}
var mainBlob;

function scrollTo(num, to, m) {
	if(abs(num - to) < m) return to;
	else return num + m * sign(to - num);
}
function snapTo(num, to, m) {
	if(abs(num - to) < m) return to;
	else return num + m * (to - num);
}