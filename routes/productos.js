const express = require("express");
const router = express.Router();
const controller = require("../api/productos");

router.get("/productos/listar", async (req, res) => {
    try {
        const listaProductos = await controller.findAll();
        return res.json(listaProductos);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.get("/productos/listar/:id", async (req, res) => {
    try {
        const response = await controller.findById(req.params.id);
        if (!response) throw Error("No se encontró el producto");
        return res.json(response);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.post("/productos/guardar", async (req, res) => {
    try {
        if (
            !Object.keys(req.body).length ||
            !Object.values(req.body).join("")
        ) {
            throw new Error("No hay productos para guardar");
        }
        await controller.create(req.body);
        return res.json({ estado: "GUARDADO", producto: req.body });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.put("/productos/actualizar/:id", async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Por favor, indica que campos quieres actualizar");
        }
        await controller.update(req.params.id, req.body);
        return res.json({ estado: "ACTUALIZADO", producto: req.body });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.delete("/productos/borrar/:id", async (req, res) => {
    try {
        const producto = await controller.findById(req.params.id);
        await controller.remove(req.params.id);
        return res.json({ estado: "BORRADO", producto: producto });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

module.exports = router;
