const socket = io('http://localhost:5000', { transports: ['websocket'] });

const messageInput = document.getElementById('messageInput');
const messageContainer = document.getElementById("messageContainer")
const sendContainer = document.getElementById('sendContainer');
const currentuser = document.getElementById('currentuser');
const currentteam = document.getElementById('currentteam');
const scroll = document.getElementById('scroll');

const name = currentuser.innerHTML;
var team = currentteam.innerHTML;

socket.emit('new-user-joined', name, team)

socket.on('chat-message', data => {
    scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;

    const element = `<li style="background-color: #8bf2f7; color: #048187; width: 70%; float: left; margin: 3px;"> <strong>${data.name}: </strong> ${data.message}</li> `
    messageContainer.insertAdjacentHTML('beforeend', element)

    scrollToBottom();
})

sendContainer.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value
    if (message != '') {
        scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;

        const element = `<li style="background-color: #77f77f; color: #03a80e; width: 70%; float: right; margin: 3px;"> <strong>You: </strong> ${message}</li> `
        messageContainer.insertAdjacentHTML('beforeend', element)
        socket.emit('send-chat-message', message, team)

        scrollToBottom();

        messageInput.value = ''
    }
})

document.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();

        const message = messageInput.value
        if (message != '') {
            scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;

            const element = `<li style="background-color: #77f77f; color: #03a80e; width: 70%; float: right; margin: 3px;"> <strong>You: </strong> ${message}</li> `
            messageContainer.insertAdjacentHTML('beforeend', element)
            socket.emit('send-chat-message', message, team)

            scrollToBottom();

            messageInput.value = ''
        }
    }
})

function scrollToBottom() {
    scroll.scrollTop = scroll.scrollHeight;
}
scrollToBottom();