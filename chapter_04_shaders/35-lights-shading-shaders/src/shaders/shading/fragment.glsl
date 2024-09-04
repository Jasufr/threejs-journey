uniform vec3 uColor;

uniform float uAmbientLightIntensity;
uniform vec3 uAmbientLightColor;

uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform float uDirectionalLightPositionX;
uniform float uDirectionalLightPositionY;
uniform float uDirectionalLightPositionZ;

uniform  vec3 uPointLightColor;
uniform  float uPointLightIntensity;
uniform  float uPointLightPositionX;
uniform  float uPointLightPositionY;
uniform  float uPointLightPositionZ;
uniform  float uPointLightDecay;

uniform  vec3 uPointLightTwoColor;
uniform  float uPointLightTwoIntensity;
uniform  float uPointLightTwoPositionX;
uniform  float uPointLightTwoPositionY;
uniform  float uPointLightTwoPositionZ;
uniform  float uPointLightTwoDecay;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambiantLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl


void main()
{
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    light += ambiantLight(
      uAmbientLightColor,               // Light color
      uAmbientLightIntensity            // Light intensity
    );
    light += directionalLight(
      uDirectionalLightColor,           // Light color
      uDirectionalLightIntensity,       // Light intensity
      normal,                           // Normal
      vec3(
        uDirectionalLightPositionX,
        uDirectionalLightPositionY,
        uDirectionalLightPositionZ
        ),                              // Light position
      viewDirection,                    // View direction
      20.0                              // Specular power
    );
    light += pointLight(
      uPointLightColor,                 // Light color
      uPointLightIntensity,             // Light intensity
      normal,                           // Normal
      vec3(
        uPointLightPositionX,
        uPointLightPositionY,
        uPointLightPositionZ
        ),                              // Light position
      viewDirection,                    // View direction
      20.0,                             // Specular power
      vPosition,                        // Position
      uPointLightDecay                  // Light decay
    );
    light += pointLight(
      uPointLightTwoColor,              // Light color
      uPointLightTwoIntensity,          // Light intensity
      normal,                           // Normal
      vec3(
        uPointLightTwoPositionX,
        uPointLightTwoPositionY,
        uPointLightTwoPositionZ
        ),                              // Light position
      viewDirection,                    // View direction
      20.0,                             // Specular power
      vPosition,                        // Position
      uPointLightTwoDecay               // Light decay
    );
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
