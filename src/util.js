const fs = require('fs')

function flatFiles(file) {
    if (file.endsWith('*')) {
        return fs.readdirSync(file.slice(0, file.length - 1));
    }

    return [file]
}

module.exports = { flatFiles }