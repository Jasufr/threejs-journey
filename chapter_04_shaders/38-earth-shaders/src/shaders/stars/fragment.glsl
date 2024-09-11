uniform vec3 uStarsColor;

void main() {
  vec3 color = vec3(0.0);
  color += uStarsColor;

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 5.0);

  // Final color
  gl_FragColor = vec4(color, strength);

  #include <colorspace_fragment>
}
