const options = require("../config/database");
const knex = require("knex")(options);

const selectProducts = async () => {
    try {
        return await knex
            .from("productos")
            .select("id", "title", "price", "thumbnail");
    } catch (error) {
        console.log(error);
    }
};

module.exports = selectProducts;
