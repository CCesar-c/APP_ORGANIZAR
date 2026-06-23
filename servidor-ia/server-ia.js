const express = require('express');
const { RWKVModel } = require('rwkv-cpp-node');
const path = require('path');

const app = express();

const modelpath = path.join(__dirname, 'modelos/rwkv-7-goose.bin');

const model = new RWKVModel({
    modelPath: modelpath,
    thread: 4
})

console.log("🤖 ¡IA RWKV-7 cargada y lista para recibir preguntas!");

app.post("/response-ia", (request, response) => {
    const { pregunta, recuerdosAnteriores } = request.body;

    const resultado = model.generate({
        prompt: pregunta,
        maxTokens: 60,
        temperatura: 0.7,
        state: recuerdosAnteriores
    })
    response.send("");
})