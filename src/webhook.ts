import https from 'https';
import FormData from 'form-data';
import fs from 'fs';
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

export async function sendDiscordWebhook(
  webhookUrl: string,
  options: DiscordWebhookOptions
): Promise<void> {
    const formData = new FormData();

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
                if (fs.existsSync(file.data)) {
                    fileData = fs.createReadStream(file.data);
                } else {
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
                if (res.statusCode && (res.statusCode == 200 || res.statusCode == 204)) {
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