/** 
 * @constructor 
 * @param {Array.<Vector2>} points The points defining the spline.
 */
function CubicSpline2(points) {
    this.points = points;
    // The control points which are "coefficients" of each polynomial segment
    // A + Bt + Ct^2 + Dt^3
    this.A = [];
    this.B = [];
    this.C = [];
    this.D = [];
    this.update();
}

CubicSpline2.prototype.update = function() {
    this.computeControlPoints();
};

/**
 * A step function to determine which segment should we use for computing
 * values along the spline.
 * @param {number} t The curve parameter.
 * @return {Object} The index of the curve segment.
 */
CubicSpline2.prototype.whichSegment = function(t) {
    var newT = t * (this.points.length - 1);
    var i = Math.max(Math.min(Math.floor(newT), this.points.length - 2), 0);
    newT = newT - i;
    return { t: newT, i: i };
};

CubicSpline2.prototype.f = function(t) {
    var p = this.whichSegment(t);
    return this.A[p.i].add(this.B[p.i].mul(p.t))
        .add(this.C[p.i].mul(Math.pow(p.t, 2)))
        .add(this.D[p.i].mul(Math.pow(p.t, 3)));
};

CubicSpline2.prototype.d = function(t) {
    var p = this.whichSegment(t);
    return this.B[p.i].add(this.C[p.i].mul(2 * p.t))
        .add(this.D[p.i].mul(3 * Math.pow(p.t, 2)))
        .mul(this.points.length - 1);
};

CubicSpline2.prototype.dd = function(t) {
    var p = this.whichSegment(t);
    return this.C[p.i].mul(2).add(this.D[p.i].mul(6 * p.t))
        .mul(Math.pow(this.points.length - 1, 2));
};

CubicSpline2.prototype.computeControlPoints = function() {
    // Computes the control points for a cubic spline using a procedure
    // based on a linear system, described here: http://mathworld.wolfram.com/CubicSpline.html
    this.a = [];
    this.b = [];
    this.c = [];
    this.D = [];

    // The diagonal of the tridiagonal matrix
    var diag = [];
    // The subdiagonal
    var sub = [];
    // The superdiagonal
    var sup = [];
    // The right hand side of the tridiagonal system
    var rhs = [];

    var n = this.points.length - 1;

    sub[0] = 0;
    diag[0] = 2;
    sup[0] = 1;
    rhs[0] = this.points[1].sub(this.points[0]).mul(3);

    for (var i = 1; i < n; i++) {
        sub[i] = 1;
        diag[i] = 4;
        sup[i] = 1;
        rhs[i] = this.points[i + 1].sub(this.points[i - 1]).mul(3);
    }

    sub[n] = 1;
    diag[n] = 2;
    sup[n] = 0;
    rhs[n] = this.points[n].sub(this.points[n - 1]).mul(3);

    // Solve the tridiagonal system using the usual TDMA
    sup[0] = sup[0] / diag[0];
    rhs[0] = rhs[0].div(diag[0]);
    // Forward sweep
    for (var j = 1; j <= n; j++) {
        var m = 1.0 / (diag[j] - sub[j] * sup[j - 1]);
        sup[j] = sup[j] * m;
        rhs[j] = rhs[j].sub(rhs[j - 1].mul(sub[j])).mul(m);
    }
    // Backward substitution
    for (var k = n - 1; k >= 0; k--) {
        rhs[k] = rhs[k].sub(rhs[k + 1].mul(sup[k]));
    }

    // Now determine the control points.
    for (var l = 0; l < n; l++) {
        this.A[l] = this.points[l];
        this.B[l] = rhs[l];
        this.C[l] = this.points[l + 1].sub(this.points[l]).mul(3)
            .sub(rhs[l].mul(2)).sub(rhs[l + 1]);
        this.D[l] = this.points[l].sub(this.points[l + 1]).mul(2)
            .add(rhs[l]).add(rhs[l + 1]);
    }
};

