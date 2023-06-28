/**
 * Internal dependencies
 */
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';

/**
 * Adds a button to the toolbar that toggles the language options dropdown.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the language button.
 */
export const addLanguageButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	if (!options || !options.showLanguageButton) return;

	const languageIcon = options.iconOptions?.languageIcon || '';
	const languageButton = createButton(
		'js-a11y-toolbar-language-button',
		'Toon vertaalopties',
		languageIcon
	);
	toolbar.appendChild(languageButton);

	languageButton.addEventListener('click', () => {
		console.log('language button clicked');
	});
};
