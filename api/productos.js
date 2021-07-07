const createTable = require("../persistencia/create_table_products");
const insertProduct = require("../persistencia/insert_products");
const selectProductById = require("../persistencia/select_where_products");
const selectProducts = require("../persistencia/select_products");
const deleteProductById = require("../persistencia/delete_where_products");
const updateProductById = require("../persistencia/update_table_products");

class Productos {
    constructor() {
        createTable();
    }

    obtenerProductoPorId(id) {
        return selectProductById(id);
    }

    obtenerProductos() {
        return selectProducts();
    }

    guardarProductos(item) {
        insertProduct(item);
    }

    borrarProductoPorId(id) {
        deleteProductById(id);
    }

    actualizarProductoPorId(newItem, id) {
        return updateProductById(id, newItem);
    }
}

module.exports = new Productos();
