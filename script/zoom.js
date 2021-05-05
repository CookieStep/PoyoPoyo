CanvasRenderingContext2D.prototype.zoom = function(x, y, w, h) {
    return this.setTransform(w, 0, 0, h, x, y);
};
CanvasRenderingContext2D.prototype.zoomMatrix = function(x, y, w, h) {
    return assign(new DOMMatrix(), {
        a: w,
        b: 0,
        c: 0,
        d: h,
        e: x,
        f: y
    });
};