const { Socket } = require("net");

const socket = new Socket();

socket.connect({host:'localhost',port: 8000});

socket.write('Hola'); // Envía un Buffer datos en binario 
socket.setEncoding('utf-8'); // Convierte la data en binario a texto
socket.on('data',(data)=>{
    console.log(data);
})
