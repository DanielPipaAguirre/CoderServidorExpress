const options = require("../config/database");
const knex = require("knex")(options);

const insertChat = async (chat) => {
    try {
        await knex("chat").insert(chat);
    } catch (error) {
        console.log(error);
    }
};

module.exports = insertChat;
