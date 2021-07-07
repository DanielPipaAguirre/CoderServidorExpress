const express = require("express");
const productos = require("../api/productos");
const router = express.Router();

router.get("/productos/listar", async (req, res) => {
    try {
        const listaProductos = await productos.obtenerProductos();
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

router.get("/productos/listar/:id", async (req, res) => {
    try {
        const response = await productos.obtenerProductoPorId(req.params.id);
        if (!response.length) {
            throw new Error("producto no encontrado");
        }
        return res.json(response);
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

router.post("/productos/guardar", (req, res) => {
    try {
        if (
            !Object.keys(req.body).length ||
            !Object.values(req.body).join("")
        ) {
            throw new Error("no hay productos para guardar");
        }
        productos.guardarProductos({ ...req.body });
        return res.json({ estado: "GUARDADO", producto: req.body });
    } catch (e) {
        res.render("notFound", { mensajeError: e.message });
    }
});

router.put("/productos/actualizar/:id", async (req, res) => {
    try {
        const response = await productos.obtenerProductoPorId(req.params.id);
        if (!response.length) {
            throw new Error(
                "El producto que intentas actualizar no se encuentra disponible"
            );
        }
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Por favor, indica que campos quieres actualizar");
        }
        await productos.actualizarProductoPorId(req.body, req.params.id);
        return res.json({ estado: "ACTUALIZADO", producto: req.body });
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

router.delete("/productos/borrar/:id", async (req, res) => {
    try {
        const response = await productos.obtenerProductoPorId(req.params.id);
        console.log(response);
        if (!response.length) {
            throw new Error("producto no encontrado");
        }
        productos.borrarProductoPorId(req.params.id);
        return res.json({ estado: "BORRADO", producto: response });
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

module.exports = router;
