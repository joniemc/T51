const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [];

app.get('/',(req,res)=>{
    
    res.json({nombre:'jonie',id:"12"});
});

app.get('/user', (req,res)=>{
    res.json({status:200, message:'success', data: users});
});

app.get('/obtenerparametro/:id', (req, res)=>{
    const id = req.params.id;
    res.send(id);
});

app.post('/user',(req,res)=>{
    const user = req.body;
    users.push(user);
    res.json({status:200, message:'success', data:user});
});

app.put('/user',(req, res)=>{
    const user = req.body;
    let exists = false;

    users.forEach(cuser => {
        if(cuser.id === user.id){
            exists = true;
            cuser.nombre = user.nombre;
            cuser.email = user.email;
        }
    });

    if(exists){
        res.json({status:200, message:'success', data:user});
    }else{
        res.status(404).json({status:404, message:'Usuario no encontrado...'});
    }
    
});

app.delete('/user/:id',(req,res)=>{
    const id = parseInt(req.params.id);

    const filtroUsuarios = users.filter(user => user.id !== id);

    if(filtroUsuarios.length !== users.length){
        users = filtroUsuarios;
        res.json({status:200, message:'Usuario eliminado exitosamente'});
    }
    else{
        res.status(404).json({status:404, message:'Usuario no encontrado...'});
    }
});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});