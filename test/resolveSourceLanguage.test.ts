/**
 * Internal dependencies
 */
import { resolveSourceLanguage } from '../src/utils/resolveSourceLanguage';

describe( 'resolveSourceLanguage', () => {
	it( 'strips the region from a BCP-47 tag', () => {
		expect( resolveSourceLanguage( 'nl-NL' ) ).toBe( 'NL' );
	} );

	it( 'accepts an underscore-separated locale', () => {
		expect( resolveSourceLanguage( 'en_US' ) ).toBe( 'EN' );
	} );

	it( 'uppercases a bare language tag', () => {
		expect( resolveSourceLanguage( 'de' ) ).toBe( 'DE' );
	} );

	it( 'ignores surrounding whitespace', () => {
		expect( resolveSourceLanguage( '  fr-BE  ' ) ).toBe( 'FR' );
	} );

	it( 'returns empty for a three-letter code DeepL cannot take', () => {
		expect( resolveSourceLanguage( 'nld' ) ).toBe( '' );
	} );

	it( 'passes a well-formed but DeepL-unsupported code through unchanged', () => {
		// Deliberate: this helper checks shape, not membership of DeepL's
		// source-language set. The server drops a code DeepL does not accept,
		// so DeepL auto-detects instead of answering HTTP 400. A second
		// allowlist here would only give the two sides something to drift
		// apart on, and the server cannot trust this one anyway.
		expect( resolveSourceLanguage( 'fy' ) ).toBe( 'FY' );
		expect( resolveSourceLanguage( 'lb-LU' ) ).toBe( 'LB' );
		expect( resolveSourceLanguage( 'is' ) ).toBe( 'IS' );
	} );

	it( 'returns empty for a missing or malformed tag', () => {
		expect( resolveSourceLanguage( '' ) ).toBe( '' );
		expect( resolveSourceLanguage( '-' ) ).toBe( '' );
		expect( resolveSourceLanguage( '123' ) ).toBe( '' );
	} );
} );
