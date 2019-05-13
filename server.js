const express = require('express');
const path = require('path');

const app = express();
// Protocolo HTTP
const server = require('http').createServer(app);
// Protocolo Socket
const io = require('socket.io')(server);

// Utulizando HTML
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res)=>{
    res.render('index.html');
});

let messages = [];

// Toda vez que um Client-side de conectar ao nosso servidor
io.on('connection', socket =>{
    console.log(`Socket conectado : ${socket.id}`);

    socket.emit('previousMsg', messages);

    // Recebe o Request do client-side
    socket.on('clientSide', data =>{
        messages.push(data);

        // Manda a msg para todos os socket conectados no server-side
        socket.broadcast.emit('msgRecente', data);
    });
});
server.listen(3000);