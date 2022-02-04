attribute float aPhase;
varying float vPhase;
varying vec2 vUv;

void main() {
  vPhase = aPhase;
  gl_PointSize = 20.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}