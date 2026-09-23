export const resolveSourceLanguage = ( lang: string ): string => {
	const primarySubtag = ( lang ?? '' ).trim().split( /[-_]/ )[ 0 ] ?? '';

	if ( ! /^[a-z]{2}$/i.test( primarySubtag ) ) {
		return '';
	}

	return primarySubtag.toUpperCase();
};
