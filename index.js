const handlebars = require("express-handlebars");
const productos = require("./api/productos");
const chat = require("./api/chat");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const puerto = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/",
    })
);

app.set("view engine", "hbs");

app.set("views", "./views");

app.get("/productos/vista", (req, res) => {
    try {
        const listaProductos = productos.obtenerProductos();
        if (!listaProductos.length) {
            throw new Error("no hay productos cargados");
        }
        res.render("vista", { hayProductos: true, productos: listaProductos });
    } catch (e) {
        res.render("notFound", { mensajeError: e.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

/* io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    socket.emit("productos", productos.obtenerProductos());

    socket.on("update", (data) => {
        if (data === "ok") {
            io.sockets.emit("productos", productos.obtenerProductos());
        }
    });

    const messages = await chat.obtenerMesajesDeArchivo()
    io.sockets.emit('mensajes', messages);

    socket.on('nuevo-mensaje', async function (data) {
        await chat.guardarMensajesEnArchivo(data)
        const messages = await chat.obtenerMesajesDeArchivo()
        io.sockets.emit('mensajes', messages);
    });
}); */

const routerProduct = require("./routes/productos");
const routerChat = require("./routes/chat");
app.use("/api", routerChat, routerProduct);

const serverExpress = server.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

serverExpress.on("error", (error) => {
    console.log("error en el servidor:", error);
});
