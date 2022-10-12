const { Server } = require("net");

// const server = new Server(); -> Dejo de ser un variable global

// Vamos a definir una cadena que indique cuando se ha acabao la conexión
const END = "END";
const host = '0.0.0.0';

const listen = (port) => {

  const server = new Server();
  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort} `;
    console.log("New connection from: ", remoteSocket);
    socket.setEncoding("utf-8"); // Convierte la data en binario a texto
    // Cuando nos envíe datos el cliente
    socket.on("data", (message) => {
      if (message === END) {
        socket.end(); // Se cierra el socket y se liberan los recursos que estaba utilizando
      } else {
        console.log(`${remoteSocket} -> ${message}`);
      }
      //socket.write(data); // Devolvemos la información que nos envío el cliente
    });
    server.listen({ port, host}, () => {
      console.log(`listening on port: ${port}`);
    });
    socket.on("close", () => {
      console.log(`Connection with ${remoteSocket} closed`);
    });
  });

};

const error = (err) => {
  console.error(err);
  process.exit(1);
};

const main = () => {
  // Queremos recibir un puerto por la consola
  if (process.argv.length !== 3) {
    error(`Usage: node ${__filename} port`);
  }
  // console.log(process.argv); // Lista de argumentos que nos van a dar

  let port = process.argv[2]; // Tomamos el puerto
  if (isNaN(port)) {
    // Si el puerto no es un número
    error(`Invalid port: ${port} `);
  }

  port = Number(port);

  listen(port);
};

// Si este es el archivo main ejecuta main
if (require.main === module) {
  main();
}
