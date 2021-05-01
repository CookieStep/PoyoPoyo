class Blob{
	constructor(color) {
		this.color = color;
		this.texture = (new Texture()
			.set("h", 1)
			.set("w", 1)
			.use(this)
				.for("y")
			.link("x", () => {
				if(this.active) return this.sx;
				else return this.x;
			})
			.set("shape", shapes.get("square-2"))
			.link("fill", () => Color.code[this.color])
		);
		this.glow = (new Texture()
			.set("h", 1)
			.set("w", 1)
			.use(this)
				.for("x", "y")
			.set("shape", shapes.get("square-2"))
			.link("fill", () => `rgba(255, 255, 255, ${this.dead})`)
		);
		this.bottom = (new Texture()
			.set("h", 1)
			.set("w", 1)
			.use(this)
				.as(
					["bx", "x"],
					["by", "y"]
				)
			.set("shape", shapes.get("square-2"))
			.link("fill", () => Color.code[this.color] + "a")
			.set("stroke", "#000")
		);
		if(color == -1) {
			var weights = [];
			for(let i = 0; i < Grid.width; i++) {
				weights.push(Grid.lowest(i) + 1);
			}
			this.x = weight(weights);
		}else{
			this.x = round(Grid.width/2);
		}
		this.by = Grid.height;
		this.sx = this.x;
		this.bx = this.x;
		mainBlob = this;
		blobs.add(this);
	}
	check(n=this.x) {
		return this.y < Grid.lowest(n);
	}
	settle() {
		var blobs = [
			[0, 1],
			[-1, 0],
			[1, 0]
		].map(([x, y]) => Grid.get(this.x + x, this.y + y));
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
		].map(([x, y]) => Grid.get(this.x + x, this.y + y));
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
				this.active = false;
				while(this.y + 1 < Grid.lowest(this.x)) {
					this.y += 1;
					drawBlobs();
					await frame();
				}
				this.y = Grid.height;

				Grid.add(this);
			}else{
				if(keys.single("KeyE") || keys.single("ShiftRight")) {
					var {list} = Color;
					if(list[0] != -1) [list[0], this.color] = [this.color, list[0]];
				}
				if(keys.multi("KeyD") && this.check(this.x + 1)) ++this.x;
				if(keys.multi("ArrowRight") && this.check(this.x + 1)) ++this.x;
				if(keys.multi("KeyA") && this.check(this.x - 1)) --this.x;
				if(keys.multi("ArrowLeft") && this.check(this.x - 1)) --this.x;
				if(keys.has("KeyS") || keys.has("ArrowDown")) this.y += deltaTime/50 * diffSpeed();// * (1 + gameTime/100000);
				else this.y += deltaTime/500 * diffSpeed();// * (1 + gameTime/100000);

				if(this.x < 0) this.x = 0;
				if(this.x >= Grid.width) this.x = Grid.width - 1;

				if(keys.multi("KeyW") || keys.multi("ArrowUp")) {
					this.active = false;
					while(this.y + 1 < Grid.lowest(this.x)) {
						this.y += 1 * diffSpeed();
						drawBlobs();
						await frame();
					}
					this.y = Grid.height;
				}

				this.sx = scrollTo(this.sx, this.x, 0.1 * diffSpeed())
				var y = Grid.lowest(this.x);
				this.bx = snapTo(this.bx, this.x, 0.5 * diffSpeed());
				this.by = snapTo(this.by, y, 0.5 * diffSpeed());
				if(!this.check(this.x)) {
					Grid.add(this);
				}
			}
		}
	}
	draw(ctx) {
		if(this.active) this.bottom.draw(ctx);
		this.texture.draw(ctx);
		if(this.dead) this.glow.draw(ctx);
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