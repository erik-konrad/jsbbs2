var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);
const petscii = require('../config/petscii.json');

const filesystem = require('./filesystem');
const bbs = require('./bbs');
const pages = require('./pages');

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
            filesystem.getContent(process.env.BBS_MAIN_HELP, socket)
            bbs.commandPrompt(socket);
            break;
        case 'downloads':
            socket.write(encode('shifted', 'Noch nicht implementiert - SORRY') + chr(petscii.return));
            bbs.commandPrompt(socket);
            break;
        case 'pages':
            socket.write(encode('shifted', 'Wechsle in den Seitenmodus') + chr(petscii.return));
            pages.getPageContent(socket);
            socket.bbsMode = 'pages';
            bbs.commandPrompt(socket);
            break;
        case 'messages':
            socket.write(encode('shifted', 'Noch nicht implementiert - SORRY') + chr(petscii.return));
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

function chr(code) {
    return filesystem.chr(code);
}