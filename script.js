
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
    fogShader = loadShader(
        'shaders/fog.vert',
        'shaders/fog.frag'
    );

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
    fogNearSlider = createSlider(0, 1, 0.7, 0.001);

    createP('Fog Far');
    fogFarSlider = createSlider(0, 1, 0.9, 0.001);

    fogNearSlider.style('width', '200px');
    fogFarSlider.style('width', '200px');
}

function draw() {

    // Color de la niebla
    const fogColor = [0.8, 0.9, 1.0, 1.0];

    // Obtener valores de los sliders
    let fogNear = fogNearSlider.value();
    let fogFar = fogFarSlider.value();

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
        0, 0, 2,
        0, 0, 0,
        0, 1, 0
    );

    // Actualizar rotaciones
    let delta = deltaTime / 1000;

    modelYRotation += -0.7 * delta;
    modelXRotation += -0.4 * delta;

    // Activar nuestro shader
    shader(fogShader);

    // Enviar uniformes al Fragment Shader
    fogShader.setUniform('uTexture', textureImage);
    fogShader.setUniform('uFogColor', fogColor);
    fogShader.setUniform('uFogNear', fogNear);
    fogShader.setUniform('uFogFar', fogFar);

    // Renderizar cubos
    noStroke();

    for (let i = 0; i <= numCubes; i++) {

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
