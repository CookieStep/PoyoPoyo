CanvasRenderingContext2D.prototype.zoom = function(x, y, w, h) {
    return this.setTransform(w, 0, 0, h, x, y);
};