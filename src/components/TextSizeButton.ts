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

const TEXT_SIZE_BUTTON_LABEL_INCREASE = 'Vergroot schermtekst';
const TEXT_SIZE_BUTTON_LABEL_DECREASE = 'Verklein schermtekst';
const TEXT_SIZE_BODY_CLASS = 'a11y-toolbar-text-size';

/**
 * Adds a button to the toolbar that toggles the text size.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the text size button.
 */
export const addTextSizeButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	if (!options || !options.showTextSizeButton) return;

	const textSizeIcon = options.iconOptions?.textSizeIcon || '';
	const textSizeButton = createButton(
		'js-a11y-toolbar-text-size-toggler',
		TEXT_SIZE_BUTTON_LABEL_INCREASE,
		textSizeIcon
	);

	toolbar.appendChild(textSizeButton);

	initTextSizeBodyClass();
	initPressedStateButton(textSizeButton);
	addTextSizeButtonEventListener(textSizeButton);
};

/**
 * Initialize the body class based on the cookie. Checks first if the class is already set server side.
 */
const initTextSizeBodyClass = (): void => {
	const hasTextSize = hasTextSizeCookie();

	if (hasTextSize && !document.body.classList.contains(TEXT_SIZE_BODY_CLASS)) {
		document.body.classList.toggle(TEXT_SIZE_BODY_CLASS);
	}
};

/**
 * Initializes the pressed state of the text size button based on the text size cookie.
 *
 * @param {HTMLElement} button - The text size button element.
 */
const initPressedStateButton = (button: HTMLElement): void => {
	const hasTextSize = hasTextSizeCookie();

	button.setAttribute('aria-pressed', hasTextSize.toString());
	button.setAttribute(
		'aria-label',
		hasTextSize ? 'Verminder schermtekst' : TEXT_SIZE_BUTTON_LABEL_INCREASE
	);
};

/**
 * Adds event listener to the text size button to toggle the text size.
 *
 * @param {HTMLElement} button - The text size button element.
 */
const addTextSizeButtonEventListener = (button: HTMLElement): void => {
	button.addEventListener('click', () => {
		const newTextSizeCookie = !hasTextSizeCookie();
		Cookies.set(COOKIES.TEXT_SIZE, newTextSizeCookie.toString(), {
			expires: 90,
		});

		button.setAttribute('aria-pressed', newTextSizeCookie.toString());
		button.setAttribute(
			'aria-label',
			newTextSizeCookie ? TEXT_SIZE_BUTTON_LABEL_DECREASE : TEXT_SIZE_BUTTON_LABEL_INCREASE
		);

		document.body.classList.toggle(TEXT_SIZE_BODY_CLASS);
	});
};

/**
 * Checks if a text size cookie has been set.
 */
const hasTextSizeCookie = (): boolean => {
	return Cookies.get(COOKIES.TEXT_SIZE) === 'true';
};
