/**
 * Internal dependencies
 */
import { DefaultOptionsType } from '../types/default-options-type';
import { createIcon, createTextAfter } from '../utils/createButton';

declare global {
	interface Window {
		rsConf: Object;
	}
}

/**
 * Adds a button to the toolbar that activates ReadSpeaker. ReadSpeaker is a mess to work with.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the ReadSpeaker button.
 */
export const addReadSpeakerButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	let readSpeakerCustomerID: string;
	let readSpeakerContentID: string;
	let readSpeakerDisable: string;
	let readSpeakerIcon: string;
	let readSpeakerTextAfter: string;
	let readSpeakerLabel: string;

	const init = (): void => {
		if (
			!options ||
			!options.showReadSpeakerButton ||
			!options.readSpeakerCustomerID ||
			!options.readSpeakerContentID
		)
			return;

		/**
		 * Used to make sure that no dynamic content disappears after clicking on
		 * the ReadSpeaker button, such as the gemeente-search-block.
		 */
		if (window.rsConf) {
			window.rsConf = {
				general: { usePost: true },
			};
		}

		readSpeakerCustomerID = options.readSpeakerCustomerID || '';
		readSpeakerContentID = options.readSpeakerContentID || '';
		readSpeakerDisable = options.readSpeakerDisable || '';
		readSpeakerIcon = options.iconOptions?.readSpeakerIcon || '';
		readSpeakerTextAfter = options.textAfterOptions?.readSpeakerTextAfter || '';
		readSpeakerLabel = options.labelOptions?.readSpeakerLabel || '';

		addReadSpeakerScriptToHead(readSpeakerCustomerID, readSpeakerDisable);

		const readSpeakerLink = createReadSpeakerButton(
			readSpeakerCustomerID,
			readSpeakerContentID,
			readSpeakerIcon,
			readSpeakerTextAfter,
			readSpeakerLabel
		);

		toolbar.appendChild(readSpeakerLink);
	};

	/**
	 * Adds the ReadSpeaker script to the head of the document.
	 *
	 * @param {string} readSpeakerCustomerID - The ID of the ReadSpeaker instance.
	 */
	const addReadSpeakerScriptToHead = (
		readSpeakerCustomerID: string,
		readSpeakerDisable: string
	): void => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.crossOrigin = 'anonymous';
		script.id = 'rs_req_Init';
		script.src = `https://cdn-eu.readspeaker.com/script/${readSpeakerCustomerID}/webReader/webReader.js?pids=wr&&disable=${readSpeakerDisable}`;

		document.head.appendChild(script);
	};

	/**
	 * Creates a ReadSpeaker button element with the specified ReadSpeaker ID and content ID.
	 *
	 * @param {string} readSpeakerCustomerID - The ID of the ReadSpeaker instance.
	 * @param {string} readSpeakerContentID - The ID of the content to be read by ReadSpeaker.
	 * @param {string} icon - The icon for the button. Can be a CSS class or an SVG string.
	 * @param {string} textAfter - The text to be added after the icon.
	 * @param {string} label - The label for the button.
	 *
	 * @returns {HTMLElement} - The created ReadSpeaker button element.
	 */
	const createReadSpeakerButton = (
		readSpeakerCustomerID: string,
		readSpeakerContentID: string,
		icon: string,
		textAfter: string,
		label: string
	): HTMLElement => {
		const div = document.createElement('div');
		div.id = 'readspeaker_button1';
		div.classList.add('rs_skip', 'rsbtn', 'rs_preserve');

		const button = document.createElement('a');
		button.setAttribute('role', 'button');
		button.classList.add('rsbtn_play', 'a11y-toolbar__button', 'a11y-toolbar__button--readspeaker');
		button.setAttribute('accesskey', 'L');
		button.setAttribute('aria-label', label);
		button.setAttribute('title', label);
		button.href = `//app-eu.readspeaker.com/cgi-bin/rsent?customerid=${readSpeakerCustomerID}&lang=nl_nl&readid=${readSpeakerContentID}&url=${window.location.href}`;

		if (icon !== undefined && icon !== '') {
			const iconElement = createIcon(icon);
			button.appendChild(iconElement);
		}

		if (textAfter !== undefined && textAfter !== '') {
			const textAfterElement = createTextAfter(textAfter);
			button.appendChild(textAfterElement);
		}

		div.appendChild(button);

		return div;
	};

	init();
};
