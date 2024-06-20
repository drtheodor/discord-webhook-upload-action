function files(path) {
    if (file.endsWith('*')) {
        let files = []

        fs.readdir(file, (err, files) => {
        files.forEach(f => {
            files.add(f);
        })
        })

        return files
    }

    return [path]
}

module.exports = { files }