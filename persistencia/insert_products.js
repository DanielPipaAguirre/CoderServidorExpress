const options = require("../config/database");
const knex = require("knex")(options);

const insertProduct = async (producto) => {
    try {
        await knex("productos").insert(producto);
    } catch (error) {
        console.log(error);
    }
};

module.exports = insertProduct;
