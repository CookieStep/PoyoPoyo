interface Texture{
	/**Set property to a static value*/
	set<prop extends keyof TextureValues>(prop: prop, value: TextureValues[prop]): this;
	/**Set property to a dynamic value*/
	link<prop extends keyof TextureValues>(prop: prop, callback: () => TextureValues[prop]): this;

	use(ref: object): this;
	as(...entries: [string, keyof TextureValues | (keyof TextureValues)[]][]): this;
	for(...params: (keyof TextureValues)[]): this;
}
interface TextureValues{
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
	fill: string,
	stroke: string,
	blur: {
		color: string,
		rad: number
	},
	shape: Path | Path2D
}