import * as fs from 'fs';
import FormData from 'form-data';
import { IncomingMessage } from 'http';

export function fmt<T extends Record<string, unknown>>(
  template: string,
  values: T
): string {
    return template.replace(/\${([^}]+)}/g, (match, key: string) => {
        const trimmedKey = key.trim();
        return String(values[trimmedKey as keyof T] ?? match); // Fallback to original if key is missing
    });
}

export interface SplitOptions {
    maxLength?: number;
    char?: string;
    prepend?: string;
    append?: string;
}

export async function send(
    url: string,
    name: string,
    avatar: string,
    text: string,
    file: string,
    options?: SplitOptions
) {
    const {
        maxLength = 2000,
        char = '\n',
        prepend = '',
        append = ''
    } = options || {};
    
    const path = flatFiles(file)[0];

    const sendInternal = (form: FormData) => new Promise((
        resolve: (value: IncomingMessage) => void, 
        reject: (reason: Error) => void
    ) => {
        form.submit(url, (error, response) => {
            if (error) reject(error);
            else resolve(response);
        });
    });
    
    async function send(message: string, attachFile: boolean) {
        const form = new FormData();

        if (name) {
            form.append('username', name);
        }

        if (avatar) {
            form.append('avatar_url', avatar);
        }
        
        form.append('content', message);

        if (attachFile && path) {
            form.append('file', fs.createReadStream(path));
        }

        const res = await sendInternal(form);
        
        if (res.statusCode != 200) {
            throw new Error(`Error sending webhook: ${res.statusCode} status code.`);
        }
    }
    
    if (text.length < maxLength) {
        return await send(text, true);
    }
    
    const splitText: string[] = splitMessage(text, { maxLength, char, prepend, append });
    
    for (let i = 0; i < splitText.length; i++) {
        const chunk = splitText[i];
        await send(chunk, i == splitText.length - 1);
    }
}

function splitMessage(
    text: string,
    options?: SplitOptions
): string[] {
    const {
        maxLength = 2000,
        char = '\n',
        prepend = '',
        append = ''
    } = options || {};
    
    const chunks: string[] = [];
    let currentChunk = prepend;
    
    const lines = text.split(char);
    
    for (const line of lines) {
        // If adding this line would exceed maxLength
        if (currentChunk.length + line.length + append.length + char.length > maxLength) {
            // If currentChunk has content besides prepend, push it
            if (currentChunk !== prepend) {
                chunks.push(currentChunk + append);
                currentChunk = prepend + line;
            } 
            // If even a single line is too long, split it
            else if (line.length > maxLength - prepend.length - append.length) {
                const lineChunks = splitLongLine(
                    line, 
                    maxLength - prepend.length - append.length
                );
                
                for (const [i, chunk] of lineChunks.entries()) {
                    chunks.push(prepend + chunk + append);
                }
                
                currentChunk = prepend;
            } else {
                chunks.push(prepend + line + append);
                currentChunk = prepend;
            }
        } else {
            if (currentChunk !== prepend) {
                currentChunk += char + line;
            } else {
                currentChunk += line;
            }
        }
    }
    
    if (currentChunk !== prepend) {
        chunks.push(currentChunk + append);
    }
    
    return chunks;
}

function splitLongLine(line: string, maxChunkLength: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < line.length) {
        let end = start + maxChunkLength;
        chunks.push(line.slice(start, end));
        start = end;
    }
    
    return chunks;
}

function flatFiles(file: string) {
    if (file.endsWith('*')) {
      const sliced = file.slice(0, file.length - 1)
      return fs.readdirSync(sliced).flatMap((f) => sliced + '/' + f);
    }

    return [file]
}