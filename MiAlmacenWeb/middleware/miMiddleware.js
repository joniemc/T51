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

module.exports = miMiddleware;