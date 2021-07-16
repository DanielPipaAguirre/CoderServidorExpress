const Productos = require("../models/productos");
const MongoCRUD = require("../repository/crud");
class ProductosController extends MongoCRUD {
    constructor() {
        super(Productos);
    }
}

module.exports = new ProductosController();
