const express = require('express');
const { RWKVModel } = require('rwkv-cpp-node');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const modelpath = path.join(__dirname, 'modelos/rwkv-7-goose.bin');

const model = new RWKVModel({ modelPath: modelpath, thread: 4 })

console.log("🤖 ¡IA RWKV-7 cargada y lista para recibir preguntas!");

app.post("/response-ia", (request, response) => {
    const { pregunta, recuerdosAnteriores } = request.body;

    const resultado = model.generate({
        prompt: pregunta,
        maxTokens: 100,
        temperatura: 0.7,
        state: recuerdosAnteriores
    })
    response.json({ resposta: resultado });
})

app.listen(3000, () => {
    console.log("http://localhost:3000/ aqui esta me back-end");

})