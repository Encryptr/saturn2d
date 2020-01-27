import { Vector2 } from './Vector2.js';
import { Matrix3 } from './Matrix3.js';
import { Color } from './Color.js';

const onPositionChange = Symbol();

export class Entity {
  
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
    
    this.texture = null;
    this.color = new Color(255, 255, 255);
    
    this._position = new Vector2();
    this._position.onchange = this.constructor[onPositionChange].bind(this);
    
    // used internally for rendering
    this._matrix = new Matrix3();
  }
  
  intersects(entity) {
    return (
      this._position.x + this.width >= entity._position.x && this._position.x <= entity._position.x + entity.width &&
      this._position.y + this.height >= entity._position.y && this._position.y <= entity._position.y + entity.height
    );
  }
  
  get position() {
    return this._position;
  }
  
  static get [onPositionChange]() {
    return function() {
      this._matrix.makeTransform(this._position);
    }
  }
  
}

Entity.onPositionChange = onPositionChange;