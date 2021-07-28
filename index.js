const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const config = require("./config/config.json");

const chat = require("./api/chat");

const { Server } = require("socket.io");
const io = new Server(server);

const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;

require("./database/connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    const messages = await chat.findAll();

    // json normalize
    const mensajesConId = {
        id: "mensajes",
        mensajes: messages.map((mensaje) => ({ ...mensaje._doc })),
    };
    const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "id" });

    const schemaMensaje = new schema.Entity(
        "post",
        { author: schemaAuthor },
        { idAttribute: "_id" }
    );
    const schemaMensajes = new schema.Entity(
        "posts",
        { mensajes: [schemaMensaje] },
        { idAttribute: "id" }
    );

    const normalizedData = normalize(mensajesConId, schemaMensajes);

    io.sockets.emit("mensajes", normalizedData);

    socket.on("nuevo-mensaje", async function (data) {
        await chat.create(data);
        const messages = await chat.findAll();

        // json normalize
        const mensajesConId = {
            id: "mensajes",
            mensajes: messages.map((mensaje) => ({ ...mensaje._doc })),
        };
        const schemaAuthor = new schema.Entity(
            "author",
            {},
            { idAttribute: "id" }
        );

        const schemaMensaje = new schema.Entity(
            "post",
            { author: schemaAuthor },
            { idAttribute: "_id" }
        );
        const schemaMensajes = new schema.Entity(
            "posts",
            { mensajes: [schemaMensaje] },
            { idAttribute: "id" }
        );

        const normalizedData = normalize(mensajesConId, schemaMensajes);

        io.sockets.emit("mensajes", normalizedData);
    });
});

const routerProduct = require("./routes/productos");
app.use("/api", routerProduct);

const puerto = process.env.PORT || config.PORT;

const serverExpress = server.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

serverExpress.on("error", (error) => {
    console.log("error en el servidor:", error);
});
