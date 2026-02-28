import { BlendFunction, Effect } from "postprocessing";
import { Uniform } from "three";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  uniform float frequency;
  uniform float amplitude;
  uniform float offset;
  uniform vec3 color;

  void mainUv(inout vec2 uv) {
    uv.y += sin(uv.x * frequency + offset) * amplitude;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    outputColor = vec4(color, inputColor.a);
  }
`;

export default class DrunkEffect extends Effect {
  constructor({
    frequency,
    amplitude,
    color,
    blendFunction = BlendFunction.DARKEN,
  }) {
    super("DrunkEffect", fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ["frequency", new Uniform(frequency)],
        ["amplitude", new Uniform(amplitude)],
        ["offset", new Uniform(0)],
        ["color", new Uniform(new THREE.Color(color))],
      ]),
    });
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("offset").value += deltaTime;
  }
}
