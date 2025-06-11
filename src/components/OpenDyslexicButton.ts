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
 * Adds a button to the toolbar that toggles the OpenDyslexic.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the OpenDyslexic button.
 */
export const addOpenDyslexicButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	const OPEN_DYSLEXIC_BODY_CLASS = 'a11y-toolbar--open-dyslexic';
	let openDyslexicIcon: string;
	let openDyslexicTextAfter: string;
	let openDyslexicActivateLabel: string;
	let openDyslexicDeactivateLabel: string;

	const init = (): void => {
		if (!options || !options.showOpenDyslexicButton) return;

		openDyslexicIcon = options.iconOptions?.openDyslexicIcon || '';
		openDyslexicTextAfter = options.textAfterOptions?.openDyslexicTextAfter || '';
		openDyslexicActivateLabel = options.labelOptions?.openDyslexicActivateLabel || '';
		openDyslexicDeactivateLabel = options.labelOptions?.openDyslexicDeactivateLabel || '';

		const openDyslexicButton = createButton(
			'openDyslexic',
			openDyslexicActivateLabel,
			openDyslexicIcon,
			openDyslexicTextAfter
		);

		toolbar.appendChild(openDyslexicButton);

		initOpenDyslexicBodyClass();
		initPressedStateButton(openDyslexicButton);
		addOpenDyslexicButtonEventListener(openDyslexicButton);

		const isActive = hasOpenDyslexicCookie();

		if (isActive) {
			injectFontStyles();
		}
	};

	/**
	 * Initialize the body class based on the cookie. Checks first if the class is already set server side.
	 */
	const initOpenDyslexicBodyClass = (): void => {
		const hasOpenDyslexic = hasOpenDyslexicCookie();

		if (hasOpenDyslexic && !document.body.classList.contains(OPEN_DYSLEXIC_BODY_CLASS)) {
			document.body.classList.add(OPEN_DYSLEXIC_BODY_CLASS);
		}
	};

	/**
	 * Initializes the pressed state of the OpenDyslexic button based on the OpenDyslexic cookie.
	 *
	 * @param {HTMLElement} button - The OpenDyslexic button element.
	 */
	const initPressedStateButton = (button: HTMLElement): void => {
		const isActive = hasOpenDyslexicCookie();
		toggleButtonAttributes(button, isActive);
	};

	/**
	 * Adds event listener to the OpenDyslexic button to toggle the OpenDyslexic.
	 *
	 * @param {HTMLElement} button - The OpenDyslexic button element.
	 */
	const addOpenDyslexicButtonEventListener = (button: HTMLElement): void => {
		button.addEventListener('click', () => {
			const openDyslexicCookieValue = !hasOpenDyslexicCookie();
			Cookies.set(COOKIES.OPEN_DYSLEXIC, openDyslexicCookieValue.toString(), {
				expires: 90,
			});

			toggleButtonAttributes(button, openDyslexicCookieValue);

			if (openDyslexicCookieValue) {
				injectFontStyles();
				document.body.classList.add(OPEN_DYSLEXIC_BODY_CLASS);
			} else {
				document.body.classList.remove(OPEN_DYSLEXIC_BODY_CLASS);
			}
		});
	};

	/**
	 * Injects Font Stylesheet and custom CSS to apply the OpenDyslexic font when active.
	 */
	const injectFontStyles = (): void => {
		const existing = document.getElementById('open-dyslexic-font');
		if (existing) return;

		const fontFace = document.createElement('style');

		fontFace.textContent = `
		@font-face {
			font-family: 'OpenDyslexic';
			src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@master/woff/OpenDyslexic-Regular.woff') format('woff2');
			font-weight: 300;
			font-style: normal;
		}
		@font-face {
			font-family: 'OpenDyslexic';
			src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@master/woff/OpenDyslexic-Regular.woff') format('woff2');
			font-weight: 400;
			font-style: normal;
		}
		@font-face {
			font-family: 'OpenDyslexic';
			src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@master/woff/OpenDyslexic-Bold.woff') format('woff2');
			font-weight: 500;
			font-style: normal;
		}
		@font-face {
			font-family: 'OpenDyslexic';
			src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@master/woff/OpenDyslexic-Bold.woff') format('woff2');
			font-weight: 600;
			font-style: normal;
		}
		@font-face {
			font-family: 'OpenDyslexic';
			src: url('https://cdn.jsdelivr.net/gh/antijingoist/open-dyslexic@master/woff/OpenDyslexic-Bold.woff') format('woff2');
			font-weight: 700;
			font-style: normal;
		}`;

		document.head.appendChild(fontFace);

		const styles = document.createElement('style');
		styles.id = 'open-dyslexic-font';
		styles.textContent = `
		body.${OPEN_DYSLEXIC_BODY_CLASS} {
			font-family: 'OpenDyslexic', sans-serif !important;
			font-size: 1rem;
		}
		body.${OPEN_DYSLEXIC_BODY_CLASS} *:not(i) {
			font-family: 'OpenDyslexic', sans-serif !important;
		}
	`;
		document.head.appendChild(styles);
	};

	/**
	 * Checks if a OpenDyslexic cookie has been set.
	 */
	const hasOpenDyslexicCookie = (): boolean => {
		return Cookies.get(COOKIES.OPEN_DYSLEXIC) === 'true';
	};

	/**
	 * Toggle button attributes based on the state
	 *
	 * @param {HTMLElement} button - The OpenDyslexic button element.
	 * @param {boolean} state - The state of the button element.
	 */
	const toggleButtonAttributes = (button: HTMLElement, state: boolean): void => {
		button.setAttribute('aria-pressed', state.toString());
		button.setAttribute(
			'aria-label',
			state ? openDyslexicDeactivateLabel : openDyslexicActivateLabel
		);
		button.setAttribute('title', state ? openDyslexicDeactivateLabel : openDyslexicActivateLabel);
	};

	init();
};
