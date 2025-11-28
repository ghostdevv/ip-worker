export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const contentType = request.headers.get('content-type');
		const ip = request.headers.get('cf-connecting-ip');
		const url = new URL(request.url);

		const body =
			contentType == 'application/json' || url.pathname.endsWith('json')
				? JSON.stringify({ ip })
				: `${ip}`;

		return new Response(body, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	},
};
