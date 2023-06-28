/**
 * Internal dependencies
 */
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';

/**
 * Adds a button to the toolbar that activates the print screen.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the print button.
 */
export const addPrintButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	if (!options || !options.showPrintButton) return;

	const printIcon = options.iconOptions?.printIcon || '';
	const printButton = createButton('js-a11y-toolbar-print-button', 'Print pagina', printIcon);
	toolbar.appendChild(printButton);

	printButton.addEventListener('click', () => {
		window.print();
	});
};
