var CanvasHelper = {
    /**
     * Draws a circle.
     */
    drawCircle: function(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2.0 * Math.PI, false);
        ctx.fill();
    }
};

