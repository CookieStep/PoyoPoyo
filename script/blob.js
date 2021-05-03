class Blob{
	constructor(color) {
		this.color = color;
		this.shape = shapes.get("square-2");
		this.x = round(grid.width/2);
		this.by = grid.height;
		this.sx = this.x;
		this.bx = this.x;
		mainBlob = this;
		blobs.add(this);
	}
	check(n=this.x) {
		return this.y < grid.lowest(n);
	}
	settle() {
		var blobs = [
			[0, 1],
			[-1, 0],
			[1, 0]
		].map(([x, y]) => grid.get(this.x + x, this.y + y));
		for(let blob of blobs) {
			if(!blob || blob.color != this.color) continue;
			blob.attach(this);
		}
	}
	explode() {
		var blobs = [
			[0, 1],
			[-1, 0],
			[1, 0],
			[0, -1]
		].map(([x, y]) => grid.get(this.x + x, this.y + y));
		var barriers = [];
		for(let blob of blobs) {
			if(!blob || blob.color != -1) continue;
			barriers.push(blob);
		}
		return barriers;
	}
	attach(blob) {
		if(this.color != -1) {
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
	async update() {
		if(this.active) {
			if(this.color == -1) {
				var weights = [];
				for(let i = 0; i < grid.width; i++) {
					weights.push(grid.lowest(i) + 1);
				}
				this.x = weight(weights);

				this.active = false;
				while(this.y + 1 < grid.lowest(this.x)) {
					let a = main.speed(10);
					this.f += a * .3;
					this.y += a/5 * this.f;
					drawBlobs();
					await gameUpdate();
				}
				this.y = grid.height;

				grid.add(this);
			}else{
				if(keys.single("KeyF") || keys.single("ShiftRight")) {
					var {list} = Color;
					if(list[0] != -1) [list[0], this.color] = [this.color, list[0]];
				}
				if(keys.multi("KeyD") && this.check(this.x + 1)) ++this.x;
				if(keys.multi("ArrowRight") && this.check(this.x + 1)) ++this.x;
				if(keys.multi("KeyA") && this.check(this.x - 1)) --this.x;
				if(keys.multi("ArrowLeft") && this.check(this.x - 1)) --this.x;
				if(keys.has("KeyS") || keys.has("ArrowDown")) this.y += main.speed(50);// * (1 + gameTime/100000);
				else this.y += main.speed(500);// * (1 + gameTime/100000);

				if(this.x < 0) this.x = 0;
				if(this.x >= grid.width) this.x = grid.width - 1;

				if(keys.multi("KeyW") || keys.multi("ArrowUp")) {
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
				}

				this.sx = scrollTo(this.sx, this.x, main.speed(250))
				var y = grid.lowest(this.x);
				this.bx = snapTo(this.bx, this.x, main.speed(50));
				this.by = snapTo(this.by, y, main.speed(50));
				if(!this.check(this.x)) {
					grid.add(this);
				}
			}
		}
	}
	draw(ctx) {
		var {bx, by, shape, sx, x, y} = this;
		var color = Color.code[this.color];
		if(this.active) {
			ctx.zoom(bx * scale, by * scale, scale, scale);
			ctx.fillStyle = color + "a";
			ctx.lineWidth = 1/100;
			ctx.strokeStyle = "#000";
			ctx.fill(shape);
			ctx.stroke(shape);
			x = sx;
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