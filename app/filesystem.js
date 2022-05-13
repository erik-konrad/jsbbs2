var PETSCII, decode, encode;
({ PETSCII } = require("petscii"));
({ decode, encode } = PETSCII);

const fs = require('fs');
const petscii = require('../config/petscii.json');
const path = require('path');

const getContent = function (file, socket) {
    let bbsPath = `./bbs/${file}`;
    switch (path.extname(bbsPath)) {
        case '.seq':
            socket.write(chr(petscii.cls) + chr(petscii.graphic))
            socket.write(getFileData(bbsPath));
            socket.write(chr(petscii.shift) + chr(petscii.return))
            break;
        default:
            socket.write(encode('shifted', getFileData(bbsPath, true)) + chr(petscii.return))
            break;

    }
}

exports.getContent = getContent;

function getFileData(fileName, parsed = false) {
    if (exists(fileName)) {
        try {
            const data = fs.readFileSync(fileName, (parsed ? 'utf8' : ''))
            return data;
        } catch (err) {
            console.error(err)
        }
    } else {
        console.log(fileName + ' not found!');
        return '';
    }
}

const getDirectory = (path) => {
    let directory = fs.readdirSync(path);
    return directory;
}
exports.getDirectory = getDirectory;

const getFoldersFromDirectory = (path) => {
    return getDirectory(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}
exports.getFoldersFromDirectory = getFoldersFromDirectory

const exists = function (fileName) {
    return fs.existsSync(fileName)
}
exports.exists = exists;

const chr = function (code) {
    return String.fromCharCode(code);
}

exports.chr = chr;