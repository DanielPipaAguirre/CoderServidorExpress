const options = require("../config/database");
const knex = require("knex")(options);

const updateChat = async (id, message) => {
    try {
        await knex.from("chat").where("id", "=", `${id}`).update(message);
    } catch (error) {
        console.log(error);
    }
};

module.exports = updateChat;
