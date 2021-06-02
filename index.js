import express from "express";
import productos from "./api/productos.js";

// creo una app de tipo express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// completar el codigo...

app.get("/api/productos/listar", (req, res) => {
    try {
        const listaProductos = productos.obtenerProductos();
        if (!listaProductos.length) {
            throw new Error("no hay productos cargados");
        }
        return res.json(listaProductos);
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

app.get("/api/productos/listar/:id", (req, res) => {
    try {
        const response = productos.obtenerProductoPorId(req.params.id);
        if (response === undefined) {
            throw new Error("producto no encontrado");
        }
        return res.json(response);
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

app.post("/api/productos/guardar", (req, res) => {
    try {
        if (!Object.keys(req.body).length) {
            throw new Error("no hay productos para guardar");
        }
        const listaProductos = productos.obtenerProductos();
        productos.guardarProductos({ ...req.body, id: listaProductos.length });
        return res.json({ estado: "GUARDADO", producto: req.body });
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on("error", (error) => {
    console.log("error en el servidor:", error);
});
