const options = require("../config/database");
const knex = require("knex")(options);

const selectProductById = async (id) => {
    try {
        return await knex
            .from("chat")
            .select("id", "author", "date", "text")
            .where("id", "=", `${id}`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = selectProductById;
