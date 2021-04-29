class Path extends Path2D{
	constructor(path) {
		if(typeof path == "function") {
			super();
			path(this);
		}else super(path);
	}
}

/**@type {Map<string, Path>}*/
var shapes = new Map;
shapes.add = function(key, path) {
    this.set(key, new Path(path))
};

shapes.add("square", ctx =>
    ctx.rect(0, 0, 1, 1)
);
shapes.add("circle", ctx =>
    ctx.arc(.5, .5, .5, 0, PI * 2)
);
shapes.set("square-2", new Path(ctx => {
	var r = 1/3;
	ctx.moveTo(r, 0);
	ctx.lineTo(1 - r, 0);
	ctx.quadraticCurveTo(1, 0, 1, 0 + r);
	ctx.lineTo(1, 1 - r);
	ctx.quadraticCurveTo(1, 1, 1 - r, 1);
	ctx.lineTo(r, 1);
	ctx.quadraticCurveTo(0, 1, 0, 1 - r);
	ctx.lineTo(0, r);
	ctx.quadraticCurveTo(0, 0, r, 0);
}));