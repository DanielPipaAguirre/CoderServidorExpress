const express = require("express");
const chat = require("../api/chat");
const router = express.Router();

router.get("/mensajes/listar", async (req, res) => {
    try {
        const mensajes = await chat.obtenerChat();
        if (!mensajes.length) {
            throw new Error("no hay mensajes cargados");
        }
        return res.json(mensajes);
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

router.get("/mensajes/listar/:id", async (req, res) => {
    try {
        const response = await chat.obtenerChatPorId(req.params.id);
        if (!response.length) {
            throw new Error("mensaje no encontrado");
        }
        return res.json(response);
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

router.post("/mensajes/guardar", (req, res) => {
    try {
        if (
            !Object.keys(req.body).length ||
            !Object.values(req.body).join("")
        ) {
            throw new Error("no hay mensajes para guardar");
        }
        chat.guardarChat({ ...req.body });
        return res.json({ estado: "GUARDADO", mensaje: req.body });
    } catch (e) {
        res.render("notFound", { mensajeError: e.message });
    }
});

router.put("/mensajes/actualizar/:id", async (req, res) => {
    try {
        const response = await chat.obtenerChatPorId(req.params.id);
        if (!response.length) {
            throw new Error(
                "El mensaje que intentas actualizar no se encuentra disponible"
            );
        }
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Por favor, indica que campos quieres actualizar");
        }
        const newBody = { ...req.body, date: new Date().toLocaleString() };
        await chat.actualizarChatPorId(newBody, req.params.id);
        return res.json({ estado: "ACTUALIZADO", mensaje: newBody });
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

router.delete("/mensajes/borrar/:id", async (req, res) => {
    try {
        const response = await chat.obtenerChatPorId(req.params.id);
        if (!response.length) {
            throw new Error("mensaje no encontrado");
        }
        chat.borrarChatPorId(req.params.id);
        return res.json({ estado: "BORRADO", mensaje: response });
    } catch (e) {
        return res.json({
            error: e.message,
        });
    }
});

module.exports = router;
