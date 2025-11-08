const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.json());
function cargaLentadeTareas(ms){
    return new Promise((resolve)=>{
        
        setTimeout(()=>{
            resolve({
                message:`Esta operación termino luego de ${ms} ms`,
                finishedAt: new Date().toISOString(),
            });
            const fecha = new Date().toLocaleDateString();
            const hora = new Date().toLocaleTimeString();
            console.log(`Fecha de ejecución: ${fecha} ${hora}`);

            console.log('Ingreso Función');
        },ms);
    });
}

async function redJson(ruta){
    const rutaCompleta = path.join(__dirname, ruta);
    const texto = await fs.readFile(rutaCompleta, 'utf8');

    const fecha = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();
    console.log(`Fecha de ejecución: ${fecha} ${hora}`);
    return JSON.parse(texto);
}

async function writeJson(ruta, datos){
    const rutaCompleta = path.join(__dirname, ruta);
    await fs.writeFile(rutaCompleta, JSON.stringify(datos, null, 2),'utf-8');
};

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

app.get('/api/products',async (req, res)=>{
    const products = await redJson('data/products.json');
    const fabricantes = await redJson('data/fabricante.json');

    res.json({status:200,message:'success',data:{produts:products,fabricantes:fabricantes}});
});

app.post('/api/products',async (req,res)=>{
    const product = req.body;
    const ruta = 'data/products.json';
    const products = await redJson(ruta);
    products.push(product);
    await writeJson(ruta, products);

    res.status(200).json({status:200, message:"Registro agregado exitosamente...", data:product});
});

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});