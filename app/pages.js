var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);

const petscii = require('../config/petscii.json');
const filesystem = require('./filesystem');
const bbs = require('./bbs');

const main = function (socket) {
    switch (socket.inputBuffer.toLowerCase()) {
        case 'home':
            socket.write(encode('shifted', 'Wechsle ins Hauptmenu') + chr(petscii.return));
            socket.bbsMode = 'main';
            bbs.commandPrompt(socket);
            break;
        case '..':
            if (socket.pages.path === '') {
                socket.write(encode('shifted', `Du befindest dich bereits auf der Start-seite`) + chr(petscii.return));
            } else {
                socket.write(encode('shifted', 'Noch nicht implementiert - SORRY') + chr(petscii.return));
            }
            bbs.commandPrompt(socket);
            break;
        default:
            getPageContent(socket);
            bbs.commandPrompt(socket);
            break;
    }
}
exports.main = main

const getPageContent = (socket) => {
    if (socket.pages.path === '') {
        if (filesystem.exists('./bbs/pages/index.txt') || filesystem.exists('./bbs/pages/index.seq')) {
            filesystem.getContent('pages/index.txt', socket);
        } else {
            socket.write(encode('shifted', `Keine Indexdatei gefunden`) + chr(petscii.return));
        }
    }
}
exports.getPageContent = getPageContent;

const showHelp = function (socket) {

}
exports.showHelp = showHelp;

function chr(code) {
    return filesystem.chr(code);
}