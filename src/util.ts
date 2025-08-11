import { ExecuteWebhookData, Webhook } from 'discord-webhooks-node';
import { findFilesToUpload } from './search';

import path from 'path';
import fs from 'fs';

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
    maxLength: number = 2000,
) {
    const paths = await findFilesToUpload(file);
    
    const webhook = new Webhook({ url });
    webhook.setAvatar(avatar);
    webhook.setUsername(name);
    
    async function send(message: string, attachFile: boolean) {
        let data: ExecuteWebhookData = {
            content: message,
        };

        if (attachFile && paths.filesToUpload) {
            console.log(paths.filesToUpload);
            data = data || { 
                files: paths.filesToUpload.map(file => ({ name: path.basename(file), file: fs.readFileSync(file) })),
            };
        }

        await webhook.execute(data);
    }
    
    if (text.length < maxLength) {
        return await send(text, true);
    }
    
    const splitText: string[] = splitMessage(text, { maxLength });
    
    for (let i = 0; i < splitText.length; i++) {
        await send(splitText[i], i == splitText.length - 1);
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