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
    },

    /**
     * Draws the given vector vec originating to the point given by another
     * vector, pos.
     * @param {Vector2} pos The origin.
     * @param {Vector2} vec The vector to draw.
     */
    drawVector: function(ctx, pos, vec) {
        var w = ctx.lineWidth;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(vec.polarAngle() - 0.5 * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        var l = vec.norm();
        ctx.lineTo(0, l - w);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, l);
        ctx.lineTo(-0.86 * w, l - 2 * w);
        ctx.lineTo(0.86 * w, l - 2 * w);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
};

