/**
 * Creates a new rollercoaster simulation engine instance.
 * @constructor
 */
function RcEngine(canvas, dt, startButton, stopButton, resetButton, mass, 
    grav, controlPoints, curveType, solver, force) {
    // Get the handles of the UI components.
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.startButton = startButton;
    this.startButton.onclick = this.start.bind(this);
    this.stopButton = stopButton;
    this.stopButton.onclick = this.stop.bind(this);
    this.controlPoints = controlPoints;
    this.controlPoints.onchange = this.resetCurve.bind(this);
    this.curveType = curveType;
    this.curveType.onchange = this.resetCurve.bind(this);
    this.resetButton = resetButton;
    this.resetButton.onclick = this.resetCurve.bind(this);
    this.dt = dt;
    this.dt.onchange = this.resetOde.bind(this);
    this.solver = solver;
    this.solver.onchange = this.resetOde.bind(this);
    this.force = force;
    this.drawForce = this.force.checked;
    this.grav = grav;
    this.mass = mass;
    // Initialize the curve editor.
    this.editor = new CurveEditor(this.canvas);
    this.resetCurve();
    // Initialize the integrator.
    this.odeArgs = {};
    this.resetOde();
    // For protection - see function draw.
    this.maxFrameLength = 10 * 1 / 60.0;
    this.animating = false;
}

/**
 * Reset the curve.
 */
RcEngine.prototype.resetCurve = function() {
    var order = parseInt(this.controlPoints.value, 10) - 1;
    var type = parseInt(this.curveType.value, 10);
    this.editor.createLinear(order, type);
};

/**
 * Reset the ODE solver.
 */
RcEngine.prototype.resetOde = function() {
    var solver = parseInt(this.solver.value, 10);
    var dt = parseFloat(this.dt.value) * 1e-3;
    if (solver === 0) {
        this.ode = new OdeEuler(RcEngine.f, dt, this.odeArgs);
    } else {
        this.ode = new OdeRK4(RcEngine.f, dt, this.odeArgs);
    }
};

/**
 * Start the animation.
 */
RcEngine.prototype.start = function() {
    // Initialize ODE parameters.
    this.odeArgs.curve = this.editor.curve;
    this.odeArgs.g = -1.0 * parseFloat(this.grav.value);
    this.odeArgs.m = parseFloat(this.mass.value);
    this.ode.t = null;
    this.ode.y = [0.0, 0.0];
    // Disable controls.
    this.startButton.style.display = 'none';
    this.stopButton.style.display = 'inline';
    this.resetButton.disabled = true;
    this.grav.disabled = true;
    this.mass.disabled = true;
    this.dt.disabled = true;
    this.solver.disabled = true;
    this.force.disabled = true;
    this.controlPoints.disabled = true;
    this.curveType.disabled = true;
    this.animating = true;
    this.drawForce = this.force.checked;
};

/**
 * Stop the animation.
 */
RcEngine.prototype.stop = function() {
    this.animating = false;
    this.stopButton.style.display = 'none';
    this.startButton.style.display = 'inline';
    this.resetButton.disabled = false;
    this.grav.disabled = false;
    this.mass.disabled = false;
    this.dt.disabled = false;
    this.solver.disabled = false;
    this.force.disabled = false;
    this.controlPoints.disabled = false;
    this.curveType.disabled = false;
};

/**
 * Draws a frame.
 * @param {number} timestamp The timestamp.
 */
RcEngine.prototype.draw = function(timestamp) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.editor.draw(!(this.animating));

    if (this.animating === true) {
        var t = timestamp * 1e-3;
        if (this.ode.t === null) {
            this.ode.t = t;
        }
        // If it has been too long since the last frame, we'll have too much
        // computation to do, so just skip this frame and hope for the best. 
        // For example, this happens when the browser window or tab has been
        // inactive for some time.
        if (t - this.ode.t > this.maxFrameLength) {
            this.ode.t = t;
        }

        this.ode.integrate(t);
        if (this.ode.y[0] <= 1.0 && this.ode.y[0] >= 0.0) {
            var pt = this.editor.curve.f(this.ode.y[0]);
            if (this.drawForce === true) {
                this.ctx.strokeStyle = '#859900';
                this.ctx.lineWidth = 3;
                CanvasHelper.drawVector(this.ctx, pt, 
                    new Vector2(this.odeArgs.Fx, this.odeArgs.Fy));
            }

            this.ctx.fillStyle = '#268bd2';
            CanvasHelper.drawCircle(this.ctx, pt.x, pt.y, 10.0);
        } else {
            this.stop();
        }
    }
};

/**
 * The right hand side of the equation of motion of the cart.
 * @param {number} t The value of time.
 * @param {Array.<number>} y The array containing the variables y_i - in this
 * case displacement and velocity.
 * @param {Object} argsObj The additional arguments supplied to the function.
 * @return {Array.<number>} The result of the function.
 */
RcEngine.f = function(t, y, argsObj) {
    var bd = argsObj.curve.d(y[0]);
    var bdd = argsObj.curve.dd(y[0]);
    var a = -1.0 / bd.squaredNorm() * (bd.dot(bdd) * Math.pow(y[1], 2) +
        argsObj.g * bd.y);
    argsObj.Fx = argsObj.m * (bdd.x * Math.pow(y[1], 2) + bd.x * a);
    argsObj.Fy = argsObj.m * (bdd.y * Math.pow(y[1], 2) + bd.y * a +
        argsObj.g);
    return [y[1], a];
};

