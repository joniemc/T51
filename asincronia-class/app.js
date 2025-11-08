const express = require('express');
const { finished } = require('stream');

const fs = require('fs/promises');
const path = require('path');
const { text } = require('body-parser');

const app = express();
const PORT = 3000;

function cargaLentadeTareas(ms){
    return new Promise((resolve)=>{
        
        setTimeout(()=>{
            resolve({
                message:`Esta operación termino luego de ${ms} ms`,
                finishedAt: new Date().toISOString(),
            });

            console.log('Ingreso Función');
        },ms);

        
    });
}

async function redJson(ruta){
    const rutaCompleta = path.join(__dirname, ruta);
    const texto = await fs.readFile(rutaCompleta, 'utf8');
    return JSON.parse(texto);
}

app.get('/tarea-asincrona',async (req, res)=>{
    console.log('Ingreso API');
    
    const paso1 = cargaLentadeTareas(800);
    const paso2 = cargaLentadeTareas(250);
    
    const [res1,res2] = await Promise.all([paso1, paso2]);

    console.log('Finalizo API');
    res.json({
        status:200,
        message:'success',
        data: [res1,res2]
    });
});

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});