const net = require("net");
const bbs = require('./app/bbs');
const mainMenu = require('./app/main');
const filesystem = require('./app/filesystem');
const petscii = require('./config/petscii.json');
require('dotenv').config();

var PETSCII, decode, encode;

({ PETSCII } = require("petscii"));

({ decode, encode } = PETSCII);

const server = net.createServer();

server.on('connection', (socket) => {
    socket.inputBuffer = '';
    socket.bbsMode = 'main';

    socket.pages = {
        path: 'pages'
    }

    socket.messages = {
        username: '',
        mode: 'menu'
    }

    console.log(`new connection from ${socket.remoteAddress}:${socket.remotePort}`);
    socket.write(encode('shifted', `${process.env.BBS_NAME} powered by JSBBS 2`) + chr(petscii.return));
    bbs.welcomeScreen(socket);
    bbs.motd(socket);
    mainMenu.helpMenu(socket);
    bbs.commandPrompt(socket);

    socket.on('data', (data) => {
        bbs.main(socket, data);
    });

    socket.on('error', (err) => {
        console.log('an error occured:');
        console.log(err);
    })

    socket.on('close', () => {
        console.log(`connection closed from ${socket.remoteAddress}:${socket.remotePort}`);
    });
});

server.listen(process.env.BBS_PORT, () => {
    console.log(`JSBBS2 started at ${server.address()['address']} ${server.address()['port']}`);
});

function chr(code) {
    return filesystem.chr(code);
}