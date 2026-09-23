/**
 * Internal dependencies
 */
import { collectTranslatableTextNodes } from '../src/utils/collectTranslatableTextNodes';

const render = ( html: string ): void => {
	document.body.innerHTML = html;
};

describe( 'collectTranslatableTextNodes', () => {
	it( 'captures a two-character radio label such as "Ja"', () => {
		render(
			'<div><input type="radio" id="r1"><label for="r1">Ja</label></div>'
		);

		expect( [ ...collectTranslatableTextNodes( document ).keys() ] ).toEqual(
			[ 'Ja' ]
		);
	} );

	it( 'captures the legend that labels a radio group', () => {
		render(
			'<fieldset><legend>Wilt u een reactie?</legend></fieldset>'
		);

		expect( collectTranslatableTextNodes( document ).has( 'Wilt u een reactie?' ) ).toBe( true );
	} );

	it( 'captures the options of a select', () => {
		render(
			'<select><option>Kies een optie</option><option>Aanvraag paspoort</option></select>'
		);

		expect( [ ...collectTranslatableTextNodes( document ).keys() ] ).toEqual(
			[ 'Kies een optie', 'Aanvraag paspoort' ]
		);
	} );

	it( 'captures a table caption and description list terms', () => {
		render(
			'<table><caption>Overzicht aanvragen</caption></table><dl><dt>Zaaknummer</dt><dd>Z-2024-001</dd></dl>'
		);

		const keys = [ ...collectTranslatableTextNodes( document ).keys() ];

		expect( keys ).toEqual(
			expect.arrayContaining( [ 'Overzicht aanvragen', 'Zaaknummer' ] )
		);
	} );

	it( 'groups every node that shares the same normalized text', () => {
		render(
			'<div><input type="radio" id="r1"><label for="r1">Nee</label></div><p>Nee</p>'
		);

		expect( collectTranslatableTextNodes( document ).get( 'Nee' ) ).toHaveLength( 2 );
	} );

	it( 'keeps the untrimmed original so it can be restored verbatim', () => {
		render( '<p>  Hallo wereld  </p>' );

		expect(
			collectTranslatableTextNodes( document ).get( 'Hallo wereld' )?.[ 0 ]
				.originalText
		).toBe( '  Hallo wereld  ' );
	} );

	it( 'ignores text that contains no letters, such as zoom and pager controls', () => {
		render(
			'<button>+</button><button>\u2212</button><li><a>4</a></li><p>2024</p>'
		);

		expect( [ ...collectTranslatableTextNodes( document ).keys() ] ).toEqual(
			[]
		);
	} );

	it( 'still captures short text that does contain letters', () => {
		render( '<label>Ja</label><table><tr><td>A4</td></tr></table>' );

		expect( [ ...collectTranslatableTextNodes( document ).keys() ] ).toEqual(
			[ 'Ja', 'A4' ]
		);
	} );

	it( 'ignores whitespace-only text nodes', () => {
		render( '<div>\n\t<span>Tekst</span>\n</div>' );

		expect( [ ...collectTranslatableTextNodes( document ).keys() ] ).toEqual(
			[ 'Tekst' ]
		);
	} );
} );
