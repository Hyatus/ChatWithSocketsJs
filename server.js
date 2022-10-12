const { Server } = require("net");

const server = new Server();

server.on("connection", (socket) => {
  console.log(
    `New connection from ${socket.remoteAddress}:${socket.remotePort}`
  );

  socket.setEncoding('utf-8'); // Convierte la data en binario a texto 

  // Cuando nos envíe datos el cliente
  socket.on("data", (data) => {
    socket.write(data); // Devolvemos la información que nos envío el cliente
  });
});


server.listen({ port: 8000, host: "0.0.0.0" }, () => {
  console.log("listening on port 8000");
});
