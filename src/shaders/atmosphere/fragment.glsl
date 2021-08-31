uniform vec3 uColor;

varying vec3 vertexNormal; // (0, 0, 0)
void main() {
  float intensity = pow(0.99, 2.0);
  gl_FragColor = vec4(uColor, 1.0) * intensity;
}