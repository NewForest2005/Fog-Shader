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
    fogNearSlider = createSlider(0, 1, 0.0, 0.001);

    createP('Fog Far');
    fogFarSlider = createSlider(0, 1, 0.85, 0.001);

    fogNearSlider.style('width', '200px');
    fogFarSlider.style('width', '200px');
}

function draw() {


    const fogColor = [0.8, 0.9, 1.0, 1.0];
    let fogNear = map(fogNearSlider.value(), 0, 1, 3.9, 28);
    let fogFar = map(fogFarSlider.value(), 0, 1, 5.0, 40);

    fogFar = max(fogFar, fogNear + 1.0);

    background(204, 230, 255);

    perspective(
        PI / 3,
        width / height,
        1,
        40
    );

    camera(
        0, 0, 4.394,
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
    varying float vDepth;

    void main() {

        vec4 position = vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix
                    * uModelViewMatrix
                    * position;

        vTexCoord = aTexCoord;
        vDepth = -(uModelViewMatrix * position).z;
    }

`

const frag = `

    precision mediump float;

    varying vec2 vTexCoord;
    varying float vDepth;

    uniform sampler2D uTexture;
    uniform vec4 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    void main() {

        vec4 color = texture2D(uTexture, vTexCoord);

        // Distancia desde la cámara (no se comprime por la perspectiva)
        float fogAmount = smoothstep(
            uFogNear,
            uFogFar,
            vDepth
        );

        gl_FragColor = mix(
            color,
            uFogColor,
            fogAmount
        );
    }

`
