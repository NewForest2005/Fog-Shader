
precision mediump float;

// Coordenadas de textura
varying vec2 vTexCoord;

// Textura del objeto
uniform sampler2D uTexture;

// Configuración de la niebla
uniform vec4 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

void main() {

    // Obtener el color original de la textura
    vec4 color = texture2D(uTexture, vTexCoord);

    // Calcular la intensidad de la niebla
    float fogAmount = smoothstep(
        uFogNear,
        uFogFar,
        gl_FragCoord.z
    );

    // Mezclar el color original con la niebla
    gl_FragColor = mix(
        color,
        uFogColor,
        fogAmount
    );
}
