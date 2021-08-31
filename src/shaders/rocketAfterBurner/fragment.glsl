uniform vec3 uColor;

varying vec3 vertexNormal;
void main() {
    float intensity = pow(0.95 - dot(vertexNormal, vec3(1.0, 0, 0)), 2.0);
  gl_FragColor = vec4(uColor, 1.0) * intensity;
}