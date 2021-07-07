const options = require("../config/database");
const knex = require("knex")(options);

const selectChat = async () => {
    try {
        return await knex.from("chat").select("id", "author", "date", "text");
    } catch (error) {
        console.log(error);
    }
};

module.exports = selectChat;
