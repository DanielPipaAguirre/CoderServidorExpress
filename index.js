const express = require("express");
const productos = require("./api/productos.js")

const app = express();
const puerto = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile("index");
});

const router = require('./routes/productos');
app.use('/api', router);


const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on("error", (error) => {
    console.log("error en el servidor:", error);
});
