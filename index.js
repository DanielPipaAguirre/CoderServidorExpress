const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const config = require("./config/config.json");
const session = require("express-session");
const handlebars = require("express-handlebars");

const chat = require("./api/chat");

const { Server } = require("socket.io");
const io = new Server(server);

const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const schema = normalizr.schema;

require("./database/connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views",
    })
);

app.set("view engine", "hbs");

app.set("views", "./views");

app.use(
    session({
        secret: "secreto",
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 100000 },
    })
);

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.username = "daniel";
        return res.json({ username: username });
    }
    return res.json({ error: "No se pude logear" });
});

const auth = (req, res, next) => {
    if(!req.session.username) {
        return res.redirect('/login')
    }
    if (req.session && req.session.username == "daniel") {
        return next();
    } else {
        return res.status(401).send("No autorizado");
    }
};

app.get("/logout", auth, (req, res) => {
    const username = req.session.username;
    req.session.destroy((err) => {
        if (!err) res.render("vista", { username: username });
        else res.send({ status: "Logout ERROR", body: err });
    });
});

app.get("/contenido", auth, (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/loginData", auth, (req, res) => {
    res.json({ username: req.session.username });
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
