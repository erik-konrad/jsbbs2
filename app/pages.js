var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);

const petscii = require('../config/petscii.json');
const filesystem = require('./filesystem');
const bbs = require('./bbs');
const path = require('path');

const main = function (socket) {
    switch (socket.inputBuffer.toLowerCase()) {
        case 'menu':
            socket.write(encode('shifted', 'Wechsle ins Hauptmenu') + chr(petscii.return));
            socket.bbsMode = 'main';
            bbs.motd(socket);
            bbs.commandPrompt(socket);
            break;
        case 'home':
            socket.pages.path = 'pages';
            getPageContent(socket);
            bbs.commandPrompt(socket);
            break;
        case 'help':
            filesystem.getContent(process.env.BBS_PAGES_HELP, socket)
            bbs.commandPrompt(socket);
            break;
        case 'ls':
            getDirectory(socket);
            bbs.commandPrompt(socket);
            break;
        case '..':
            if (socket.pages.path === 'pages') {
                socket.write(encode('shifted', `Du befindest dich bereits auf der Start-seite`) + chr(petscii.return));
            } else {
                goDirectoryUp(socket);
                getPageContent(socket);
            }
            bbs.commandPrompt(socket);
            break;
        case '.':
            getPageContent(socket);
            bbs.commandPrompt(socket);
            break;
        default:
            switchDirectory(socket);
            bbs.commandPrompt(socket);
            break;
    }
}
exports.main = main

const goDirectoryUp = (socket) => {
    const lastSlash = socket.pages.path.lastIndexOf('/');
    socket.pages.path = socket.pages.path.substring(0, lastSlash);
}

const switchDirectory = (socket) => {
    let directory = filesystem.getFoldersFromDirectory('./bbs/' + socket.pages.path);
    if (directory[socket.inputBuffer.toLowerCase()]) {
        socket.pages.path = socket.pages.path + '/' + directory[socket.inputBuffer.toLowerCase()];
        getPageContent(socket);
        console.log(socket.pages.path);
    } else {
        socket.write(encode('shifted', 'Seite ' + socket.inputBuffer + ' nicht gefunden') + chr(petscii.return));
    }
}

const getDirectory = (socket) => {
    let directory = filesystem.getFoldersFromDirectory('./bbs/' + socket.pages.path);
    socket.write(encode('shifted', '## Inhaltsverzeichnis ##') + chr(petscii.return));
    directory.forEach(function (folder, index) {
        socket.write(encode('shifted', index + ' => ' + folder) + chr(petscii.return));
    })
    socket.write(encode('shifted', '.. => eine Ebene hoch') + chr(petscii.return));
}

const getPageContent = (socket) => {
    if (filesystem.exists('./bbs/' + socket.pages.path + '/index.txt')) {
        filesystem.getContent(socket.pages.path + '/index.txt', socket);
    } else if (filesystem.exists('./bbs/' + socket.pages.path + '/index.seq')) {
        filesystem.getContent(socket.pages.path + '/index.seq', socket);
    } else {
        socket.write(encode('shifted', `Keine Indexdatei gefunden`) + chr(petscii.return));
    }
}
exports.getPageContent = getPageContent;

const showHelp = function (socket) {

}
exports.showHelp = showHelp;

function chr(code) {
    return filesystem.chr(code);
}