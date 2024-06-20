function flatFiles(file) {
    if (file.endsWith('*')) {
        let paths = []

        fs.readdir(file.slice(0, file.length - 1), (err, files) => {
            files.forEach(f => {
                paths.push(f);
            })
        })

        return paths
    }

    return [file]
}

module.exports = { flatFiles }