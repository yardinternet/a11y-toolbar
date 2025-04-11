/**
 * Internal dependencies
 */
import { DefaultOptionsType } from '../types/default-options-type';

/**
 * Adds a custom button to the toolbar
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the custom button.
 */
export const addCustomButton = (toolbar: HTMLElement, options: DefaultOptionsType): void => {
	const init = (): void => {
		if (!options) return;

		const customButton = typeof options.customButton === 'function' ? options.customButton() : null;

		if (!customButton) return;

		toolbar.appendChild(customButton);
	};

	init();
};
