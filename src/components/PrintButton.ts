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
	let printIcon: string;
	let printTextAfter: string;
	let printLabel: string;

	const init = (): void => {
		if (!options || !options.showPrintButton) return;

		printIcon = options.printButton?.icon || '';
		printTextAfter = options.printButton?.textAfter || '';
		printLabel = options.printButton?.label || '';

		const printButton = createButton('print', printLabel, printIcon, printTextAfter);
		toolbar.appendChild(printButton);

		printButton.addEventListener('click', () => {
			window.print();
		});
	};

	init();
};
