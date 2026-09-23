/**
 * Internal dependencies
 */
import { addDeepLButton } from '../src/components/DeepLButton';

const OPTIONS = { showDeepLButton: true } as never;

/**
 * Awaits microtask ticks until `condition` holds, or gives up after
 * `maxTicks`. Used instead of a hardcoded tick count so the test doesn't
 * pass "by accident" if the number of microtasks needed to settle a promise
 * chain changes.
 */
const flushUntil = async (
	condition: () => boolean,
	maxTicks = 20
): Promise< void > => {
	for ( let i = 0; i < maxTicks && ! condition(); i++ ) {
		await Promise.resolve();
	}
};

describe( 'DeepLButton request body', () => {
	let bodies: Array< Record< string, unknown > >;

	beforeEach( () => {
		bodies = [];
		document.documentElement.lang = 'nl-NL';
		document.body.innerHTML = '<div id="bar"></div><p>Hallo wereld</p>';
		window.sessionStorage.clear();

		( window as never as { ydpl: unknown } ).ydpl = {
			ydpl_rest_translate_url: 'https://example.test/translate',
			ydpl_api_request_nonce: 'nonce',
			ydpl_translate_post_id: '381',
			ydpl_supported_languages: [
				{ iso_alpha2: 'EN-US', name: 'Engels' },
				{ iso_alpha2: 'NL', name: 'Nederlands' },
			],
		};

		global.fetch = jest.fn( ( _url: string, init: { body: string } ) => {
			bodies.push( JSON.parse( init.body ) );
			return Promise.resolve( {
				ok: true,
				json: () => Promise.resolve( [] ),
			} );
		} ) as never;
	} );

	it( 'sends the document language as a bare source_lang', async () => {
		addDeepLButton( document.getElementById( 'bar' )!, OPTIONS );

		const select = document.querySelector(
			'.a11y-toolbar__translate-select'
		) as HTMLSelectElement;
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( bodies[ 0 ].source_lang ).toBe( 'NL' );
	} );

	it( 'still reports the original language after an earlier translation changed <html lang>', async () => {
		addDeepLButton( document.getElementById( 'bar' )!, OPTIONS );

		const select = document.querySelector(
			'.a11y-toolbar__translate-select'
		) as HTMLSelectElement;

		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );

		// Wait for the first translation to actually settle and mutate
		// <html lang>, rather than trusting a fixed number of ticks. If this
		// precondition never holds, the test fails here instead of passing
		// for the wrong reason.
		await flushUntil( () => document.documentElement.lang === 'EN-US' );
		expect( document.documentElement.lang ).toBe( 'EN-US' );

		// updateLangAttribute() has now overwritten <html lang> with EN-US.
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( bodies[ bodies.length - 1 ].source_lang ).toBe( 'NL' );
	} );

	it( 'omits source_lang when the document language is unusable', async () => {
		document.documentElement.lang = '';
		addDeepLButton( document.getElementById( 'bar' )!, OPTIONS );

		const select = document.querySelector(
			'.a11y-toolbar__translate-select'
		) as HTMLSelectElement;
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( 'source_lang' in bodies[ 0 ] ).toBe( false );
	} );
} );
