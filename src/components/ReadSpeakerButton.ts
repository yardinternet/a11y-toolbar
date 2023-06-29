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
		window.rsConf = { general: { usePost: true } };
	}

	const readSpeakerCustomerID = options.readSpeakerCustomerID || '';
	const readSpeakerContentID = options.readSpeakerContentID || '';
	const readSpeakerIcon = options.iconOptions?.readSpeakerIcon || '';
	const readSpeakerTextAfter = options.textAfterOptions?.readSpeakerTextAfter || '';

	addReadSpeakerScriptToHead(readSpeakerCustomerID);

	const readSpeakerLink = createReadSpeakerButton(
		readSpeakerCustomerID,
		readSpeakerContentID,
		readSpeakerIcon,
		readSpeakerTextAfter
	);

	toolbar.appendChild(readSpeakerLink);
};

/**
 * Adds the ReadSpeaker script to the head of the document.
 *
 * @param {string} readSpeakerCustomerID - The ID of the ReadSpeaker instance.
 */
const addReadSpeakerScriptToHead = (readSpeakerCustomerID: string): void => {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.crossOrigin = 'anonymous';
	script.id = 'rs_req_Init';
	script.src = `https://cdn-eu.readspeaker.com/script/${readSpeakerCustomerID}/webReader/webReader.js?pids=wr&&disable=settings,clicklisten,voicesettings,readhover,enlarge,textmode,pagemask,download,help,dictionary'`;

	document.head.appendChild(script);
};

/**
 * Creates a ReadSpeaker button element with the specified ReadSpeaker ID and content ID.
 *
 * @param {string} readSpeakerCustomerID - The ID of the ReadSpeaker instance.
 * @param {string} readSpeakerContentID - The ID of the content to be read by ReadSpeaker.
 * @returns {HTMLElement} - The created ReadSpeaker button element.
 */
const createReadSpeakerButton = (
	readSpeakerCustomerID: string,
	readSpeakerContentID: string,
	icon: string,
	textAfter: string
): HTMLElement => {
	const div = document.createElement('div');
	div.id = 'readspeaker_button1';
	div.classList.add('rs_skip', 'rsbtn', 'rs_preserve');

	const button = document.createElement('a');
	button.setAttribute('role', 'button');
	button.classList.add('rsbtn_play', 'a11y-toolbar__button', 'a11y-toolbar__button--readspeaker');
	button.setAttribute('accesskey', 'L');
	button.setAttribute('aria-label', 'Laat de tekst voorlezen met ReadSpeaker webReader');
	button.setAttribute('title', 'Laat de tekst voorlezen met ReadSpeaker webReader');
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
