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
 * Adds a button to the toolbar that toggles the contrast.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the contrast button.
 */
export const addContrastButton = (toolbar: HTMLElement, options: DefaultOptionsType): void => {
	const CONTRAST_BODY_CLASS = 'a11y-toolbar--contrast';
	let contrastIcon: string;
	let contrastTextAfter: string;
	let contrastIncreaseLabel: string;
	let contrastDecreaseLabel: string;

	const init = (): void => {
		if (!options || !options.showContrastButton) return;

		contrastIcon = options.contrastButton?.icon || '';
		contrastTextAfter = options.contrastButton?.textAfter || '';
		contrastIncreaseLabel = options.contrastButton?.increaseLabel || '';
		contrastDecreaseLabel = options.contrastButton?.decreaseLabel || '';

		const contrastButton = createButton(
			'contrast',
			contrastIncreaseLabel,
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
		toggleButtonAttributes(button, hasContrast);
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

			toggleButtonAttributes(button, contrastCookieValue);

			document.body.classList.toggle(CONTRAST_BODY_CLASS);
		});
	};

	/**
	 * Checks if a contrast cookie ahs been set.
	 */
	const hasContrastCookie = (): boolean => {
		return Cookies.get(COOKIES.CONTRAST) === 'true';
	};

	/**
	 * Toggle button attributes based on the state
	 *
	 * @param {HTMLElement} button - The contrast size button element.
	 * @param {boolean} state - The state of the button element.
	 */
	const toggleButtonAttributes = (button: HTMLElement, state: boolean): void => {
		button.setAttribute('aria-pressed', state.toString());
		button.setAttribute('aria-label', state ? contrastDecreaseLabel : contrastIncreaseLabel);
		button.setAttribute('title', state ? contrastDecreaseLabel : contrastIncreaseLabel);
	};

	init();
};
