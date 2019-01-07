import { parse } from 'url';
import { IncomingMessage } from 'http';

export const fetch = async (url: string): Promise<any> => {
    const proto = parse(url).protocol.slice(0, -1);
    const fetcher = await import(proto);
    const res = await new Promise<string>(async (resolve, reject) => {
        const request = fetcher.get(url, (response: IncomingMessage) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error(`Failed to load service at: ${url}, status code:${response.statusCode}`));
            }
            const body: string[] = [];
            response.on('data', (chunk: string): void => {
                body.push(chunk);
            });
            response.on('end', (): void => resolve(body.join('')));
        });
        request.on('error', (err: any) => reject(err));
    });
    return JSON.parse(res);
};
