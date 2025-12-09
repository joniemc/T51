const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

require('dotenv').config();
const router = express.Router();
router.post('/api/login',async (req, res)=>{
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

        const token = jwt.sign({username: user.username},process.env.SECRET_KEY,{expiresIn: '1h'});

        res.status(200).json({status:200, message:'success', token: token});
    });

});

module.exports = router;