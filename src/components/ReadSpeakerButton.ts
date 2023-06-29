/**
 * Internal dependencies
 */
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';

declare global {
	interface Window {
		rsConf: Object;
	}
}

/**
 * Adds a button to the toolbar that activates ReadSpeaker
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the ReadSpeaker button.
 */
export const addReadSpeakerButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	if (!options || !options.showReadSpeakerButton) return;

	/**
	 * Used to make sure that no dynamic content disappears after clicking on
	 * the ReadSpeaker button, such as the gemeente-search-block.
	 */
	if (window.rsConf) {
		window.rsConf = { general: { usePost: true } };
	}

	const readSpeakerIcon = options.iconOptions?.readSpeakerIcon || '';
	const readSpeakerTextAfter = options.textAfterOptions?.readSpeakerTextAfter || '';
	const readSpeakerButton = createButton(
		'read-speaker',
		'Lees voor',
		readSpeakerIcon,
		readSpeakerTextAfter
	);
	toolbar.appendChild(readSpeakerButton);

	readSpeakerButton.addEventListener('click', () => {
		console.log('readspeaker');
	});
};
