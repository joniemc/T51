const express = require('express');
const app = express();
const PORT = 3000;

let libros = [];
const ESTADOS = ['disponible', 'prestado', 'reservado', 'daniado'];
app.use(express.json());
app.get('/libros',(req,res)=>{
    res.status(200).json({status:200,message:'success',data:libros});
});

app.post('/libros',(req,res)=>{
    const libro = req.body;

    let isExist = false;
    ESTADOS.forEach(est => {
        if(est === libro.estado){
            isExist = true;
        }
    });

    //Agregar validaciones para los campos de entrada
    if(!libro.id || !libro.titulo || !libro.autor || !libro.anioPublicacion || !libro.estado){
        

        return res.status(400).json({status:400,message:'Todos los parametros son obligatorios',data:null});    
    }else if(!isExist){
            return res.status(400).json({status:400,message:'El estado debe ser: [disponible, prestado, reservado, daniado]',data:null});
        }
    else{
        libros.push(libro);
        return res.status(201).json({status:201,message:'Registro agregado con exito',data:libro});
    }
    
});

app.put('/libros/:id',(req, res)=>{
    const id = parseInt(req.params.id);
    const libro = req.body;

    let isExist = false;
    const campos = ['titulo','anioPublicacion','estado','autor'];
    libros.forEach(lib =>{
        if(lib.id === id){
            isExist = true;
            Object.keys(libro).forEach(key => {
                if(campos.includes(key)){
                    lib[key] = libro[key];
                }
            });
        }
    });

    if(!isExist){
        return res.status(404).json({status:404,message:'Registro no encontrado...',data:null});    
    }
    else{
        return res.status(200).json({status:200,message:'Registro actualizado con exito',data:libro});
    }


});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});