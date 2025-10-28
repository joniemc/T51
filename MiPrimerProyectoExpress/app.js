const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];

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

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});