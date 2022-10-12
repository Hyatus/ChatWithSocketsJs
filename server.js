const { Server } = require("net");

const server = new Server();

// Vamos a definir una cadena que indique cuando se ha acabao la conexión
const END = 'END';

server.on("connection", (socket) => {
  const remoteSocket = `${socket.remoteAddress}:${socket.remotePort} `;
  console.log("New connection from: ", remoteSocket);

  socket.setEncoding("utf-8"); // Convierte la data en binario a texto

  // Cuando nos envíe datos el cliente
  socket.on("data", (message) => {

    if (message === END){
        console.log(`Connection with ${remoteSocket} closed`)
        socket.end(); // Se cierra el socket y se liberan los recursos que estaba utilizando
    }else{
        console.log(`${remoteSocket} -> ${message}`);
    }
    
    //socket.write(data); // Devolvemos la información que nos envío el cliente
  });
});

server.listen({ port: 8000, host: "0.0.0.0" }, () => {
  console.log("listening on port 8000");
});
