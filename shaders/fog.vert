
precision mediump float;

// Atributos de los vértices
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Matrices proporcionadas por p5.js
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

// Coordenadas que enviaremos al Fragment Shader
varying vec2 vTexCoord;

void main() {

    // Transformación del vértice
    vec4 position = vec4(aPosition, 1.0);

    gl_Position = uProjectionMatrix
                * uModelViewMatrix
                * position;

    // Pasamos las coordenadas de textura
    vTexCoord = aTexCoord;
}
