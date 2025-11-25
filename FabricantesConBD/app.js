const express = require('express');
const mysql = require('mysql2');
const { pathToFileURL } = require('url');
const app = express();

const PORT = 3000;

//Conexión a bases de datos
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'R00tP4ssw0rd',
    database:'T51Fabricante'
});

pool.getConnection((error, conexion)=>{
    if(error){
        console.log('Error de conexión a la base de datos...');
    }else{
        console.log('Conexión exitosa...');
    }
});


app.use(express.json());

app.get('/fabricantes', (req, res)=>{
    const sql = 'select Id, Nombre, Descripcion from Fabricante';

    pool.query(sql,(err, results)=>{
        if(err){
            console.log('Error en la consulta sql...');
            res.status(500).json({status:500,message:'Error en la consulta sql...'});
        }else{
            res.status(200).json({status:200,message:'Success',data:results});
        }
    });
});

app.get('/fabricantes/:nombre',(req,res)=>{
    const Nombre = req.params.nombre;

    if(!Nombre){
       res.status(400).json({status:400,message:'El nombre es requerido.'}); 
    }else{
        const sql = 'select Id, Nombre, Descripcion from Fabricante where Nombre = ?';
        pool.query(sql,[Nombre],(err, results)=>{
            if(err){
                console.log('Error en la consulta sql...');
                res.status(500).json({status:500,message:'Error en la consulta sql...'});
            }else{
                res.status(200).json({status:200,message:'Success',data:results});
            }
        });
    }
});

app.post('/fabricantes',(req, res)=>{
    const fabricante = req.body;
    if(!fabricante.Nombre || !fabricante.Descripcion){
        res.status(400).json({status:400,message:'Los parametros Id, Nombre y Descripción son requeridos.'});
    }
    else{
        //query con un select a la tabla fabricante por nombre, 
        // necesitamos un count si count > 0 "El registro ya existe"

        const sql = 'insert into Fabricante (Nombre, Descripcion) values(?,?)';
        pool.query(sql,[fabricante.Nombre,fabricante.Descripcion],(err,results)=>{
            if(err){
                res.status(500).json({status:500,message:'Error en la consulta sql...'});
            }
            else{
                fabricante.Id = results.insertId;
                res.status(200).json({status:200,message:'Success',data:fabricante});
            }
        });
    }
});

app.put('/fabricantes',(req,res)=>{
    const fabricante = req.body;
    const sql = 'update Fabricante set Nombre=?, Descripcion=? where Id=?';

    pool.query(sql,[fabricante.Nombre, fabricante.Descripcion, fabricante.Id], (err, results)=>{
        if(err){
            res.status(500).json({status:500,message:'Error en la consulta sql...'});
        }else if(results.affectedRows === 0){
            res.status(404).json({status:404,message:'No se encontro el registro...'});
        }
        else{
            res.status(200).json({status:200,message:'Success',data:fabricante});
        }
    });
});

app.delete('/fabricantes/:Id',(req, res)=>{
    const Id = parseInt(req.params.Id);

    if(!Id){
        return res.status(400).json({status:400,message:'El Id es requerido...'});
    }

    const sql = 'delete from Fabricante where Id=?';

    pool.query(sql,[Id],(err, results)=>{
        if(err){
            return res.status(500).json({status:500,message:'Error en la consulta sql...'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404,message:'No se encontro el registro...'});
        }

        return res.status(200).json({status:200,message:'Registro eliminado exitosamente...'});

    });


});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}/`);
});
