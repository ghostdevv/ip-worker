import { AutoRouter, cors, json, text, type IRequest } from 'itty-router';

function ip(request: IRequest) {
	const accept = request.headers.get('accept');
	const ip = request.headers.get('cf-connecting-ip');

	switch (accept) {
		case 'application/json':
			return json({ ip });

		case 'text/plain':
		default:
			return text(`${ip}`);
	}
}

function cc(request: IRequest) {
	const accept = request.headers.get('accept');
	const cc = request.headers.get('cf-ipcountry');

	switch (accept) {
		case 'application/json':
			return json({ cc });

		case 'text/plain':
		default:
			return text(`${cc}`);
	}
}

const { preflight, corsify } = cors();

const router = AutoRouter({ before: [preflight], finally: [corsify] })
	.get('/', ip)
	.get('/ip', ip)
	.get('/cc', cc);

export default { fetch: router.fetch };
