class Point{
	/**@param {number} x @param {number} y*/
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	/**@param {Point} point*/
	distanceTo(point) {
		return Point.distanceTo(this, point);
	}
	/**@param {Point} point*/
	radianTo(point) {
		return Point.radianTo(this, point);
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}
	/**@param {Point} point @param {Point} point2*/
	static radianTo(point, point2) {
		return atan2(point2.y - point.y, point2.x - point.x);
	}
	/**@param {Point} point @param {Point} point2*/
	static distanceTo(point, point2) {
		return sqrt((point.x - point2.x) ** 2 + (point.y - point2.y) ** 2);
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x * scale, this.y * scale, scale/10, 0, PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}