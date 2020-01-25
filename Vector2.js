export class Vector2 {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
    this.onchange = function(){};
  }
  toArray() {
    return [this._x, this._y];
  }
  toFloat32Array(target = new Float32Array(2)) {
    target.set([this._x, this._y]);
    return target;
  }
  set(x, y) {
    this._x = x ?? this._x;
    this._y = y ?? this._y;
  }
  copy(v) {
    this._x = v._x;
    this._y = v._y;
    this.onchange();
    return this;
  }
  clone() {
    return new Vector2(this._x, this._y);
  }
  equals(v, tolerance = 1e-15) {
    return (
      Math.abs(v._x - this._x) < tolerance &&
      Math.abs(v._y - this._y) < tolerance
    );
  }
  strictEquals(v) {
    return (
      v._x === this._x &&
      v._y === this._y
    );
  }
  add(v) {
    this._x += v._x;
    this._y += v._y;
    this.onchange();
    return this;
  }
  sub(v) {
    this._x -= v._x;
    this._y -= v._y;
    this.onchange();
    return this;
  }
  scale(s) {
    this._x *= s;
    this._y *= s;
    this.onchange();
    return this;
  }
  normalize() {
    return this.scale(1 / this.length);
  }
  *[Symbol.iterator]() {
    yield this._x;
    yield this._y;
  }
  get x() {
    return this._x;
  }
  set x(num) {
    this._x = num;
    this.onchange();
  }
  get y() {
    return this._y;
  }
  set y(num) {
    this._y = num;
    this.onchange();
  }
  get length() {
    return Math.sqrt(
      this._x ** 2 +
      this._y ** 2
    );
  }
  get isVector2() {
    return true;
  }
  get [Symbol.toStringTag]() {
    return 'Vector2';
  }
}