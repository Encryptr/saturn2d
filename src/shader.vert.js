export default `#version 300 es
layout (location = 0) in vec2 a_position;
layout (location = 1) in vec2 a_uv;

out vec2 v_uv;

uniform mat3 u_modelMatrix;
uniform vec2 u_resolution;

void main() {
  v_uv = a_uv;

  vec2 transformed_position = (u_modelMatrix * vec3(a_position, 1.0)).xy;
  
  // convert from pixel space to clip space
  vec2 clipSpace = (transformed_position / u_resolution) * 2.0 - 1.0;

  gl_Position = vec4(clipSpace, 0, 1);
}`;