var sqlite = require("better-sqlite3");

const getPosts = function (limit = 0) {
    const db = new sqlite(process.env.BBS_DB, { verbose: console.log, fileMustExist: true });
    let result = [];
    if (limit > 0) {
        result = db.prepare("SELECT * FROM ( SELECT * FROM messages ORDER BY id DESC LIMIT ? ) ORDER BY date ASC;").all(limit);
    } else {
        result = db.prepare("SELECT * FROM messages;").all();
    }
    db.close();
    return result;
}


exports.getPosts = getPosts;