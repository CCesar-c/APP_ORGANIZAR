const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();

// 1. Interceptor de seguridad manual para CORS (Evita errores de red)
app.use(cors());

app.use(express.json());

// 2. Inicializamos la API de OpenAI con tu llave secreta
const openai = new OpenAI({
    apiKey: 'api' // Reemplaza esto con tu llave sk-...
});

console.log("🤖 ¡Conexión con OpenAI configurada y lista!");
app.get('/', (req, res) =>{
    res.send("Hola desdel back-end")
})
// 3. Ruta POST para procesar las conversaciones de la App Móvil
app.post("/response-ia", async (request, response) => {
    try {
        const { pregunta, historialAnterior } = request.body;

        if (!pregunta) {
            return response.status(400).json({ error: "Falta la pregunta del usuario." });
        }

        console.log(`Procesando consulta: "${pregunta}"`);

        // Formateamos los mensajes previos más la nueva pregunta para mantener la memoria
        const mensajesParaIA = [...(historialAnterior || []), { role: 'user', content: pregunta }];

        // Llamamos al modelo más óptimo y económico de OpenAI
        const apiResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: mensajesParaIA,
            temperature: 0.7
        });

        // 🛠️ CORREGIDO: Acceso exacto usando el índice [0] del arreglo choices
        if (apiResponse && apiResponse.choices && apiResponse.choices[0]) {
            const respuestaTexto = apiResponse.choices[0].message.content;
            console.log("Respuesta obtenida con éxito de ChatGPT.");
            return response.json({ respuesta: respuestaTexto });
        } else {
            throw new Error("Estructura de respuesta inesperada de OpenAI");
        }

    } catch (error) {
        // Imprime el verdadero culpable en la terminal de tu PC
        console.error("❌ Error real en el Backend:", error.message);
        response.status(500).json({ error: "Hubo un fallo al procesar la petición con ChatGPT.", detalle: error.message });
    }
});

// Escuchamos en el puerto 3000 local
app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor intermedio activo en el puerto 3000");
});