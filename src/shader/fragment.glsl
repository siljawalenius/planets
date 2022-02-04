uniform float uTime;
uniform sampler2D uParticleMap;
varying vec2 vUv;
varying float vPhase;

void main() {
  //float pulse = mix(0.5, 1.0, sin(uTime + vPhase) * 0.5 + 0.5);

  float pulse = mix(0.5, 1.0, sin(uTime + vPhase) * 0.5 + 0.5);
   //vec3 outgoingColor = texture2D(uParticleMap, vUv).rgb * pulse;
   vec3 outgoingColor = texture2D(uParticleMap, gl_PointCoord).rgb * pulse;
   gl_FragColor = vec4(outgoingColor, 1.0);
}