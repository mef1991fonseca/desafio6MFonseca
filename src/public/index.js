// crea un nuevo objeto `Date`
let today = new Date();
 
// obtener la fecha y la hora
let now = today.toLocaleString();

console.log("JS Funcionando")

//creamos el socket cliente
const socketCliente = io()

let user
//captura el valor del usuario
Swal.fire({
    title:"Hola",
    text:"Bienvenido, ingresa tu email",
    input:"text",
    allowOutsideClick: false
}).then(respuesta=>{
    //console.log(respuesta)
    user = respuesta.value
})

//guardar un producto desde el cliente
const productForm = document.getElementById("productForm")
productForm.addEventListener("submit", (evt)=>{
    //prevenir comportamientos por defecto no deseados del formulario
    evt.preventDefault()
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    //enviamos el nuevo producto al servidor
    socketCliente.emit("newProduct",product)
    //console.log(product)
})

//productos en tiempo real
//crear una tabla en html basado en los datos, y en los templates de hbs
const createTable = async(data)=>{
    const response = await fetch("./templates/table.Handlebars")
    const result = await response.text()
    const template = Handlebars.compile(result)
    const html = template({products:data})
    return html
}

const productsContainer = document.getElementById("productsContainer")
socketCliente.on("products",async(data)=>{
    //console.log(data)
    //Generar el html basado en la plantilla de hbs con todos los productos
    const htmlProducts = await createTable(data)
    productsContainer.innerHTML = htmlProducts
})

//logica del chat
const campo = document.getElementById("messageField")
campo.addEventListener("keydown", (evt)=>{
    //console.log(evt.key)
    if(evt.key === "Enter"){
        socketCliente.emit("message",{
            userName: user,
            message: campo.value,
            today: now
        })
        campo.value = ""
    }
})

const messageContainer = document.getElementById("messageContainer")

socketCliente.on("historico",(data)=>{
    let elementos = ""
    data.forEach(item => {
        elementos = elementos + `<p style="color:blue";><strong>${item.userName}</strong>: </p> 
                                <p style="color:Brown";>${item.message}</p> <p style="color:green";>${item.today}</p>`
    });
    //console.log(data)
    messageContainer.innerHTML = elementos
})

/*
socketCliente.on("newUser",()=>{
    Swal.fire({
        text: "Nuevo usuario conectado",
        toast: true
    })
})*/