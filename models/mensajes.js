const mongoose = require("mongoose");

const schema = mongoose.Schema({
    author: { type: String, require: true, max: 100 },
    date: { type: Date, default: new Date() },
    text: { type: String, max: 400 },
});

const Mensajes = mongoose.model("mensajes", schema);

module.exports = Mensajes;
