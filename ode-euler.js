/**
 * Solves a system of ODEs: y'(t) = f(t, y)
 * @constructor
 * @param {number} stepSize The size of a single integration step.
 * @param {Object} [argsObj] The optional argument object.
 */
function OdeEuler(f, stepSize, argsObj) {
    this.f = f;
    this.t = 0.0;
    /** @type {Array.<number>} */
    this.y = null;
    this.stepSize = stepSize;
    this.argsObj = arguments.length >= 3 ? arguments[2] : void 0;
}

/**
 * Integrate until the given point of time.
 * @param {number} t The new value of time.
 */
OdeEuler.prototype.integrate = function(t) {
    var dt = t - this.t;
    var nSteps = Math.floor(dt / this.stepSize);
    var remainder = dt - nSteps * this.stepSize;

    for (var i = 0; i < nSteps; i++) {
        this.step(this.stepSize);
    }
    this.step(remainder);
};

/**
 * Integrate one time step forward using the Euler method.
 * @param {number} h The length of the step.
 */
OdeEuler.prototype.step = function(h) {
    var yNew = this.f(this.t, this.y, this.argsObj);
    this.y.forEach(function(y, i, arr) {
        arr[i] = y + h * yNew[i];
    }, this);
    this.t += h;
};

