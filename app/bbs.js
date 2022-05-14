var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);

const petscii = require('../config/petscii.json');
const main = require('./main');
const filesystem = require('./filesystem');
const pages = require('./pages');
const messages = require('./messages');

exports.welcomeScreen = (socket) => {
    socket.write(chr(petscii.bell));
    filesystem.getContent(process.env.BBS_WELCOME, socket);
}

exports.motd = (socket) => {
    filesystem.getContent(process.env.BBS_MOTD, socket);
}

const commandPrompt = (socket) => {
    socket.write(encode('shifted', '> '));
}

exports.commandPrompt = commandPrompt;

exports.main = (socket, data) => {
    socket.write(data);
    processInput(socket, data);
}

function processInput(socket, data) {
    var encodedByte = data.toJSON()['data'][0];
    if (encodedByte != petscii.return) {
        if (encodedByte === petscii.del) {
            socket.inputBuffer = socket.inputBuffer.substr(0, socket.inputBuffer.length - 1);
            return;
        } else {
            return socket.inputBuffer += data.toString();
        }

    } else {
        switch (socket.bbsMode) {
            case 'main':
                main.mainMenu(socket);
                break;
            case 'pages':
                pages.main(socket);
                break;
            case 'messages':
                messages.main(socket);
                break;
            default:
                break;
        }
        socket.inputBuffer = '';
        return;
    }
}

function chr(code) {
    return filesystem.chr(code);
}

