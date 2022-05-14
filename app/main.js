var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);
const petscii = require('../config/petscii.json');

const filesystem = require('./filesystem');
const bbs = require('./bbs');
const pages = require('./pages');
const messages = require('./messages');


const mainMenu = (socket) => {
    switch (socket.inputBuffer.toLowerCase()) {
        case '':
            socket.write(encode('shifted', 'Bitte gibt einen Befehl ein.') + chr(petscii.return));
            bbs.commandPrompt(socket);
            break;
        case 'exit':
            socket.destroy();
            break;
        case 'help':
            helpMenu(socket);
            bbs.commandPrompt(socket);
            break;
        case 'downloads':
            socket.write(encode('shifted', 'Noch nicht implementiert - SORRY') + chr(petscii.return));
            bbs.commandPrompt(socket);
            break;
        case 'pages':
            socket.write(encode('shifted', 'Pages') + chr(petscii.return));
            pages.getPageContent(socket);
            socket.bbsMode = 'pages';
            bbs.commandPrompt(socket);
            break;
        case 'messages':
            socket.write(encode('shifted', 'Bulletin Board') + chr(petscii.return));
            socket.bbsMode = 'messages';
            if (socket.messages.username === '') {
                socket.write(encode('shifted', 'Bitte Usernamen eingeben') + chr(petscii.return));
            }
            bbs.commandPrompt(socket);
            break;
        default:
            socket.write(encode('shifted', 'Eingabe nicht verstanden.') + chr(petscii.return));
            socket.write(encode('shifted', `Befehl: ${socket.inputBuffer}`) + chr(petscii.return));
            bbs.commandPrompt(socket);
            break;
    }
    return;
}

exports.mainMenu = mainMenu;

const helpMenu = (socket) => {
    filesystem.getContent(process.env.BBS_MAIN_HELP, socket);
}
exports.helpMenu = helpMenu;

const home = (socket) => {
    socket.write(encode('shifted', 'Wechsle ins Hauptmenu') + chr(petscii.return));
    socket.bbsMode = 'main';
    bbs.motd(socket);
    bbs.commandPrompt(socket);
}
exports.home = home;

function chr(code) {
    return filesystem.chr(code);
}