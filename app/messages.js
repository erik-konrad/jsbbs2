var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);
const petscii = require('../config/petscii.json');

const filesystem = require('./filesystem');
const bbs = require('./bbs');
const mainMenu = require('./main');
const database = require('./database');

const main = (socket) => {
    if (socket.messages.username === '' && socket.inputBuffer === '') {
        socket.write(encode('shifted', 'Bitte Usernamen eingeben') + chr(petscii.return));
        bbs.commandPrompt(socket);
    } else if (socket.messages.username === '' && socket.inputBuffer !== '') {
        socket.messages.username = socket.inputBuffer.toLowerCase();
        socket.write(encode('shifted', `Willkommen auf dem Bulletin Board, ${socket.messages.username}!`) + chr(petscii.return));
        help(socket);
        bbs.commandPrompt(socket);
    } else {
        socket.inputBufferParsed = socket.inputBuffer.split(' ');
        switch (socket.inputBufferParsed[0].toLowerCase()) {
            case 'menu':
                mainMenu.home(socket);
                break;
            case 'help':
                help(socket);
                bbs.commandPrompt(socket);
                break;
            case 'list':
                listPosts(socket, (socket.inputBufferParsed[1] ? socket.inputBufferParsed[1] : 0))
                bbs.commandPrompt(socket);
                break;
            case 'last':
                bbs.commandPrompt(socket);
                break;
            case 'new':
                bbs.commandPrompt(socket);
                break;
            case 'rename':
                socket.messages.username = '';
                socket.write(encode('shifted', 'Bitte Usernamen eingeben') + chr(petscii.return));
                bbs.commandPrompt(socket);
                break;
            case 'user':
                socket.write(encode('shifted', `Angemeldet als: ${socket.messages.username}`) + chr(petscii.return));
                bbs.commandPrompt(socket);
                break;
            default:
                bbs.commandPrompt(socket);
                break;
        }
    }
}
exports.main = main;

const help = (socket) => {
    filesystem.getContent(process.env.BBS_MESSAGES_HELP, socket);
}
exports.help = help;

function listPosts(socket, limit = 0) {
    limit = parseInt(limit);
    let posts = database.getPosts(limit);
    if (posts.length === 0) {
        socket.write(encode('shifted', `No Messages in Board`));
        return;
    }
    for (let i = 0; i < posts.length; i++) {
        renderPost(socket, posts[i]);
    }
}

function renderPost(socket, post) {
    socket.write(encode('shifted', `########################################`));
    socket.write(encode('shifted', `User: ${post.name}`) + chr(petscii.return));
    socket.write(encode('shifted', `Date: ${post.date}`) + chr(petscii.return) + chr(petscii.return));
    socket.write(encode('shifted', post.message) + chr(petscii.return) + chr(petscii.return));
}

function chr(code) {
    return filesystem.chr(code);
}