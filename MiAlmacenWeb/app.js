const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

app.use(express.json());

//Conexión a bases de datos
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'R00tP4ssw0rd',
    database:'mialmacenwebdb'
});

pool.getConnection((error, conexion)=>{
    if(error){
        console.log('Error de conexión a la base de datos...');
    }else{
        console.log('Conexión exitosa...');
    }
});


const miMiddleware = (req, res, next)=>{
    const miParametroHeader = req.headers['miparametro'];

    if(!miParametroHeader){
        return res.status(401).json({status:401, message:'El parametro: miparametro es obligatorio...'});
    }


    if(miParametroHeader !== 'autorizado'){
        return res.status(401).json({status:401, message:'Parametro incorrecto...'});
    }
    
    next();
    
}

const authMiddleware = (erq, res, next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({status:401, message:'El token es obligatorio...'});
    }

    next();
}

app.get('/test', authMiddleware, (req, res)=>{
    res.send('Hello');
});

app.get('/sinmiddleware', miMiddleware, (req, res)=>{
    res.send('Hello not middleware');
});

app.get('/gethash/:plainText', async (req, res)=>{
    const plaintText = req.params.plainText;
    const saltRound = 10;
    const hash = await bcrypt.hash(plaintText,saltRound);

    res.send(hash);

});

app.post('/login',async (req, res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({status:400, message:'username y password son requeridos...'});
    }

    const sql = 'select * from user where (username=? or email=?) and state=1';
    pool.query(sql, [username,username], async (err, results)=>{
        if(err){
            return res.status(500).json({status:500, message:'Error en la consulta sql...'});
        }

        if(results.length===0){
            return res.status(401).json({status:401, message:'Credenciales invalidas...'});
        }

        let user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({status:401, message:'Credenciales invalidas...'});
        }

        res.status(200).json({status:200, message:'success', data: 'token'});
    });

});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});