const options = require("../config/database");
const knex = require("knex")(options);

const createTable = async () => {
    try {
        await knex.schema.dropTableIfExists("productos");

        await knex.schema.createTable("productos", (table) => {
            table.increments("id").notNullable();
            table.string("title", 15).notNullable();
            table.float("price").notNullable();
            table.string("thumbnail").notNullable();
        });
    } catch (error) {
        console.log(error);
    } finally {
        await knex.destroy();
    }
};

module.exports = createTable;
