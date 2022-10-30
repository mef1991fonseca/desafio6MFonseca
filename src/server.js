const express = require("express")
const {Server} = require("socket.io")
const Contenedor = require("./managers/contenedorProductos")
const ContenedorM = require("./managers/contenedorMensajes")


//servicios
const productosService = new Contenedor("productos.txt")
const mensajesService = new ContenedorM("mensajes.txt")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = process.env.PORT || 8000 //variable de entorno

//Inicializamos el serv

//servidor de express
const server = app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))

//Servidor de websocket y lo conectamos con el servidor express
const io = new Server(server)

//trabajar con archivos estaticos de la carpeta public
app.use(express.static(__dirname+"/public"))

const historicoMensajes = []

//websocket
io.on("connection",async(socket)=>{
    console.log("Nuevo usuario conectado",socket.id)
    //enviar todos los productos al usuario cuando se conecte
    socket.emit("products",await productosService.getAll())

    //recibimos el nuevo producto del cliente y lo guardamos
    socket.on("newProduct",async(data)=>{
        await productosService.save(data)

        //enviamos la lista de productos actualizada a todos los sockets conectados
        io.sockets.emit("products", await productosService.getAll())
    })

    //enviar a todos menos al socket conectado
    socket.broadcast.emit("newUser")
    socket.emit("historico",historicoMensajes)
    
    //recibir el evento message de un cliente 
    socket.on("message",data=>{
        historicoMensajes.push(data)

        mensajesService.save(data)

        //enviar a todos
        io.sockets.emit("historico",historicoMensajes)
    })
})