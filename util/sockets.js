const chat = require("../data/chat");

module.exports = (io) => {
  // connection se dispara cuando en el cliente se crea la conexion
  io.on("connection", (socket) => {
    console.log("Cliente nuevo: ", socket.id);

    // Esto lo mando a todos los conectados
    socket.emit("chat", chat);

    // este evento se dispara para enviar datos a todos
    socket.on("new-message", (data) => {
      chat.push(data);
      io.sockets.emit("chat", chat);
    });

    socket.on('disconnet', ()=>{
        console.log('se fue uno');
    })

  });
};
