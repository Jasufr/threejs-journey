uniform vec3 uColor;

#include ../includes/ambiantLight.glsl

void main()
{
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    light += ambiantLight(
      vec3(1.0),          // Light color
      0.03                // Light intensity
    );
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
