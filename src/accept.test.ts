import { describe, it, expect } from 'vitest';
import { parseAcceptHeader, getBestMatch } from './accept';

describe('parseAcceptHeader', () => {
	it('returns empty array for null or empty header', () => {
		expect(parseAcceptHeader(null)).toEqual([]);
		expect(parseAcceptHeader('')).toEqual([]);
	});

	it('parses simple media types and defaults quality to 1.0', () => {
		const result = parseAcceptHeader('text/html, application/json');
		expect(result).toHaveLength(2);
		// Sorted by quality (both 1.0) preserve order of appearance
		expect(result[0]).toMatchObject({
			type: 'text',
			subtype: 'html',
			quality: 1,
			parameters: {},
		});
		expect(result[1]).toMatchObject({
			type: 'application',
			subtype: 'json',
			quality: 1,
			parameters: {},
		});
	});

	it('parses quality values and sorts descending', () => {
		const header = 'application/xml;q=0.5, text/plain;q=0.9, image/png';
		const result = parseAcceptHeader(header);
		// image/png (default 1.0) > text/plain (0.9) > application/xml (0.5)
		expect(result.map((m) => `${m.type}/${m.subtype}`)).toEqual([
			'image/png',
			'text/plain',
			'application/xml',
		]);
		expect(result[0].quality).toBe(1);
		expect(result[1].quality).toBe(0.9);
		expect(result[2].quality).toBe(0.5);
	});

	it('captures non‑q parameters', () => {
		const header = 'text/html;level=1;foo=bar;q=0.8';
		const [media] = parseAcceptHeader(header);
		expect(media).toMatchObject({
			type: 'text',
			subtype: 'html',
			quality: 0.8,
			parameters: { level: '1', foo: 'bar' },
		});
	});
});

describe('getBestMatch', () => {
	const supported = ['text/html', 'application/json', 'image/png'];

	it('returns exact match when present', () => {
		const header = 'application/json';
		expect(getBestMatch(header, supported)).toBe('application/json');
	});

	it('uses quality to pick best among multiple matches', () => {
		const header = 'application/json;q=0.4, text/html;q=0.9';
		expect(getBestMatch(header, supported)).toBe('text/html');
	});

	it('matches wildcard subtype', () => {
		const header = 'image/*';
		expect(getBestMatch(header, supported)).toBe('image/png');
	});

	it('matches full wildcard', () => {
		const header = '*/*';
		expect(getBestMatch(header, supported)).toBe('text/html'); // first supported
	});

	it('returns null when no match', () => {
		const header = 'application/xml';
		expect(getBestMatch(header, supported)).toBeNull();
	});
});
