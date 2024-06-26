import * as fs from 'fs';

export function flatFiles(file: string) {
    if (file.endsWith('*')) {
      const sliced = file.slice(0, file.length - 1)
      return fs.readdirSync(sliced).flatMap((f) => sliced + '/' + f);
    }

    return [file]
}

export function stripFormat(text: string) {
    text = text.replace(/(\r\n|\n|\r)/gm, ', ')
    
    while (text.includes('  '))
        text = text.replace('  ', ' ') // wow thats shit

    return text
}
