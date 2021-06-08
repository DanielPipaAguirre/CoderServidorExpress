class Productos {
    constructor() {
        this.producto = [];
    }

    obtenerProductoPorId(id) {
        return this.producto.filter((item) => item.id === +id)[0];
    }

    obtenerProductos() {
        return this.producto;
    }

    guardarProductos(item) {
        this.producto.push(item);
    }

    borrarProductoPorId(id) {
        this.producto = this.producto.filter((item) => item.id !== +id);
    }

    actualizarProductoPorId(newItem, id) {
        const producto = this.producto.findIndex((item) => item.id === +id);
        if (producto === -1) {
            return false;
        } else {
            this.producto[producto] = { ...newItem, id: +id };
            return true;
        }
    }
}

module.exports = new Productos();
