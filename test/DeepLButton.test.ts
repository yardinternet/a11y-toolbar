import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addDeepLButton } from '../src/components/DeepLButton';

type Translation = { text: string; translation: string };

const deferred = () => {
	let resolve!: ( response: Response ) => void;
	const promise = new Promise< Response >( ( r ) => ( resolve = r ) );
	return { promise, resolve };
};

const jsonResponse = ( body: Translation[] ) =>
	new Response( JSON.stringify( body ), { status: 200 } );

const flush = () => new Promise( ( r ) => setTimeout( r, 0 ) );

const text = ( selector: string ) =>
	document.querySelector( selector )?.textContent;

const select = () =>
	document.querySelector< HTMLSelectElement >(
		'#a11y-toolbar__translate-select'
	)!;

const selectLanguage = ( language: string ) => {
	select().value = language;
	select().dispatchEvent( new Event( 'change' ) );
};

describe( 'addDeepLButton', () => {
	let fetchMock: ReturnType< typeof vi.fn >;

	beforeEach( () => {
		document.body.innerHTML =
			'<div id="toolbar"></div><h2 id="title">Nieuwsbericht</h2><p id="intro">Welkom op de site</p>';
		document.documentElement.lang = 'NL';
		window.sessionStorage.clear();
		window.ydpl = {
			ydpl_rest_translate_url: '/translate',
			ydpl_api_request_nonce: 'nonce',
			ydpl_translate_post_id: '1',
			ydpl_supported_languages: [
				{ iso_alpha2: 'NL', name: 'Nederlands' },
				{ iso_alpha2: 'TR', name: 'Turks' },
				{ iso_alpha2: 'UK', name: 'Oekraïens' },
			],
		};
		fetchMock = vi.fn();
		vi.stubGlobal( 'fetch', fetchMock );
		vi.spyOn( console, 'error' ).mockImplementation( () => {} );

		addDeepLButton( document.getElementById( 'toolbar' )!, {
			showDeepLButton: true,
		} );
	} );

	afterEach( () => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	} );

	it( 'falls back to the original text for nodes missing from the new translation', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse( [
				{ text: 'Nieuwsbericht', translation: 'Haber' },
				{
					text: 'Welkom op de site',
					translation: 'Siteye hoş geldiniz',
				},
			] )
		);
		selectLanguage( 'TR' );
		await vi.waitFor( () =>
			expect( text( '#intro' ) ).toBe( 'Siteye hoş geldiniz' )
		);

		fetchMock.mockResolvedValueOnce(
			jsonResponse( [ { text: 'Nieuwsbericht', translation: 'Новина' } ] )
		);
		selectLanguage( 'UK' );
		await vi.waitFor( () => expect( text( '#title' ) ).toBe( 'Новина' ) );

		expect( text( '#intro' ) ).toBe( 'Welkom op de site' );
		expect( document.documentElement.lang ).toBe( 'UK' );
	} );

	it( 'reverts to the original language when the request fails', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse( [ { text: 'Nieuwsbericht', translation: 'Haber' } ] )
		);
		selectLanguage( 'TR' );
		await vi.waitFor( () => expect( text( '#title' ) ).toBe( 'Haber' ) );

		fetchMock.mockResolvedValueOnce( new Response( '', { status: 429 } ) );
		selectLanguage( 'UK' );
		await vi.waitFor( () =>
			expect(
				document.querySelector( '.a11y-toolbar__translate-error' )
			).not.toBeNull()
		);

		expect( text( '#title' ) ).toBe( 'Nieuwsbericht' );
		expect( document.documentElement.lang ).toBe( 'NL' );
		expect( window.sessionStorage.getItem( 'DeepLSelectedLanguage' ) ).toBe(
			'NL'
		);
		expect( select().value ).toBe( 'NL' );
	} );

	it( 'only applies the response of the last selected language', async () => {
		const slowTurkish = deferred();
		fetchMock.mockReturnValueOnce( slowTurkish.promise );
		fetchMock.mockResolvedValueOnce(
			jsonResponse( [ { text: 'Nieuwsbericht', translation: 'Новина' } ] )
		);

		selectLanguage( 'TR' );
		selectLanguage( 'UK' );
		await vi.waitFor( () => expect( text( '#title' ) ).toBe( 'Новина' ) );

		slowTurkish.resolve(
			jsonResponse( [ { text: 'Nieuwsbericht', translation: 'Haber' } ] )
		);
		await flush();

		expect( text( '#title' ) ).toBe( 'Новина' );
		expect( document.documentElement.lang ).toBe( 'UK' );
	} );

	it( 'ignores a pending translation after switching back to Dutch', async () => {
		const slowTurkish = deferred();
		fetchMock.mockReturnValueOnce( slowTurkish.promise );

		selectLanguage( 'TR' );
		selectLanguage( 'NL' );
		slowTurkish.resolve(
			jsonResponse( [ { text: 'Nieuwsbericht', translation: 'Haber' } ] )
		);
		await flush();

		expect( text( '#title' ) ).toBe( 'Nieuwsbericht' );
		expect( document.documentElement.lang ).toBe( 'NL' );
	} );
} );
