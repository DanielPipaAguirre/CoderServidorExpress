const options = require("../config/database");
const knex = require("knex")(options);

const deleteChatById = async (id) => {
    try {
        await knex("chat").where('id', '=', `${id}` ).del()
    } catch (error) {
        console.log(error);
    }
};

module.exports = deleteChatById;
