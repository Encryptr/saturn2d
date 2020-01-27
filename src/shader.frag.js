export default `#version 300 es
precision mediump float;

in vec2 v_uv;

out vec4 fragColor;

uniform sampler2D u_mainTexture;
uniform vec3 u_color;

void main() {
  fragColor = texture(u_mainTexture, v_uv);
  fragColor.rgb *= u_color;
}`;