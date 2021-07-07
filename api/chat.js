const createTable = require("../persistencia/create_table_chat");
const insertChat = require("../persistencia/insert_chat");
const selectChatById = require("../persistencia/select_where_chat");
const selectChat = require("../persistencia/select_chat");
const deleteChatById = require("../persistencia/delete_where_chat");
const updateChatById = require("../persistencia/update_table_chat");

class Chat {
    constructor() {
        createTable();
    }

    obtenerChatPorId(id) {
        return selectChatById(id);
    }

    obtenerChat() {
        return selectChat();
    }

    guardarChat(item) {
        insertChat(item);
    }

    borrarChatPorId(id) {
        deleteChatById(id);
    }

    actualizarChatPorId(newItem, id) {
        return updateChatById(id, newItem);
    }
}

module.exports = new Chat();
