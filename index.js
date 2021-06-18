const express = require("express");
const handlebars = require('express-handlebars');
const productos = require("./api/productos")

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const puerto = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

app.set('views', './views');

app.get("/productos/vista", (req, res) => {
    try {
        const listaProductos = productos.obtenerProductos();
        if (!listaProductos.length) {
            throw new Error("no hay productos cargados");
        }
        res.render('vista',{hayProductos:true, productos: listaProductos});
        // return res.json(listaProductos);
    } catch (e) {
        /* return res.json({
            error: e.message,
        }); */
        res.render('notFound',{mensajeError: e.message})
    }
});

app.get("/", (req, res) => {
    /* res.render('formulario'); */
    res.sendFile(__dirname + "/index.html")
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado!", socket.id);
  socket.emit("productos", productos.obtenerProductos())

  socket.on("update", data => {
    if(data === "ok"){
      io.sockets.emit("productos", productos.obtenerProductos())
    }
  })
  
});

const router = require('./routes/productos');
app.use('/api', router);


const server = http.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

server.on("error", (error) => {
    console.log("error en el servidor:", error);
});
