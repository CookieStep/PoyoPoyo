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
	main();
	update();
}
ctx.clear = () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
};

addEventListener("keydown", ({code}) => keys.press(code));
addEventListener("keyup", ({code}) => keys.release(code));
addEventListener("keypress", ({code}) => {
	songs.canPlay = true;
	if(code == "Minus") songs.forEach(song => song.volume(-.1));
	if(code == "Slash") songs.forEach(song => song.volume(-.1));
	if(code == "Equal") songs.forEach(song => song.volume(.1));
});
addEventListener("blur", () => {
	main.run = false;
	var listener = () => {
		removeEventListener("focus", listener);
		main.lastFrame = Date.now();
		main.run = true;
	};
	addEventListener("focus", listener);
});
addEventListener("resize", resize);
addEventListener("load", start);