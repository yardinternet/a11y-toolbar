/**
 * External dependencies
 */
import * as focusTrap from 'focus-trap';

/**
 * Internal dependencies
 */
import { createButton } from '../utils/createButton';
import type { DefaultOptionsType } from '../types/default-options-type';
import { checkCanFocusTrap } from '../utils/checkCanFocusTrap';
import { isScriptLoaded } from '../utils/isScriptLoaded';

/**
 * Adds a button to the toolbar that toggles the language options dropdown.
 *
 * @param {HTMLElement}        toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the language button.
 */
export const addLanguageButton = (
	toolbar: HTMLElement,
	options?: DefaultOptionsType
): void => {
	const LANGUAGE_BODY_CLASS = 'a11y-toolbar--translate-is-open';
	const LABEL_CLASS = 'a11y-toolbar__translate-label';
	const trapFocusOptions = {
		allowOutsideClick: true,
		clickOutsideDeactivates: true,
		checkCanFocusTrap,
		onActivate: () => {
			document.body.classList.add( LANGUAGE_BODY_CLASS );
		},
		onDeactivate: () => {
			document.body.classList.remove( LANGUAGE_BODY_CLASS );
		},
	};
	let trapFocus: { deactivate: () => void, activate: () => void }; // Couldn't get the type from the focus-trap package.

	let languageIcon: string;
	let languageTextAfter: string;
	let languageLabel: string;
	let includedLanguages: string;

	const init = (): void => {
		if ( ! options || ! options.showLanguageButton ) return;

		languageIcon = options.iconOptions?.languageIcon || '';
		languageTextAfter = options.textAfterOptions?.languageTextAfter || '';
		languageLabel = options.labelOptions?.languageLabel || '';
		includedLanguages = options.translateIncludedLanguages || '';

		addGoogleTranslateScriptToHead( includedLanguages );

		const languageButton = createButton(
			'language-button',
			languageLabel,
			languageIcon,
			languageTextAfter
		);

		toolbar.appendChild( languageButton );

		const modal = createLanguageModalContent();

		toolbar.appendChild( modal );

		languageButton.addEventListener( 'click', () => handleButtonClick() );
	};

	/**
	 * Adds the Google Translate scripts to the head of the document.
	 *
	 * @param {string} inclLanguages - The languages to included in the translate widget.
	 */
	const addGoogleTranslateScriptToHead = ( inclLanguages: string ): void => {
		const translateScriptSrc =
			'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

		if ( isScriptLoaded( translateScriptSrc ) ) {
			return;
		}

		const translateScript = document.createElement( 'script' );
		translateScript.type = 'text/javascript';
		translateScript.src = translateScriptSrc;

		const translateElementScript = document.createElement( 'script' );
		translateElementScript.type = 'text/javascript';
		translateElementScript.innerHTML = `
			function googleTranslateElementInit() {
				new google.translate.TranslateElement({
					pageLanguage: 'nl',
					includedLanguages: '${ inclLanguages }',
				}, 'google_translate_element');
			}
		`;

		document.head.appendChild( translateScript );
		document.head.appendChild( translateElementScript );
	};

	/**
	 * Handles the click event on the language button.
	 */
	const handleButtonClick = (): void => {
		transformTranslateElement();

		if ( ! document.body.classList.contains( LANGUAGE_BODY_CLASS ) ) {
			openLanguageModal();
		} else {
			closeLanguageModal();
		}
	};

	const closeLanguageModal = (): void => {
		if ( ! document.body.classList.contains( LANGUAGE_BODY_CLASS ) ) return;
		trapFocus.deactivate();
	};

	const openLanguageModal = (): void => {
		trapFocus = focusTrap.createFocusTrap(
			'.a11y-toolbar__translate-dropdown',
			trapFocusOptions
		);
		trapFocus.activate();
	};

	/**
	 * Creates the content for the language modal.
	 */
	const createLanguageModalContent = (): HTMLElement => {
		const modalContent = document.createElement( 'div' );
		modalContent.classList.add( 'a11y-toolbar__translate-dropdown' );
		modalContent.setAttribute( 'lang', 'en' );

		const title = document.createElement( 'h3' );
		title.textContent = 'Translate';

		const closeButton = document.createElement( 'button' );
		closeButton.classList.add( 'a11y-toolbar__translate-close-button' );
		closeButton.setAttribute( 'aria-label', 'Close translate modal' );
		closeButton.addEventListener( 'click', () => closeLanguageModal() );

		const closeIcon = document.createElement( 'i' );
		closeIcon.classList.add( 'fal', 'fa-times' );

		closeButton.appendChild( closeIcon );
		modalContent.appendChild( title );
		modalContent.appendChild( closeButton );

		const description = document.createElement( 'p' );
		description.classList.add( 'a11y-toolbar__translate-description' );
		description.textContent =
			'Use Google to translate this website. We take no responsibility for the accuracy of the translation.';
		modalContent.appendChild( description );

		const translationContainer = document.createElement( 'div' );
		translationContainer.id = 'google_translate_element';
		translationContainer.setAttribute( 'lang', 'nl' );
		modalContent.appendChild( translationContainer );

		const errorText = document.createElement( 'div' );
		errorText.classList.add( 'a11y-toolbar__translate-error' );
		errorText.textContent =
			'Unable to load Google Translate. Accept cookies and refresh the page, or try again later.';
		modalContent.appendChild( errorText );

		return modalContent;
	};

	/**
	 * A11y improvements to the Google Translate widget:
	 * - Add a label to the select element.
	 * - Remove the aria label to prevent double screen reader announcement.
	 */
	const transformTranslateElement = (): void => {
		const googleSelectElement = document.querySelector(
			'.goog-te-combo'
		) as HTMLElement;
		const labelExists = document.querySelector(
			`.${ LABEL_CLASS }`
		) as HTMLElement;

		if ( ! googleSelectElement || labelExists ) return;

		googleSelectElement.setAttribute( 'id', 'google-translate-select' );
		googleSelectElement.removeAttribute( 'aria-label' );

		const label = document.createElement( 'label' );
		label.classList.add( LABEL_CLASS );
		label.htmlFor = 'google-translate-select';
		label.textContent = 'Selecteer een taal:';

		const wrapper = document.querySelector(
			'#google_translate_element'
		) as HTMLElement;
		wrapper?.parentElement?.insertBefore( label, wrapper );
	};

	init();
};
