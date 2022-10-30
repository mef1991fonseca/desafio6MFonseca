const fs = require("fs");
const path = require("path")

class ContenedorM{
    constructor(nombreArchivo){
        this.nombreArchivo = path.join(__dirname,`../files/${nombreArchivo}`);
    }

    save = async(msg)=>{
        try {
            //leer el archivo existe
            if(fs.existsSync(this.nombreArchivo)){
                const mensajes = await this.getAll();
                mensajes.push(msg);
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(mensajes, null, 2))
                return mensajes;
            }
        } catch (error) {
            console.log(error);
        }
    }

    getAll = async()=>{
        if(fs.existsSync(this.nombreArchivo)){
            try {
                const contenido = await fs.promises.readFile(this.nombreArchivo,"utf8");
                const mensajes = JSON.parse(contenido);
                console.log(mensajes)
                return mensajes
            } catch (error) {
                console.log(error)
            }
        }
        return {status:'error',message: "No hay mensajes"}
        
    }
}

module.exports = ContenedorM;

//export { Contenedor }