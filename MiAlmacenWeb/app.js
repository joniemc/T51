const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'MiClaveSecreta';

app.use(express.json());
app.use(cors());

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

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({status:401, message:'El token es obligatorio...'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(401).json({status:401, message:'Token invalido...'});
        }

        next();
    });
    
}

app.get('/test', authMiddleware, (req, res)=>{
    res.send('Hello');
});

app.get('/sinmiddleware', authMiddleware, (req, res)=>{
    res.send('Hello not middleware');
});

app.get('/gethash/:plainText', async (req, res)=>{
    const plaintText = req.params.plainText;
    const saltRound = 10;
    const hash = await bcrypt.hash(plaintText,saltRound);

    res.send(hash);

});

app.post('/api/login',async (req, res)=>{
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

        const token = jwt.sign({username: user.username},SECRET_KEY,{expiresIn: '1h'});

        res.status(200).json({status:200, message:'success', token: token});
    });

});

//Administración de usuarios
app.post('/usuario', authMiddleware, async (req, res)=>{
    const user = req.body;

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(user.password,saltRound);

    //sql
    const sql = 'INSERT INTO usuario (username,password) VALUES(?,?)';

    pool.query(sql, [user.username,passwordHash], (err, results)=>{
        //Completar
    });

    res.json({status:200, message:'Completar'});
});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});