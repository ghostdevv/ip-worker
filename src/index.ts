import { AutoRouter, cors, json, text, html, type IRequest } from 'itty-router';
import { getBestMatch } from './accept';

const SUPPORTED_TYPES = ['text/plain', 'application/json', 'text/html'];

const htmlTpl = (title: string, slot: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ghostsui@beta/ghostsui.css" />
    </head>
    <body>
        ${slot}

        <style>
            h1 {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        </style>
    </body>
    </html>
`;

function ip(request: IRequest) {
	const accept = request.headers.get('accept');
	const ip = request.headers.get('cf-connecting-ip');

	const bestMatch = getBestMatch(accept, SUPPORTED_TYPES);

	switch (bestMatch) {
		case 'application/json':
			return json({ ip });

		case 'text/html':
			return html(htmlTpl('IP Address', `<h1>${ip}</h1>`));

		case 'text/plain':
		default:
			return text(`${ip}`, { headers: { 'Content-Type': 'text/plain' } });
	}
}

function cc(request: IRequest) {
	const accept = request.headers.get('accept');
	const cc = request.headers.get('cf-ipcountry');

	const bestMatch = getBestMatch(accept, SUPPORTED_TYPES);

	switch (bestMatch) {
		case 'application/json':
			return json({ cc });

		case 'text/html':
			return html(htmlTpl('Country Code', `<h1>${cc}</h1>`));

		case 'text/plain':
		default:
			return text(`${cc}`, { headers: { 'Content-Type': 'text/plain' } });
	}
}

const { preflight, corsify } = cors();

const router = AutoRouter({ before: [preflight], finally: [corsify] })
	.get('/', ip)
	.get('/ip', ip)
	.get('/cc', cc);

export default { fetch: router.fetch };
