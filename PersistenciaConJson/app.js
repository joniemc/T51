const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

function getProducts(){
    const data = fs.readFileSync('products.json','utf-8');
    return JSON.parse(data);
};

function addProduct(products){
    fs.writeFileSync('products.json',JSON.stringify(products,null,2));
}

app.get('/products',(req, res)=>{
    let products = getProducts();
    res.status(200).json({status:200, message:"success", data:products});
});

app.post('/products',(req,res)=>{
    const product = req.body;
    let products = getProducts();
    products.push(product);
    addProduct(products);

    res.status(200).json({status:200, message:"Registro agregado exitosamente...", data:product});
});


app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});