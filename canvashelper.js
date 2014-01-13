var CanvasHelper = {
    /**
     * Draws a circle.
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     */
    drawCircle: function(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2.0 * Math.PI, false);
        ctx.fill();
    }
};

