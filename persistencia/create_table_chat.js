const options = require("../config/database");
const knex = require("knex")(options);

const createTable = async () => {
    try {
        await knex.schema.dropTableIfExists("chat");

        await knex.schema.createTable("chat", (table) => {
            table.increments("id").notNullable();
            table.string("author", 15).notNullable();
            table.string("date").notNullable();
            table.string("text").notNullable();
        });
    } catch (error) {
        console.log(error);
    } finally {
        await knex.destroy();
    }
};

module.exports = createTable;
