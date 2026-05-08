/**
 * Internal dependencies
 */
import { DefaultOptionsType } from '../types/default-options-type';
import { createFontAwesomeIcon, createTextAfter } from '../utils/createButton';

/**
 * Adds a button to the toolbar for the Tolkie Translate feature.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the Tolkie Translate button.
 *
 * Note: The Tolkie script must be included on the page for this button to work.
 * Note: The tolkieTranslateIcon option can be set to 'flag' to use the default flag icon, or it can be set to a FontAwesome icon class.
 *
 * @see https://help.tolkie.nl/nl/articles/12352886-hoe-voeg-ik-een-tolkie-vertaalknop-toe-aan-mijn-website
 */
export const addTolkieTranslateButton = (
	toolbar: HTMLElement,
	options?: DefaultOptionsType
): void => {
	let tolkieTranslateIcon: string;
	let tolkieTranslateTextAfter: string;

	const init = (): void => {
		if (!options || !options.showTolkieTranslateButton) return;
		tolkieTranslateIcon = options.iconOptions?.tolkieTranslateIcon || 'flag';
		tolkieTranslateTextAfter = options.textAfterOptions?.tolkieTranslateTextAfter || 'Vertalen';

		const tolkieTranslateButton = createTolkieTranslateButton();

		toolbar.appendChild(tolkieTranslateButton);
	};

	const createTolkieTranslateButton = (): HTMLButtonElement => {
		const button = document.createElement('button');
		button.classList.add(
			'tolkie-translate-button',
			'a11y-toolbar__button',
			'a11y-toolbar__button--tolkie-translate'
		);
		button.setAttribute('type', 'button');
		button.setAttribute('aria-label', tolkieTranslateTextAfter);
		button.setAttribute('title', tolkieTranslateTextAfter);

		if (tolkieTranslateIcon === 'flag') {
			const icon = document.createElement('div');
			icon.classList.add('tolkie-translate-button-flag');
			button.appendChild(icon);
		} else {
			const icon = createFontAwesomeIcon(tolkieTranslateIcon);
			button.appendChild(icon);
		}

		if (tolkieTranslateTextAfter) {
			const text = createTextAfter(tolkieTranslateTextAfter);
			text.classList.add('tolkie-translate-button-text');
			button.appendChild(text);
		}

		return button;
	};

	init();
};
