class Productos {
    constructor() {
        // incializar variables
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

    // agregar los metodos requeridos
}

// exporto una instancia de la clase
const productos = new Productos();

export default productos;
