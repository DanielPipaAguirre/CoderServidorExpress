const options = require("../config/database");
const knex = require("knex")(options);

const deleteProduct = async (id) => {
    try {
        await knex("productos").where('id', '=', `${id}` ).del()
    } catch (error) {
        console.log(error);
    }
};

module.exports = deleteProduct;
