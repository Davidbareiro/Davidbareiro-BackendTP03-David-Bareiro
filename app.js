import ProductManager from "./ProductManager.js";
import express from "express";

const app = express();
const PORT = 4000;
const ListaProductos = new ProductManager("./src/database.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("El servidor esta funcionando en el puerto 4000");
});




app.get('/products', async (req,res) => {
    const products = await ListaProductos.getProducts();
    let {limit} = req.query;
    console.log (limit)
    let datos;
    if(limit) {
        datos = products.slice(0, parseInt(limit));
        res.send(`Segun el limite enviado, estos son los productos: ${(JSON.stringify(datos))}`);
    } else {
        datos = products;
        res.send(`La lista de produsctos son: ${(JSON.stringify(datos))}`);
    }
    
});


app.get("/products/:pid", async (req, res) => {
    const product = await ListaProductos.getProductById(parseInt(req.params.pid));
    product === null ? res.send("El ID enviado no figura en la BBDD") : res.send(product);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto:${PORT}`);
});