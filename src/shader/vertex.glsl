attribute float aPhase;
attribute float aSize;

varying float vPhase;
varying vec2 vUv;

void main() {
  vPhase = aPhase;
  gl_PointSize = aSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}