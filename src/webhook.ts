import https from 'https';
import http from 'http';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

export interface DiscordWebhookOptions {
    username?: string;
    avatar_url?: string;
    content?: string;
    files?: {
        name: string;
        data: Buffer | fs.ReadStream | string;
    }[];
}

/**
 * Send a Discord webhook with optional files
 * @param webhookUrl The Discord webhook URL
 * @param options Webhook options including files
 */
export async function sendDiscordWebhook(
  webhookUrl: string,
  options: DiscordWebhookOptions
): Promise<void> {
    const formData = new FormData();

    // Add JSON payload for the message
    const payload = {
        username: options.username,
        avatar_url: options.avatar_url,
        content: options.content,
    };

    formData.append('payload_json', JSON.stringify(payload));

    if (options.files) {
        for (const file of options.files) {
            let fileData: Buffer | fs.ReadStream;

            if (typeof file.data === 'string') {
                // If it's a file path, read the file
                if (fs.existsSync(file.data)) {
                    fileData = fs.createReadStream(file.data);
                } else {
                    // If it's not a file path, treat as text content
                    fileData = Buffer.from(file.data, 'utf-8');
                }
            } else {
                fileData = file.data;
            }

            formData.append('file', fileData, file.name);
        }
    }

    const url = new URL(webhookUrl);
    const transport = https;

    const requestOptions = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
        ...formData.getHeaders(),
        },
    };

    return new Promise((resolve, reject) => {
        const req = transport.request(requestOptions, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode && res.statusCode == 200) {
                    console.log('Webhook sent successfully');
                    resolve();
                } else {
                    console.error('Failed to send webhook:', res.statusCode, responseData);
                    reject(new Error(`Webhook failed with status ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error sending webhook:', error);
            reject(error);
        });

        // Write the form data to the request
        formData.pipe(req);
    });
}