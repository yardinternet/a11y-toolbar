/**
 * External dependencies
 */
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import { COOKIES } from '../constants/cookies';
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';

/**
 * Adds a button to the toolbar that toggles the text size.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the text size button.
 */
export const addTextSizeButton = (
	toolbar: HTMLElement,
	options?: DefaultOptionsType
): void => {
	const TEXT_SIZE_BODY_CLASS = 'a11y-toolbar--text-size';
	let textSizeIcon: string;
	let textSizeTextAfter: string;
	let textSizeIncreaseLabel: string;
	let textSizeDecreaseLabel: string;

	const init = (): void => {
		if ( ! options || ! options.showTextSizeButton ) return;

		textSizeIcon = options.iconOptions?.textSizeIcon || '';
		textSizeTextAfter = options.textAfterOptions?.textSizeTextAfter || '';
		textSizeIncreaseLabel =
			options.labelOptions?.textSizeIncreaseLabel || '';
		textSizeDecreaseLabel =
			options.labelOptions?.textSizeDecreaseLabel || '';

		const textSizeButton = createButton(
			'text-size',
			textSizeIncreaseLabel,
			textSizeIcon,
			textSizeTextAfter
		);

		toolbar.appendChild( textSizeButton );

		initTextSizeBodyClass();
		initPressedStateButton( textSizeButton );
		addTextSizeButtonEventListener( textSizeButton );
	};

	/**
	 * Initialize the body class based on the cookie. Checks first if the class is already set server side.
	 */
	const initTextSizeBodyClass = (): void => {
		const hasTextSize = hasTextSizeCookie();

		if (
			hasTextSize &&
			! document.body.classList.contains( TEXT_SIZE_BODY_CLASS )
		) {
			document.body.classList.toggle( TEXT_SIZE_BODY_CLASS );
		}
	};

	/**
	 * Initializes the pressed state of the text size button based on the text size cookie.
	 *
	 * @param {HTMLElement} button - The text size button element.
	 */
	const initPressedStateButton = ( button: HTMLElement ): void => {
		const hasTextSize = hasTextSizeCookie();
		toggleButtonAttributes( button, hasTextSize );
	};

	/**
	 * Adds event listener to the text size button to toggle the text size.
	 *
	 * @param {HTMLElement} button - The text size button element.
	 */
	const addTextSizeButtonEventListener = ( button: HTMLElement ): void => {
		button.addEventListener( 'click', () => {
			const textSizeCookieValue = ! hasTextSizeCookie();
			Cookies.set( COOKIES.TEXT_SIZE, textSizeCookieValue.toString(), {
				expires: 90,
			} );

			toggleButtonAttributes( button, textSizeCookieValue );

			document.body.classList.toggle( TEXT_SIZE_BODY_CLASS );
		} );
	};

	/**
	 * Checks if a text size cookie has been set.
	 */
	const hasTextSizeCookie = (): boolean => {
		return Cookies.get( COOKIES.TEXT_SIZE ) === 'true';
	};

	/**
	 * Toggle button attributes based on the state
	 *
	 * @param {HTMLElement} button - The text size button element.
	 * @param {boolean} state - The state of the button element.
	 */
	const toggleButtonAttributes = (
		button: HTMLElement,
		state: boolean
	): void => {
		button.setAttribute( 'aria-pressed', state.toString() );
		button.setAttribute(
			'aria-label',
			state ? textSizeDecreaseLabel : textSizeIncreaseLabel
		);
		button.setAttribute(
			'title',
			state ? textSizeDecreaseLabel : textSizeIncreaseLabel
		);
	};

	init();
};
