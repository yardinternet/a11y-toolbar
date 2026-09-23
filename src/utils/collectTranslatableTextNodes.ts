export interface TextNodeData {
	node: Text;
	originalText: string;
}

export const CONTENT_SELECTOR =
	'div, p, span, h1, h2, h3, h4, h5, h6, li, button, blockquote, a, label, legend, option, caption, dt, dd, details, summary, strong, em, figcaption, code, pre, th, td, textarea, time, input[type="button"], input[type="submit"], input[type="reset"]';

/**
 * Captures the text nodes that can be translated, grouped by their normalized
 * text content.
 *
 * Example map entry:
 * {
 *   "Hello World": [
 *     { node: TextNode1, originalText: "Hello World" },
 *     { node: TextNode2, originalText: "Hello World" }
 *   ]
 * }
 *
 * Matches any Unicode letter, so accented and non-Latin scripts count too.
 */
const HAS_LETTER = /\p{L}/u;

export const collectTranslatableTextNodes = (
	root: Document | HTMLElement
): Map< string, TextNodeData[] > => {
	const textNodes: Map< string, TextNodeData[] > = new Map();

	root.querySelectorAll( CONTENT_SELECTOR ).forEach( ( el ) => {
		if ( ! ( el instanceof HTMLElement ) ) return;

		Array.from( el.childNodes ).forEach( ( child ) => {
			if ( child.nodeType !== Node.TEXT_NODE ) return;

			const node = child as Text;
			const normalizedText = ( node.textContent ?? '' )
				.trim()
				.replace( /\s\s+/g, ' ' );

			if ( ! normalizedText || ! HAS_LETTER.test( normalizedText ) ) {
				return;
			}

			const data: TextNodeData = {
				node,
				originalText: node.textContent ?? '',
			};
			const existing = textNodes.get( normalizedText );

			if ( existing ) {
				existing.push( data );
			} else {
				textNodes.set( normalizedText, [ data ] );
			}
		} );
	} );

	return textNodes;
};
