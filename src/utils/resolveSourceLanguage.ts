/**
 * DeepL accepts only a bare ISO-639-1 code as `source_lang`. A regional tag
 * such as `nl-NL` — which is what WordPress puts in `<html lang>` — is
 * rejected with HTTP 400, so the region has to be stripped before sending.
 *
 * Returns an empty string when the tag cannot be used, letting the server
 * fall back to the site locale rather than guessing here.
 */
export const resolveSourceLanguage = ( lang: string ): string => {
	const primarySubtag = ( lang ?? '' ).trim().split( /[-_]/ )[ 0 ] ?? '';

	if ( ! /^[a-z]{2}$/i.test( primarySubtag ) ) {
		return '';
	}

	return primarySubtag.toUpperCase();
};
