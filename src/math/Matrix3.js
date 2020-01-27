export class Matrix3 {
  constructor(elements = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
  ]) {
    this._elements = elements;
  }
  toArray() {
    return this._elements;
  }
  toFloat32Array(target = new Float32Array(9)) {
    target.set(this._elements);
    return target;
  }
  set(array) {
    this._elements = array;
  }
  copy(matrix) {
    this._elements = [...matrix._elements];
    return this;
  }
  clone() {
    return new Matrix3([...this._elements]);
  }
  equals(m, tolerance = 1e-15) {
    return m.toArray().every((e, i) => (
      Math.abs(e - this._elements[i]) < tolerance
    ));
  }
  strictEquals(m) {
    return m.toArray().every((e, i) => (
      e === this._elements[i]
    ));
  }
  multiplyMatrices(a, b) {
    a = [...a._elements];
    b = [...b._elements];
    
    // row 1
    this._elements[0] = a[0] * b[0] + a[3] * b[1] + a[6] * b[2];
    this._elements[3] = a[0] * b[3] + a[3] * b[4] + a[6] * b[5];
    this._elements[6] = a[0] * b[6] + a[3] * b[7] + a[6] * b[8];
    
    // row 1
    this._elements[1] = a[1] * b[0] + a[4] * b[1] + a[7] * b[2];
    this._elements[4] = a[1] * b[3] + a[4] * b[4] + a[7] * b[5];
    this._elements[7] = a[1] * b[6] + a[4] * b[7] + a[7] * b[8];
    
    // row 3
    this._elements[2] = a[2] * b[0] + a[5] * b[1] + a[8] * b[2];
    this._elements[5] = a[2] * b[3] + a[5] * b[4] + a[8] * b[5];
    this._elements[8] = a[2] * b[6] + a[5] * b[7] + a[8] * b[8];
    
    return this;
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  scale(num) {
    this._elements = this._elements.map(m => m * num);
    return this;
  }
  makeTranslation(x, y) {
    this._elements = [
      1, 0, 0,
      0, 1, 0,
      x, y, 1,
    ];
    return this;
  }
  makeRotation(rad) {
    this._elements = [
      Math.cos(rad), Math.sin(rad), 0,
      -Math.sin(rad), Math.cos(rad), 0,
      0, 0, 1,
    ];
    return this;
  }
  makeScale(x, y) {
    this._elements = [
      x, 0, 0,
      0, y, 0,
      0, 0, 1,
    ];
    return this;
  }
  
  /**
   * @param {Vector2} translation
   * @param {Vector2} scale
   * @param {number} rad - the rotation expressed in radians
   */
  makeTransform(translation = {}, scale = {}, rad = 0) {
    this._elements = [
      (scale._x ?? 1) * Math.cos(rad), (scale._x ?? 1) * Math.sin(rad), 0,
      (scale._y ?? 1) * -Math.sin(rad), (scale._x ?? 1) * Math.cos(rad), 0,
      (translation._x ?? 0), (translation._y ?? 0), 1,
    ];
    return this;
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < 9; i++)
      yield this._elements[i];
  }
  get determinant() {
    const m = this._elements;
    return (
      m[0] * (m[4] * m[8] - m[7] * m[5]) -
      m[3] * (m[1] * m[8] - m[7] * m[2]) +
      m[6] * (m[1] * m[5] - m[4] * m[2])
    );
  }
  get inverse() {
    const m = [...this._elements], determinant = this.determinant;
    
    if (determinant !== 0) {
      const inverse = new Matrix3();
      
      inverse.m11 = m[8] * m[4] - m[5] * m[7];
      inverse.m12 = m[5] * m[6] - m[8] * m[3];
      inverse.m13 = m[7] * m[3] - m[4] * m[6];
      
      inverse.m21 = m[2] * m[7] - m[8] * m[1];
      inverse.m22 = m[8] * m[0] - m[2] * m[6];
      inverse.m23 = m[1] * m[6] - m[7] * m[0];
      
      inverse.m31 = m[5] * m[1] - m[2] * m[4];
      inverse.m32 = m[2] * m[3] - m[5] * m[0];
      inverse.m33 = m[4] * m[0] - m[1] * m[3];
      
      return inverse.scale(1 / determinant);
    }
    
    return undefined;
  }
  get transpose() {
    return new Matrix3([
      this._elements[0], this._elements[3], this._elements[6],
      this._elements[1], this._elements[4], this._elements[7],
      this._elements[2], this._elements[5], this._elements[8],
    ]);
  }
  get isMatrix3() {
    return true;
  }
  get [Symbol.toStringTag]() {
    return 'Matrix3';
  }
}

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    Object.defineProperty(Matrix3.prototype, `m${row + 1}${col + 1}`, {
      get() {
        return this._elements[col * 3 + row];
      },
      set(num) {
        this._elements[col * 3 + row] = num;
      },
    });
  }
}