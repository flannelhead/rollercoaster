/**
 * Solves a system of ODEs: y'(t) = f(t, y)
 * @constructor
 * @param {number} stepSize The size of a single integration step.
 * @param {Object} [argsObj] The optional argument object.
 */
function OdeRK4(f, stepSize, argsObj) {
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
OdeRK4.prototype.integrate = function(t) {
    var dt = t - this.t;
    var nSteps = Math.floor(dt / this.stepSize);
    var remainder = dt - nSteps * this.stepSize;

    for (var i = 0; i < nSteps; i++) {
        this.step(this.stepSize);
    }
    this.step(remainder);
};

/**
 * Integrate one time step forward using the 4th order Runge-Kutta method.
 * @param {number} h The length of the step.
 */
OdeRK4.prototype.step = function(h) {
    var hHalf = h / 2.0;
    var k1 = this.f(this.t, this.y, this.argsObj);
    var k2 = this.f(this.t + hHalf, OdeRK4.newY(this.y, k1, hHalf),
        this.argsObj);
    var k3 = this.f(this.t + hHalf, OdeRK4.newY(this.y, k2, hHalf),
        this.argsObj);
    var k4 = this.f(this.t + h, OdeRK4.newY(this.y, k3, h),
        this.argsObj);

    var k = [];
    var hPer6 = h / 6.0;
    this.y.forEach(function(y, i, arr) {
        arr[i] = y + hPer6 * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]);
    }, this);
    this.t += h;
};

/**
 * Helper function: compute u + v * a. 
 * @param {Array.<number>} u The first array.
 * @param {Array.<number>} v The second array.
 * @param {number} a The multiplier.
 * @return {Array.<number>} u + v * a.
 */
OdeRK4.newY = function(u, v, a) {
    var result = [];
    u.forEach(function(element, index, array) {
        result.push(element + v[index] * a);
    });
    return result;
};

