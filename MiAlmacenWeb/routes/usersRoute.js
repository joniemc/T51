const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

router.get('/usuario', authMiddleware, async (req, res)=>{
    //sql
    const sql = 'select id as code, username, email from user';

    pool.query(sql, (err, results)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error en la consulta...'});
        }

        res.json({status:200, message:'success', data:results});
    });

    
});

module.exports = router;