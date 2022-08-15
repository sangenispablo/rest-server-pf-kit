const socket = io();

function render(data) {
  const html = data
    .map((elem) => {
      return `
        <div>
            <strong>${elem.author}</strong>
            <em>${elem.text}</em>
        </div>`;
    })
    .join(" ");
  document.getElementById("chat").innerHTML = html;
}

function addMessage(e) {
  const mensaje = {
    author: document.getElementById("username").value,
    text: document.getElementById("texto").value,
  };
  socket.emit("new-message", mensaje);
  document.getElementById("texto").value = "";
  return false;
}

socket.on("chat", (data) => {
  render(data);
});
