class Blob{
	constructor(color) {
		this.color = color;
		this.texture = (new Texture()
			.set("h", 1)
			.set("w", 1)
			.use(this)
				.for("x", "y")
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
		this.x = round(Grid.width/2);
		blobs.push(this);
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
	attach(blob) {
		var {group} = this;
		if(!group) {
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
			group.forEach(blob => blob.inactive = true);
			return true;
		}
	}
	unattach() {
		var {group} = this;
		if(group) {
			delete this.group;
			group.delete(this);
		}
	}
	update() {
		if(this.active) {
			if(keys.multi("KeyD") && this.check(this.x + 1)) ++this.x;
			if(keys.multi("ArrowRight") && this.check(this.x + 1)) ++this.x;
			if(keys.multi("KeyA") && this.check(this.x - 1)) --this.x;
			if(keys.multi("ArrowLeft") && this.check(this.x - 1)) --this.x;
			if(keys.has("KeyS") || keys.has("ArrowDown")) this.y += deltaTime/50;
			else this.y += deltaTime/500;

			if(keys.multi("KeyW") || keys.multi("ArrowUp")) this.y = Grid.height;

			if(this.x < 0) this.x = 0;
			if(this.x >= Grid.width) this.x = Grid.width - 1;
			if(!this.check(this.x)) {
				Grid.add(this);
			}
		}
	}
	draw() {
		this.texture.draw();
		this.glow.draw();
	}

	active = true;
	x = 0;
	y = -1;
	f = 0;
	t = 0;
	fall = 0;
	dead = 0;
}