const options = require("../config/database");
const knex = require("knex")(options);

const selectProductById = async (id) => {
    try {
        return await knex
            .from("productos")
            .select("id", "title", "price", "thumbnail")
            .where("id", "=", `${id}`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = selectProductById;
