const options = require("../config/database");
const knex = require("knex")(options);

const updateProduct = async (id, product) => {
    try {
        await knex
            .from("z")
            .where("id", "=", `${id}`)
            .update(product);
    } catch (error) {
        console.log(error);
    }
};

module.exports = updateProduct;
