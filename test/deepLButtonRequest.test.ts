/**
 * Internal dependencies
 */
import { addDeepLButton } from '../src/components/DeepLButton';

const OPTIONS = { showDeepLButton: true } as never;

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
		await Promise.resolve();
		await Promise.resolve();

		// updateLangAttribute() has now overwritten <html lang> with EN-US.
		select.value = 'EN-US';
		select.dispatchEvent( new Event( 'change' ) );
		await Promise.resolve();

		expect( document.documentElement.lang ).toBe( 'EN-US' );
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
