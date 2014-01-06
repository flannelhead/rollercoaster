/**
 * Represents a vector of the 2-dimensional Euclidean space and implements
 * basic vector arithmetic.
 * @param {number} x The x-component of the vector.
 * @param {number} y The y-component of the vector.
 * @constructor
 */
function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Creates a new vector from given polar coordinates.
 * @param {number} r The length of the vector
 * @param {number} theta The polar angle of the vector.
 * @return {Vector2} The vector resulting from the coordinate conversion.
 */
Vector2.fromPolar = function(r, theta) {
    return new Vector2(r * Math.cos(theta), r * Math.sin(theta));
};

/**
 * Vector addition. Doesn't modify the original vector.
 * @param {Vector2} v A vector.
 * @return {Vector2} The result of the addition this + v.
 */
Vector2.prototype.add = function(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
};

/**
 * Vector subtraction. Doesn't modify the original vector.
 * @param {Vector2} v A vector.
 * @return {Vector2} The result of the subtraction this - v.
 */
Vector2.prototype.sub = function(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
};

/**
 * Multiplication by a scalar. Doesn't modify the original vector.
 * @param {number} a A scalar.
 * @return {Vector2} The product this * a.
 */
Vector2.prototype.mul = function(a) {
    return new Vector2(this.x * a, this.y * a);
};

/**
 * Division by a scalar. Doesn't modify the original vector.
 * @param {number} a A nonzero scalar.
 * @return {Vector2} The quotient this / a.
 */
Vector2.prototype.div = function(a) {
    return this.mul(1.0 / a);
};

/**
 * Computes the dot (inner) product of this vector and vector v.
 * @param {Vector2} v A vector.
 * @return {number} The value of the dot product.
 */
Vector2.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * Computes the square of the Euclidean norm of the vector. This function
 * is sometimes useful as taking a square root is avoided.
 * @return {number} The square of the norm.
 */
Vector2.prototype.squaredNorm = function() {
    return this.dot(this);
};

/**
 * Computes the Euclidean norm (2-norm, length) of the vector.
 * @return {number} The Euclidean norm of the vector.
 */
Vector2.prototype.norm = function() {
    return Math.sqrt(this.squaredNorm());
};

/**
 * Projects the vector v on this vector.
 * @param {Vector2} v A vector.
 * @return {Vector2} The projection vector.
 */
Vector2.prototype.proj = function(v) {
    return this.mul(this.dot(v) / this.squaredNorm());
};

/**
 * Normalizes this vector.
 * @return {Vector2} The unit vector.
 */
Vector2.prototype.unit = function() {
    return this.div(this.norm());
};

/**
 * Computes the angle between this vector and v.
 * @param {Vector2} v A nonzero vector.
 * @return {number} The angle between this vector and v in radians.
 */
Vector2.prototype.angle = function(v) {
    return Math.acos(this.dot(v) / (this.norm() * v.norm()));
};

/**
 * Computes the polar angle of this vector.
 * @return {number} The polar angle.
 */
Vector2.prototype.polarAngle = function() {
    return Math.atan2(this.y, this.x);
};

