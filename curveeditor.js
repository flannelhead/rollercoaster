/**
 * A self-contained curve editor. Only the canvas needs to be given.
 * @param canvas The canvas to draw to.
 * @constructor
 */
function CurveEditor(canvas) {
    this.curve = null;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // Precalculated points along the curve are stored in 'line'.
    this.line = [];
    // Store the points states.
    this.pointStates = [];
    // Indicates whether we're dragging any point or not.
    this.dragging = false;
    // Which point are we dragging?
    this.dragIndex = -1;
    // Hook the canvas mouse events (hack to get 'this' right).
    this.canvas.onmousedown = this.mouseDown.bind(this);
    this.canvas.onmouseup = this.mouseUp.bind(this);
    this.canvas.onmousemove = this.mouseMove.bind(this);
    // Some drawing params.
    this.curveWidth = 4.0;
    this.curveColor = '#073642';
    this.outlineWidth = 2.0;
    this.outlineColor = '#93a1a1';
    this.pointRadius = 6.0;
    this.grabRadius = 1.25 * this.pointRadius;
    this.pointRadius2 = Math.pow(this.pointRadius, 2);
    this.grabRadius2 = Math.pow(this.grabRadius, 2);
    // Number of steps to take when drawing the curve.
    this.steps = 200;
    // Control point colors: STATIC, HOVER, DRAG
    this.pointColors = ['#dc322f', '#b58900', '#859900'];
    this.initPadding = 50.0;
}

CurveEditor.PointState = {
    STATIC: 0,
    HOVER: 1,
    DRAG: 2
};

CurveEditor.CurveType = {
    BEZIER: 0,
    SPLINE: 1
};

/**
 * Creates a linear Bezier curve of the given order.
 * @param {number} order The order of the curve.
 */
CurveEditor.prototype.createLinear = function(order, type) {
    // Create the required number of intermediate control points by 
    // interpolation.
    var points = [];
    this.pointStates = [];
    this.dragging = false;
    this.dragIndex = -1;
    var start = new Vector2(this.initPadding, this.canvas.height / 2);
    var end = new Vector2(this.canvas.width - this.initPadding,
        this.canvas.height / 2);
    var delta = end.sub(start);
    for (var i = 0; i <= order; i++) {
        points.push(start.add(delta.mul(i / order)));
        // All the points should be static at this time.
        this.pointStates.push(CurveEditor.PointState.STATIC);
    }
    // Create a new curve object.
    if (type === CurveEditor.CurveType.BEZIER) {
        this.curve = new Bezier2(points);
    } else {
        this.curve = new CubicSpline2(points);
    }
    this.updateCurve();
};

/**
 * Precalculates some points along the curve for drawing.
 */
CurveEditor.prototype.updateCurve = function() {
    this.curve.update();
    this.line = [];
    var dt = 1.0 / this.steps;
    var t = 0;
    for (var i = 0; i <= this.steps; i++) {
        this.line.push(this.curve.f(t));
        t += dt;
    }
};

/**
 * Draws the curve and optionally the editor interface.
 * @param {boolean} editing
 */
CurveEditor.prototype.draw = function(editing) {
    this.ctx.save();
    if (editing === true) {
        this.ctx.lineJoin = 'round';
        // Draw the outline of the control points.
        this.ctx.strokeStyle = this.outlineColor;
        this.ctx.lineWidth = this.outlineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.curve.points[0].x, this.curve.points[0].y);
        this.curve.points.forEach(function(point, index, array) {
            this.ctx.lineTo(point.x, point.y);
        }, this);
        this.ctx.stroke();
    }
    // Draw the Bezier curve.
    this.ctx.strokeStyle = this.curveColor;
    this.ctx.lineWidth = this.curveWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(this.line[0].x, this.line[0].y);
    this.line.forEach(function(point, index, array) {
        this.ctx.lineTo(point.x, point.y);
    }, this);
    this.ctx.stroke();
    if (editing === true) {
        // Draw the control points
        this.curve.points.forEach(function(point, index, array) {
            this.ctx.fillStyle = this.pointColors[this.pointStates[index]];
            CanvasHelper.drawCircle(this.ctx, point.x, point.y,
                this.pointRadius);
        }, this);
    }

    this.ctx.restore();
};

CurveEditor.prototype.mouseDown = function(event) {
    var coords = this.eventCoords(event);
    this.curve.points.some(function(point, index, array) {
        if (Math.pow(coords.x - point.x, 2) + 
            Math.pow(coords.y - point.y, 2) < this.grabRadius2) {
            this.pointStates[index] = CurveEditor.PointState.DRAG;
            this.dragging = true;
            this.dragIndex = index;
            return true;
        } else {
            return false;
        }
    }, this);
};

CurveEditor.prototype.mouseUp = function(event) {
    if (this.dragging === true) {
        this.pointStates[this.dragIndex] = CurveEditor.PointState.HOVER;
        this.dragging = false;
        this.dragIndex = -1;
    }
};

CurveEditor.prototype.mouseMove = function(event) {
    var coords = this.eventCoords(event);
    if (this.dragging === true) {
        this.curve.points[this.dragIndex] = coords;        
        this.updateCurve();
    } else if (this.dragging === false) {
        this.curve.points.forEach(function(point, index, array) {
            if (Math.pow(coords.x - point.x, 2) +
                Math.pow(coords.y - point.y, 2) > this.pointRadius2) {
                this.pointStates[index] = CurveEditor.PointState.STATIC;
            } else {
                this.pointStates[index] = CurveEditor.PointState.HOVER;
            }
        }, this);
    }
};

/**
 * Convert the event's coordinates to the canvas' coordinate system.
 * param event The event object.
 * return {Vector2} The coordinates.
 */
CurveEditor.prototype.eventCoords = function(event) {
    // TODO: better coordinate conversion.
    // This will do as long as the page fits on the screen without scrolling.
    var x = event.clientX - this.canvas.offsetLeft;
    var y = event.clientY - this.canvas.offsetTop;
    return new Vector2(x, y);
};

