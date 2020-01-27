export class Color {
  
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  
  setRGB(r, g, b) {
    this.r = r ?? this.r;
    this.g = g ?? this.g;
    this.b = b ?? this.b;
    return this;
  }
  
  setHex(hex) {
    this.r = hex >> 16;
    this.g = hex >> 8 & 0x00ff;
    this.b = hex & 0x0000ff;
    return this;
  }
  
  copy(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    return this;
  }
  
  clone() {
    return new Color(this.r, this.g, this.b);
  }
  
  toArray(normalize = false) {
    return [this.r, this.g, this.b].map(n => normalize ? n / 255 : n);
  }
  
  toFloat32Array(normalized = false, destination = new Float32Array(3)) {
    destination.set(this.toArray(normalized));
    return destination;
  }
  
  toHexString() {
    return '0x' + (this.r << 16 | this.g << 8 | this.b).toString(16).padStart(6, '0');
  }
  
  *[Symbol.iterator]() {
    yield this.r;
    yield this.g;
    yield this.b;
  }
  
  get isColor() {
    return true;
  }
  
}