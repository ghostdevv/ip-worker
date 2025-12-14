import { describe, it, expect } from 'vitest';
import worker from './index';

const MOCK_URL = 'http://vitest/';

describe('cors', () => {
	it('should return wildcard access control', async () => {
		const response = await worker.fetch(new Request(MOCK_URL, { method: 'GET' }));
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	it('should return preflight headers', async () => {
		const response = await worker.fetch(new Request(MOCK_URL, { method: 'OPTIONS' }));
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(response.headers.get('Access-Control-Allow-Methods')).toBe('*');
	});
});

describe('ip', () => {
	it('should return plain text ip address', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL, {
				method: 'GET',
				headers: { 'cf-connecting-ip': '127.0.0.1' },
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('text/plain'),
		);

		const text = await response.text();
		expect(text).toBe('127.0.0.1');
	});

	it('should return plain text ip address with wildcard accept', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL, {
				method: 'GET',
				headers: { 'cf-connecting-ip': '127.0.0.1', Accept: '*/*' },
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('text/plain'),
		);

		const text = await response.text();
		expect(text).toBe('127.0.0.1');
	});

	it('should return json ip address', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL, {
				method: 'GET',
				headers: {
					'cf-connecting-ip': '127.0.0.1',
					accept: 'application/json',
				},
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('application/json'),
		);

		const json = await response.json();
		expect(json).toMatchObject({ ip: '127.0.0.1' });
	});

	it('should return plain text ip address from /ip endpoint', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL + 'ip', {
				method: 'GET',
				headers: { 'cf-connecting-ip': '192.168.1.1' },
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('text/plain'),
		);

		const text = await response.text();
		expect(text).toBe('192.168.1.1');
	});

	it('should return json ip address from /ip endpoint', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL + 'ip', {
				method: 'GET',
				headers: {
					'cf-connecting-ip': '192.168.1.1',
					accept: 'application/json',
				},
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('application/json'),
		);

		const json = await response.json();
		expect(json).toMatchObject({ ip: '192.168.1.1' });
		// Content-Type already checked above
	});
});

describe('cc', () => {
	it('should return plain text country code', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL + 'cc', {
				method: 'GET',
				headers: { 'cf-ipcountry': 'US' },
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('text/plain'),
		);

		const text = await response.text();
		expect(text).toBe('US');
	});

	it('should return json country code', async () => {
		const response = await worker.fetch(
			new Request(MOCK_URL + 'cc', {
				method: 'GET',
				headers: {
					'cf-ipcountry': 'GB',
					accept: 'application/json',
				},
			}),
		);

		expect(response.headers.get('Content-Type')).toEqual(
			expect.stringContaining('application/json'),
		);

		const json = await response.json();
		expect(json).toMatchObject({ cc: 'GB' });
	});
});
