const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
}); // Leer mensajes desde la consola

const END = "END";

const socket = new Socket();

const error = (message) => {
  console.error(message);
  process.exit(1);
};

socket.connect({ host: "localhost", port: 8000 });

// Cuando el usuario escriba una línea es mandarsela al servidor
readline.on("line", (message) => {
  socket.write(message);
  if (message === END) {
    socket.end();
  }
});

// socket.write("Hola"); // Envía un Buffer datos en binario
socket.setEncoding("utf-8"); // Convierte la data en binario a texto
socket.on("data", (data) => {
  console.log(data);
});

socket.on("close", () => process.exit(0)); // Esperamos a que el servidor nos confirme la finalización del proceso, entonces lo matamos

const main = () => {
  // Queremos recibir un puerto por la consola
  if (process.argv.length !== 4) {
    // node programa host puerto
    error(`Usage: node ${__filename} host port`);
  }

  // let host = process.argv[2];
  // let port = process.argv[3];

  let [ , ,host,port] = process.argv; // no me interesan los primeros 2 elementos 

  console.log(`${host}:${port}`);
};

// Si este es el archivo main ejecuta main, signfica que no se ha importado entonces lo ejecuta
if (require.main === module) {
  main();
}
