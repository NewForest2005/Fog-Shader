let fogShader;
let textureImage;

// Controles de la niebla
let fogNearSlider;
let fogFarSlider;

const numCubes = 40;

let xOff = 1.1;
let zOff = 1.4;

let modelXRotation = 0;
let modelYRotation = 0;

function preload() {

    fogShader = createShader(vert, frag);

    textureImage = loadImage(
        'assets/f-texture.png'
    );
}

function setup() {

    createCanvas(800, 600, WEBGL);

    pixelDensity(1);

    // Sliders
    createP('Fog Near');
    fogNearSlider = createSlider(0, 1, 0.7, 0.001);

    createP('Fog Far');
    fogFarSlider = createSlider(0, 1, 0.9, 0.001);

    fogNearSlider.style('width', '200px');
    fogFarSlider.style('width', '200px');
}

function draw() {


    const fogColor = [0.8, 0.9, 1.0, 1.0];
    let fogNear = fogNearSlider.value();
    let fogFar = fogFarSlider.value();

    // smoothstep necesita un rango válido. Si los sliders coinciden o Near
    // queda por encima de Far, mantenemos una separación mínima de 0.001.
    if (fogFar <= fogNear) {
        if (fogNear < 1.0) {
            fogFar = fogNear + 0.001;
        } else {
            fogNear = 0.999;
            fogFar = 1.0;
        }
    }

    background(204, 230, 255);

    perspective(
        PI / 3,
        width / height,
        1,
        40
    );

    camera(
        0, 0, 2,
        0, 0, 0,
        0, 1, 0
    );

    // Actualizar rotaciones
    let delta = deltaTime / 1000;

    modelYRotation += -0.7 * delta;
    modelXRotation += -0.4 * delta;

    // Activar shader
    shader(fogShader);
    noStroke();

    for (let i = 0; i < numCubes; i++) {

        fogShader.setUniform('uTexture', textureImage);
        fogShader.setUniform('uFogColor', fogColor);
        fogShader.setUniform('uFogNear', fogNear);
        fogShader.setUniform('uFogFar', fogFar);

        push();

        translate(
            -2 + i * xOff,
            0,
            -i * zOff
        );

        rotateX(modelXRotation + i * 0.1);
        rotateY(modelYRotation + i * 0.1);

        box(1);
        pop();
    }
}

const vert = `

    precision highp float;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying vec2 vTexCoord;

    void main() {

        vec4 position = vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix
                    * uModelViewMatrix
                    * position;

        vTexCoord = aTexCoord;
    }

`

const frag = `

    precision mediump float;

    varying vec2 vTexCoord;

    uniform sampler2D uTexture;
    uniform vec4 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    void main() {

        vec4 color = texture2D(uTexture, vTexCoord);

        // Calcular la intensidad de la niebla
        float fogAmount = smoothstep(
            uFogNear,
            uFogFar,
            gl_FragCoord.z
        );

        gl_FragColor = mix(
            color,
            uFogColor,
            fogAmount
        );
    }

`
