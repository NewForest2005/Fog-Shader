
let fogShader;
let textureImage;

// Controles de la niebla
let fogNearSlider;
let fogFarSlider;

// Configuración de la escena
const numCubes = 40;

let xOff = 1.1;
let zOff = 1.4;

// Rotaciones
let modelXRotation = 0;
let modelYRotation = 0;

function preload() {

    // Cargar los shaders
    fogShader = createShader(vert, frag);

    // Cargar textura
    textureImage = loadImage(
        'assets/f-texture.png'
    );
}

function setup() {

    createCanvas(800, 600, WEBGL);

    // Configuración de profundidad
    pixelDensity(1);

    // Sliders
    createP('Fog Near');
    // La niebla empieza en el primer cubo de la izquierda.
    fogNearSlider = createSlider(0, 1, 0.0, 0.001);

    createP('Fog Far');
    fogFarSlider = createSlider(0, 1, 0.85, 0.001);

    fogNearSlider.style('width', '200px');
    fogFarSlider.style('width', '200px');
}

function draw() {

    // Color de la niebla
    const fogColor = [0.8, 0.9, 1.0, 1.0];  // Este es el color real de la niebal
    // const fogColor = [0.0, 0.0, 0.0, 1.0];     // Este es un debug, para ver por que falla
    // Obtener valores de los sliders
    // Convertimos los sliders a unidades de distancia de la cámara.
    // La profundidad de pantalla (gl_FragCoord.z) no es lineal y provocaba
    // que varios cubos cruzaran el umbral de niebla al mismo tiempo.
    let fogNear = map(fogNearSlider.value(), 0, 1, 3.9, 28);
    // En el mínimo, la transición termina entre el primer y el segundo cubo.
    // Así, con ambos sliders a la izquierda, solo queda visible el primero.
    let fogFar = map(fogFarSlider.value(), 0, 1, 5.0, 40);

    // Mantener siempre una transición válida, aunque Near se desplace
    // temporalmente más allá de Far.
    fogFar = max(fogFar, fogNear + 1.0);

    // Limpiar pantalla
    background(204, 230, 255);

    // Configurar cámara y perspectiva
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

    // Activar nuestro shader
    shader(fogShader);

    // // // Enviar uniformes al Fragment Shader
    // fogShader.setUniform('uTexture', textureImage);
    // fogShader.setUniform('uFogColor', fogColor);
    // fogShader.setUniform('uFogNear', fogNear);
    // fogShader.setUniform('uFogFar', fogFar);

    // Renderizar cubos
    noStroke();

    for (let i = 0; i < numCubes; i++) {

        fogShader.setUniform('uTexture', textureImage);
        fogShader.setUniform('uFogColor', fogColor);
        fogShader.setUniform('uFogNear', fogNear);
        fogShader.setUniform('uFogFar', fogFar);
        
        push();

        // Posición del cubo
        translate(
            -2 + i * xOff,
            0,
            -i * zOff
        );

        // Rotaciones individuales
        rotateX(modelXRotation + i * 0.1);
        rotateY(modelYRotation + i * 0.1);

        // Aplicar geometría
        box(1);

        pop();
    }
}

const vert = `

    precision highp float;

    // Atributos de los vértices
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    // Matrices proporcionadas por p5.js
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    // Coordenadas que enviaremos al Fragment Shader
    varying vec2 vTexCoord;
    varying float vDepth;

    void main() {

        // Transformación del vértice
        vec4 position = vec4(aPosition, 1.0);

        gl_Position = uProjectionMatrix
                    * uModelViewMatrix
                    * position;

        // Pasamos las coordenadas de textura
        vTexCoord = aTexCoord;

        // Profundidad lineal en el espacio de la cámara.
        vDepth = -(uModelViewMatrix * position).z;
    }

`

const frag = `

    precision mediump float;

    // Coordenadas de textura
    varying vec2 vTexCoord;
    varying float vDepth;

    // Textura del objeto
    uniform sampler2D uTexture;

    // Configuración de la niebla
    uniform vec4 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    void main() {

        // Obtener el color original de la textura
        vec4 color = texture2D(uTexture, vTexCoord);

        // Distancia lineal desde la cámara. A diferencia de gl_FragCoord.z,
        // esta distancia no se comprime por la perspectiva.
        float fogAmount = smoothstep(
            uFogNear,
            uFogFar,
            vDepth
        );

        // Mezclar el color original con la niebla
        gl_FragColor = mix(
            color,
            uFogColor,
            fogAmount
        );
    }

`
