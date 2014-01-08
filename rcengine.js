/**
 * Creates a new rollercoaster simulation engine instance.
 * @constructor
 */
function RcEngine(canvas, dt, startButton, stopButton, mass, grav,
    controlPoints) {
    // Get the handles of the UI components.
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.startButton = startButton;
    this.startButton.onclick = this.start.bind(this);
    this.stopButton = stopButton;
    this.stopButton.onclick = this.stop.bind(this);
    this.controlPoints = controlPoints;
    this.controlPoints.onchange = this.resetCurve.bind(this);
    this.grav = grav;
    this.mass = mass;
    // Initialize the curve editor.
    this.editor = new BezierEditor(this.canvas);
    this.resetCurve();
    // Initialize the integrator.
    this.odeArgs = {};
    this.ode = new Ode(RcEngine.f, dt, this.odeArgs);
    // Protection to not hang when the browser has been inactive (the 
    // timestep can grow quite long).
    this.maxFrameLength = 10 * 1 / 60.0;
    // We're ready to start.
    this.animating = false;
}

RcEngine.prototype.resetCurve = function() {
    var order = parseInt(this.controlPoints.value, 10) - 1;
    this.editor.createLinear(order);
};

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
    this.grav.disabled = true;
    this.mass.disabled = true;
    this.controlPoints.disabled = true;
    this.animating = true;
};

RcEngine.prototype.stop = function() {
    this.animating = false;
    this.stopButton.style.display = 'none';
    this.startButton.style.display = 'inline';
    this.grav.disabled = false;
    this.mass.disabled = false;
    this.controlPoints.disabled = false;
};

RcEngine.prototype.draw = function(timestamp) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.editor.draw(!(this.animating));

    if (this.animating === true) {
        var t = timestamp * 1e-3;
        if (this.ode.t === null) {
            this.ode.t = t;
        }

        if (t - this.ode.t > this.maxFrameLength) {
            this.ode.t = t;
        }

        this.ode.integrate(t);
        if (this.ode.y[0] <= 1.0 && this.ode.y[0] >= 0.0) {
            this.ctx.fillStyle = '#268bd2';
            var pt = this.editor.curve.f(this.ode.y[0]);
            CanvasHelper.drawCircle(this.ctx, pt.x, pt.y, 10.0);
        } else {
            this.stop();
        }
    }
};

RcEngine.f = function(t, y, argsObj) {
    var b = argsObj.curve.f(y[0]);
    var bd = argsObj.curve.d(y[0]);
    var bdd = argsObj.curve.dd(y[0]);
    var a = -1.0 / bd.squaredNorm() * (bd.dot(bdd) * Math.pow(y[1], 2) +
        argsObj.g * bd.y);
    return [y[1], a];
};

