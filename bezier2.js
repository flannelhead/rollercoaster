/**
 * Represents a 2d Bezier curve defined by given control points and computes 
 * the values of the displacement and the first and second derivatives.
 * @param {Array.<Vector2>} points An array containing the
 * control points (at least two of them).
 * @constructor
 */
function Bezier2(points) {
    // The Bezier2 curve is feasible only with at least two control points.
    if (points.length >= 2) {
        this.points = points;
        this.update();
    }
}

/**
 * Recalculates the helper points needed for taking the derivatives.
 */
Bezier2.prototype.update = function() {
    this.n = this.points.length - 1;
    
    var l = this.n - 1;
    this.dpoints = [];
    for (var i = 0; i <= l; i++) {
        this.dpoints.push(this.points[i + 1].sub(this.points[i]));
    }

    l = this.n - 2;
    this.ddpoints = [];
    for (var j = 0; j <= l; j++) {
        this.ddpoints.push(this.dpoints[j + 1].sub(this.dpoints[j]));
    }
};

/**
 * Calculates the value of the curve at parameter value t.
 * @param {number} t The curve parameter.
 * @return {Vector2} The value of the curve at t.
 */
Bezier2.prototype.f = function(t) {
    var val = new Vector2(0.0, 0.0);
    this.points.forEach(function(point, index, array) {
        val = val.add(point.mul(Bezier2.bernstein(this.n, index, t)));
    }, this);
    return val;
};

/**
 * Calculates the first derivative of the curve at parameter value t.
 * @param {number} t The curve parameter.
 * @return {Vector2} The first derivative of the curve at t.
 */
Bezier2.prototype.d = function(t) {
    var n1 = this.n - 1;
    var val = new Vector2(0.0, 0.0);
    this.dpoints.forEach(function(point, index, array) {
        val = val.add(point.mul(Bezier2.bernstein(n1, index, t)));
    }, this);
    return val.mul(this.n);
};

/**
 * Calculates the second derivative of the curve at parameter value t.
 * @param {number} t The curve parameter.
 * @return {Vector2} The second derivative of the curve at t.
 */
Bezier2.prototype.dd = function(t) {
    var n2 = this.n - 2;
    var val = new Vector2(0.0, 0.0);
    this.ddpoints.forEach(function(point, index, array) {
        val = val.add(point.mul(Bezier2.bernstein(n2, index, t)));
    }, this);
    return val.mul(this.n * (this.n - 1));
};

/**
 * Determines the binomial coefficient ("n choose k").
 * @protected
 * @param {number} n
 * @param {number} k
 */
Bezier2.binom = function(n, k) {
    var a = 1;
    var b = 1;

    for (var i = k + 1; i <= n; i++) {
        a *= i;
    }

    var c = n - k;
    for (var j = 2; j <= c; j++) {
        b *= j;
    }

    return a / b;
};

/**
 * Evaluates the Bernstein polynomial.
 * @protected
 * @param {number} n
 * @param {number} i
 * @param {number} t
 */
Bezier2.bernstein = function(n, i, t) {
    return Bezier2.binom(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
};

