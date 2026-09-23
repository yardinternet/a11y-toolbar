/**
 * DeepL accepts only a bare ISO-639-1 code as `source_lang`. A regional tag
 * such as `nl-NL` — which is what WordPress puts in `<html lang>` — is
 * rejected with HTTP 400, so the region has to be stripped before sending.
 *
 * Returns an empty string when the tag cannot be used, letting the server
 * fall back to the site locale rather than guessing here.
 *
 * This check is deliberately about shape only. Whether DeepL actually accepts
 * the code as a source language — `fy`, `lb` and `is` are all well formed and
 * all unsupported — is decided server-side, which drops an unsupported code
 * from the payload so DeepL auto-detects. Keeping the list in one place avoids
 * two allowlists drifting apart, and the server cannot trust this one anyway.
 */
export const resolveSourceLanguage = ( lang: string ): string => {
	const primarySubtag = ( lang ?? '' ).trim().split( /[-_]/ )[ 0 ] ?? '';

	if ( ! /^[a-z]{2}$/i.test( primarySubtag ) ) {
		return '';
	}

	return primarySubtag.toUpperCase();
};
