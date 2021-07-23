const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const config = require("./config/config.json");

const handlebars = require("express-handlebars");

const productos = require("./api/productos");

require("./database/connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
        partialsDir: __dirname + "/views/partials/",
    })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/productos/vista-test", (req, res) => {
    try {
        const mocks = productos.generar(req.query.cant);
        res.render("vista", {
            hayProductos: mocks.length,
            productos: mocks,
        });
    } catch (e) {
        res.render("notFound", { mensajeError: e.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

const routerProduct = require("./routes/productos");
const routerChat = require("./routes/chat");
app.use("/api", routerProduct);
app.use("/api", routerChat);

const puerto = process.env.PORT || config.PORT;

const serverExpress = server.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

serverExpress.on("error", (error) => {
    console.log("error en el servidor:", error);
});
