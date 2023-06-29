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

const CONTRAST_BUTTON_LABEL_INCREASE = 'Vergroot schermcontrast';
const CONTRAST_BUTTON_LABEL_DECREASE = 'Verklein schermcontrast';
const CONTRAST_BODY_CLASS = 'a11y-toolbar--contrast';

/**
 * Adds a button to the toolbar that toggles the contrast.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the contrast button.
 */
export const addContrastButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	if (!options || !options.showContrastButton) return;

	const contrastIcon = options.iconOptions?.contrastIcon || '';
	const contrastTextAfter = options.textAfterOptions?.contrastTextAfter || '';
	const contrastButton = createButton(
		'contrast',
		CONTRAST_BUTTON_LABEL_INCREASE,
		contrastIcon,
		contrastTextAfter
	);

	toolbar.appendChild(contrastButton);

	initContrastBodyClass();
	initPressedStateButton(contrastButton);
	addContrastButtonEventListener(contrastButton);
};

/**
 * Initialize the body class based on the cookie. Checks first if the class is already set server side.
 */
const initContrastBodyClass = (): void => {
	const hasContrast = hasContrastCookie();

	if (hasContrast && !document.body.classList.contains(CONTRAST_BODY_CLASS)) {
		document.body.classList.toggle(CONTRAST_BODY_CLASS);
	}
};

/**
 * Initializes the pressed state of the contrast button based on the contrast cookie.
 *
 * @param {HTMLElement} button - The contrast button element.
 */
const initPressedStateButton = (button: HTMLElement): void => {
	const hasContrast = hasContrastCookie();

	button.setAttribute('aria-pressed', hasContrast.toString());
	button.setAttribute(
		'aria-label',
		hasContrast ? CONTRAST_BUTTON_LABEL_DECREASE : CONTRAST_BUTTON_LABEL_INCREASE
	);
};

/**
 * Adds event listener to the contrast button to toggle the contrast.
 *
 * @param {HTMLElement} button - The contrast button element.
 */
const addContrastButtonEventListener = (button: HTMLElement): void => {
	button.addEventListener('click', () => {
		const contrastCookieValue = !hasContrastCookie();
		Cookies.set(COOKIES.CONTRAST, contrastCookieValue.toString(), {
			expires: 90,
		});

		button.setAttribute('aria-pressed', contrastCookieValue.toString());
		button.setAttribute(
			'aria-label',
			contrastCookieValue ? CONTRAST_BUTTON_LABEL_DECREASE : CONTRAST_BUTTON_LABEL_INCREASE
		);

		document.body.classList.toggle(CONTRAST_BODY_CLASS);
	});
};

/**
 * Checks if a contrast cookie ahs been set.
 */
const hasContrastCookie = (): boolean => {
	return Cookies.get(COOKIES.CONTRAST) === 'true';
};
