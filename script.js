const hostname = window.location.hostname
const socket = io("http://ec2-18-228-11-113.sa-east-1.compute.amazonaws.com:3000/");
document.addEventListener("DOMContentLoaded", start);
socket.emit('init', hostname);

function start() {
    const form = document.querySelector("#message");
    const chat = document.querySelector("#chat");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let message = {
            name: document.querySelector("#author").value.trim(),
            content: document.querySelector("#content").value.trim()
        };
        if (message.content.length > 0 && message.name.length > 0) {
            socket.emit("nuevo_mensaje", message);
            document.querySelector("#content").value = "";
            document.querySelector("#content").focus();
        }
    });
    socket.on("historial_mensaje", async(messages) => {
        let parrafo = '';
        for(let message of messages){
            parrafo += `<div class="message">
            <div class="name_message">${special(message.name)}</div>
            <div class="content_message">${special(message.content)}</div>
            </div>`;            
        }  
        chat.innerHTML += parrafo;
        scrollToBottom();      
    });
    socket.on("difundir_mensaje", (message) => {
        const parrafo = `<div class="message">
        <div class="name_message">${special(message.name)}</div>
        <div class="content_message">${special(message.content)}</div>
        </div>`;
        chat.innerHTML += parrafo;
        scrollToBottom();
    });
    function special(str) {
        str = str.replace(/</gi, "&lt;");
        str = str.replace(/>/gi, "&gt;");
        return str;
    }
    function scrollToBottom() {
        chat.scrollTop = chat.scrollHeight;
    }
}

