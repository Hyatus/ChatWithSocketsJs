const { Server } = require("net");

// const server = new Server(); -> Dejo de ser un variable global

// Vamos a definir una cadena que indique cuando se ha acabao la conexión
const END = "END";
const host = "0.0.0.0";

const error = (message) => {
  console.error(message);
  process.exit(1);
};

// 127.0.0.1:8080 -> User1
// 127.0.0.2:8080 -> User2
const connections = new Map(); // Aquí vamos a guardar todas las conexiones para identificar a los usuarios

const sendMessage = (message, origin) => {
  // Mandar a todos menos a origin el message
  //console.log(`Sending Messages`);
  for (const socket of connections.keys()){
    if (socket != origin){
      // Si el socket que tengo es distinto del que lo ha mandado entonces le envío el mensaje 
      socket.write(message);
    }
  }
};

const listen = (port) => {
  const server = new Server(); // Creamos el Servidor

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort} `;

    console.log("New connection from: ", remoteSocket);
    socket.setEncoding("utf-8"); // Convierte la data en binario a texto

    // Cuando nos envíe datos el cliente
    socket.on("data", (message) => {
      if (!connections.has(socket)) {
        // Vamos a loggearlo también
        console.log(`Username ${message} set for connection ${remoteSocket}`);
        // Si este socket no está en el mapa es porque este es el primer mensaje
        connections.set(socket, message);
      } else if (message === END) {
        connections.delete(socket); // Eliminamos al socket del mapa 
        socket.end(); // Se cierra el socket y se liberan los recursos que estaba utilizando    
      } else {

        // Imprimimos la lista de usuarios conectados
        // console.log('----- USUARIOS ------')
        // for(const username of connections.values()){
        //   console.log(username);  
        // }
        // console.log('----- -------- ------');

        // Enviar el mensaje al resto de clientes
        const fullMessage = `[${connections.get(socket)}]: ${message}`
        console.log(`${remoteSocket} -> ${fullMessage}`);
        // Mensaje y de dónde ha salido el mensaje
        sendMessage(fullMessage,socket);
      }
      //socket.write(data); // Devolvemos la información que nos envío el cliente
    });

    server.on("error", (err) => error(err.message));

    socket.on("close", () => {
      console.log(`Connection with ${remoteSocket} closed`);
    });
  });

  // Devuelve error si por ejemplo algún puerto ya está ocupado
  server.on("error", (err) => error(err.message));

  server.listen({ port, host }, () => {
    console.log(`listening on port: ${port}`);
  });
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
