import * as fs from 'fs';

export function flatFiles(file: string) {
    if (file.endsWith('*')) {
      const sliced = file.slice(0, file.length - 1)
      return fs.readdirSync(sliced).flatMap((f) => sliced + '/' + f);
    }

    return [file]
}