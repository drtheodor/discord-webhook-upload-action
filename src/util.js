function flatFiles(file) {
    if (file.endsWith('*')) {
        let paths = []

        fs.readdir(file.slice(0, file.length - 1), (err, files) => {
            files.forEach(f => {
                paths.add(f);
            })
        })

        return paths
    }

    return [path]
}

module.exports = { flatFiles }