import { Texture } from './Texture.js';

export class TextureLoader {
  constructor() {
    this._cache = new Map;
  }
  async load(url) {
    if (this._cache.has(url)) {
      return this._cache.get(url);
    } else {
      const image = await loadImage(url);
      const texture = new Texture(image);
      
      this._cache.set(url, texture);
      return texture;
    }
  }
}

function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = url;
  });
}