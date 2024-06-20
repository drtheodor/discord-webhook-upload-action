const fs = require('fs')

function flatFiles(file) {
    if (file.endsWith('*')) {
        const sliced = file.slice(0, file.length - 1)
        return fs.readdirSync(sliced).flatMap((f) => sliced + '/' + f);
    }

    return [file]
}

module.exports = { flatFiles }