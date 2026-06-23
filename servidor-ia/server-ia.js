const express = require('express');
const RWKVModel = require('rwkv-cpp-node');
const path = require('path');

const app = express();

// Middleware de CORS manual (igual al anterior)
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') {
        return response.sendStatus(200);
    }
    next();
});

app.use(express.json());

const modelpath = path.join(__dirname, 'modelos/rwkv-7-goose.bin');

// 1. CORREGIDO: Mapeamos tanto 'modelPath' como 'path' en minúsculas por si la librería usa una variante diferente
const configIA = { 
    modelPath: modelpath, 
    path: modelpath, // Variación común en algunas versiones
    thread: 4,
    threads: 4 
};

const model = new RWKVModel(configIA);

// 2. CORREGIDO: Le pasamos el objeto de configuración directamente a setup() 
// para que el módulo nativo de archivos no reciba un argumento 'undefined'
try {
    console.log("⚙️ Inicializando el contexto de RWKV (llamando a setup)...");
    
    // Le enviamos la ruta y los hilos directo al método setup
    model.setup(configIA); 
    
    console.log("🤖 ¡IA RWKV-7 cargada, configurada y lista para recibir preguntas!");
} catch (error) {
    console.error("❌ Error grave al ejecutar el setup del binario:", error);
}

app.post("/response-ia", async (request, response) => {
    try {
        const { pregunta, recuerdosAnteriores } = request.body;

        if (!pregunta) {
            return response.status(400).json({ error: "Falta la pregunta" });
        }

        console.log(`Procesando pregunta: "${pregunta}"`);

        const resultado = await model.completion({
            prompt: pregunta,
            maxTokens: 100,
            temperature: 0.7,
            state: recuerdosAnteriores || undefined
        });

        const textoRespuesta = typeof resultado === 'object' && resultado.text 
            ? resultado.text 
            : resultado;

        console.log(`Respuesta generada con éxito.`);
        response.json({ respuesta: textoRespuesta });

    } catch (error) {
        console.error("❌ Error ejecutando la inferencia de la IA:", error);
        response.status(500).json({ error: "El binario del modelo falló al procesar los tokens.", detalle: error.message });
    }
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor IA activo en el puerto 3000");
});
