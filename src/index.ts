import { AutoRouter, cors, json, text, type IRequest } from 'itty-router';
import { getBestMatch } from './accept';

const SUPPORTED_TYPES = ['text/plain', 'application/json'];

function ip(request: IRequest) {
	const accept = request.headers.get('accept');
	const ip = request.headers.get('cf-connecting-ip');

	const bestMatch = getBestMatch(accept, SUPPORTED_TYPES);

	switch (bestMatch) {
		case 'application/json':
			return json({ ip });

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
