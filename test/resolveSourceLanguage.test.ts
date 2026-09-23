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

	it( 'returns empty for a missing or malformed tag', () => {
		expect( resolveSourceLanguage( '' ) ).toBe( '' );
		expect( resolveSourceLanguage( '-' ) ).toBe( '' );
		expect( resolveSourceLanguage( '123' ) ).toBe( '' );
	} );
} );
