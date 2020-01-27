import vertexShader from './shader.vert.js';
import fragmentShader from './shader.frag.js';

import { Color } from './Color.js';

export class Renderer {
  
  constructor(canvas = document.createElement('canvas')) {
    
    // initialize gl context
    this._canvas = canvas;
    this._gl = canvas.getContext('webgl2');
    this._gl.enable(this._gl.DEPTH_TEST);
    
    this._whiteTexture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._whiteTexture);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGB, 1, 1, 0, this._gl.RGB, this._gl.UNSIGNED_BYTE, new Uint8ClampedArray([255, 255, 255]));
    this._gl.bindTexture(this._gl.TEXTURE_2D, null);
    
    this.backgroundColor = new Color(0, 0, 0);
    
    this._textureCache = new Map();
    
    this._positionBuffer = null;
    this._initPositionBuffer();
    this._initConstantBuffers();
    
    this._mainProgram = null;
    this._uniforms = {
      u_modelMatrix: null,
      u_resolution: null,
      u_mainTexture: null,
      u_color: null,
    }
    this._initProgram();
    
  }
  
  _initProgram() {
    const vertex = compileShader(this._gl, this._gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(this._gl, this._gl.FRAGMENT_SHADER, fragmentShader);
    const program = this._gl.createProgram();
    this._gl.attachShader(program, vertex);
    this._gl.attachShader(program, fragment);
    this._gl.linkProgram(program);
    if (this._gl.getProgramParameter(program, this._gl.LINK_STATUS)) {
      this._mainProgram = program;
      for (const name in this._uniforms) {
        this._uniforms[name] = this._gl.getUniformLocation(program, name);
      }
    } else {
      const errorMessage = this._gl.getProgramInfoLog(program);
      this._gl.deleteProgram(program);
      throw new Error(errorMessage);
    }
  }
  
  _initPositionBuffer() {
    this._positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]), this._gl.DYNAMIC_DRAW);
    this._gl.vertexAttribPointer(0, 2, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(0);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  }
  
  _initConstantBuffers() {
    // UVs
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._gl.createBuffer());
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), this._gl.STATIC_DRAW);
    this._gl.vertexAttribPointer(1, 2, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(1);
    
    // indices
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._gl.createBuffer());
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), this._gl.STATIC_DRAW);
    
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
  }
  
  _getTexture(texture) {
    if (this._textureCache.has(texture.id)) {
      return this._textureCache.get(texture.id);
    } else {
      this._textureCache.set(texture.id, createTexture(this._gl, texture));
      return this._textureCache.get(texture.id);
    }
  }
  
  render(entities) {
    this._gl.clearColor(...this.backgroundColor.toArray(true), 1);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
    this._gl.useProgram(this._mainProgram);
    this._gl.uniform2f(this._uniforms.u_resolution, this._canvas.width, this._canvas.height);
    this._gl.uniform1i(this._uniforms.u_mainTexture, 0);
    
    let entity;
    for (let i = 0, count = entities.length; i < count; i++) {
      entity = entities[ i ];
      
      this._gl.activeTexture(this._gl.TEXTURE0);
      this._gl.bindTexture(this._gl.TEXTURE_2D, (
        entity.texture ? this._getTexture(entity.texture) : this._whiteTexture
      ));
      
      this._gl.uniform3fv(this._uniforms.u_color, (
        entity.texture ? new Float32Array([1, 1, 1]) : entity.color.toFloat32Array(true)
      ));
      
      this._gl.bufferData(this._gl.ARRAY_BUFFER, generatePositionBuffer(entity), this._gl.DYNAMIC_DRAW);
      this._gl.uniformMatrix3fv(this._uniforms.u_modelMatrix, false, entity._matrix.toFloat32Array());
      this._gl.drawElements(this._gl.TRIANGLES, 6, this._gl.UNSIGNED_SHORT, 0);
      
    }
  }
  
  updateAspectRatio() {
    this._canvas.width = this._canvas.clientWidth;
    this._canvas.height = this._canvas.clientHeight;
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
  }
  
  get canvas() {
    return this._canvas;
  }
  
  get aspectRatio() {
    return this._canvas.width / this._canvas.height;
  }
  
  get aspectRatioNeedsUpdate() {
    return (
      this._canvas.width !== this._canvas.clientWidth ||
      this._canvas.height !== this._canvas.clientHeight
    );
  }
  
}

function generatePositionBuffer(entity) {
  return new Float32Array([
    0, 0,
    entity.width, 0,
    entity.width, entity.height,
    0, entity.height,
  ]);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message);
  }
}

function createTexture(gl, textureObj) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.texImage2D(
    gl.TEXTURE_2D,       // target
    0,                   // mip level
    gl.RGBA,             // internal format
    gl.RGBA,             // format
    gl.UNSIGNED_BYTE,    // type
    textureObj.image,    // data
  );
  
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, textureObj.wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, textureObj.wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, textureObj.minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, textureObj.magFilter);
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}