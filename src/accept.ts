export interface MediaType {
	type: string;
	subtype: string;
	quality: number;
	parameters: Record<string, string>;
}

export function parseAcceptHeader(acceptHeader: string | null): MediaType[] {
	if (!acceptHeader) {
		return [];
	}

	return acceptHeader
		.split(',')
		.map((part) => part.trim())
		.map(parseMediaType)
		.sort((a, b) => b.quality - a.quality); // Sort by quality (highest first)
}

function parseMediaType(mediaTypeString: string): MediaType {
	const parts = mediaTypeString.split(';').map((p) => p.trim());
	const [type, subtype] = parts[0].split('/');

	const parameters: Record<string, string> = {};
	let quality = 1.0;

	// Parse parameters
	for (let i = 1; i < parts.length; i++) {
		const [key, value] = parts[i].split('=');
		if (key === 'q') {
			quality = parseFloat(value) || 1.0;
		} else {
			parameters[key] = value;
		}
	}

	return {
		type: type || '*',
		subtype: subtype || '*',
		quality,
		parameters,
	};
}

export function getBestMatch(
	acceptHeader: string | null,
	supportedTypes: string[],
): string | null {
	const mediaTypes = parseAcceptHeader(acceptHeader);

	for (const mediaType of mediaTypes) {
		const fullType = `${mediaType.type}/${mediaType.subtype}`;

		// Exact match
		if (supportedTypes.includes(fullType)) {
			return fullType;
		}

		// Wildcard match
		if (mediaType.subtype === '*') {
			const match = supportedTypes.find((type) =>
				type.startsWith(mediaType.type + '/'),
			);
			if (match) return match;
		}

		// Full wildcard
		if (mediaType.type === '*' && mediaType.subtype === '*') {
			return supportedTypes[0]; // Return first supported type
		}
	}

	return null;
}
