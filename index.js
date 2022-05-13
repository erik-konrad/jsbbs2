const net = require("net");
const bbs = require('./app/bbs');
require('dotenv').config();

var PETSCII, decode, encode;

({ PETSCII } = require("petscii"));

({ decode, encode } = PETSCII);

const server = net.createServer();

server.on('connection', (socket) => {
    socket.inputBuffer = '';
    socket.bbsMode = 'main';

    socket.pages = {
        path: ''
    }

    console.log(`new connection from ${socket.remoteAddress}:${socket.remotePort}`);
    bbs.welcomeScreen(socket);
    bbs.motd(socket);
    bbs.commandPrompt(socket);

    socket.on('data', (data) => {
        bbs.main(socket, data);
    });

    socket.on('close', () => {
        console.log(`connection closed from ${socket.remoteAddress}:${socket.remotePort}`);
    });
});

server.listen(process.env.BBS_PORT, () => {
    console.log(`JSBBS2 started at ${server.address()['address']} ${server.address()['port']}`);
});
