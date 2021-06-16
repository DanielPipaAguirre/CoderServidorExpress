const express = require("express");
const handlebars = require("express-handlebars");
const productos = require("./api/productos");

const app = express();
const puerto = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", "./views/layouts");

app.set('view engine', 'pug');

/* app.use(express.static(__dirname + "/public")); */

app.get("/productos/vista", (req, res) => {
  try {
    const listaProductos = productos.obtenerProductos();
    if (!listaProductos.length) {
      throw new Error("no hay productos cargados");
    }
    res.render("vista", { hayProductos: true, productos: listaProductos });
    // return res.json(listaProductos);
  } catch (e) {
    /* return res.json({
            error: e.message,
        }); */
    res.render("notFound", { mensajeError: e.message });
  }
});

app.get("/", (req, res) => {
  res.render("formulario.pug");
});

const router = require("./routes/productos");
app.use("/api", router);

const server = app.listen(puerto, () => {
  console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on("error", (error) => {
  console.log("error en el servidor:", error);
});
