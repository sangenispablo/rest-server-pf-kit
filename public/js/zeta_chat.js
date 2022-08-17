const socket = io();

const emisor = document.getElementById("emisor").innerText;

function render(data) {
  const html = data
    .map((elem) => {
      if (emisor == elem.author) {
        return ` 
            <li class="clearfix">
                <div class="message other-message pull-right">
                    <img class="rounded-circle float-end chat-user-img img-30" src="/assets/images/user/12.png" alt="">
                    <div class="message-data">
                        <span class="message-data-time">${elem.hm}</span>
                    </div>
                    ${elem.text}
                </div>
            </li>`;
      } else {
        return `
            <li>
                <div class="message my-message">
                    <img class="rounded-circle float-start chat-user-img img-30" src="/assets/images/user/3.png" alt="">
                    <div class="message-data text-end">
                        <span class="message-data-time">${elem.hm}</span>
                    </div>
                    ${elem.text}
                </div>
            </li>`;
      }
    })
    .join(" ");
  document.getElementById("chat").innerHTML = html;
}

function addMessage(e) {
  const ahora = new Date();
  const hm = ahora.getHours().toString() + ":" + ahora.getMinutes().toString()+":"+ahora.getSeconds().toString();
  const mensaje = {
    author: document.getElementById("username").value,
    text: document.getElementById("texto").value,
    hm,
  };
  socket.emit("new-message", mensaje);
  document.getElementById("texto").value = "";
  return false;
}

socket.on("chat", (data) => {
  render(data);
});
