const fs = require("fs");

class Chat {
    constructor() {
        this.mensajes = [];
    }

    async obtenerMesajesDeArchivo() {
        try {
            const response = await fs.promises.readFile('./chat.txt');
            return JSON.parse(`${response}`);
        } catch (err) {
            return [];
        }
    }


    async guardarMensajesEnArchivo(data){
        this.mensajes.push(data);
        try {
            await fs.promises.writeFile("./chat.txt", JSON.stringify(this.mensajes, null, "\t"));
            console.log("se guardó!!")
        } catch (err) {
            console.log("err",err)
        }
    }
}

module.exports = new Chat();
