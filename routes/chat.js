const express = require("express");
const router = express.Router();
const controller = require("../api/chat");

router.get("/mensajes/listar", async (req, res) => {
    try {
        const response = await controller.findAll();
        if (!response.length) throw Error("No se encontraron mensajes");
        return res.json(response);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.get("/mensajes/listar/:id", async (req, res) => {
    try {
        const response = await controller.findById(req.params.id);
        if (!response) throw Error("No se encontró el mensaje");
        return res.json(response);
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.post("/mensajes/guardar", async (req, res) => {
    try {
        if (
            !Object.keys(req.body).length ||
            !Object.values(req.body).join("")
        ) {
            throw new Error("No hay productos para guardar");
        }
        await controller.create(req.body);
        return res.json({ estado: "GUARDADO", mensaje: req.body });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

router.put("/mensajes/actualizar/:id", async (req, res) => {
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

router.delete("/mensajes/borrar/:id", async (req, res) => {
    try {
        const mensaje = await controller.findById(req.params.id);
        await controller.remove(req.params.id);
        return res.json({ estado: "BORRADO", mensaje: mensaje });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

module.exports = router;
