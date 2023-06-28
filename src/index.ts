/**
 * Internal dependencies
 */
import { DEFAULTS } from './constants/defaults';

import { DefaultOptionsType } from './types/default-options-type';

import { addTextSizeButton } from './components/TextSizeButton';
import { addContrastButton } from './components/ContrastButton';
import { addPrintButton } from './components/PrintButton';
import { addLanguageButton } from './components/LanguageButton';
import { createButton } from './utils/createButton';

import './styles.scss';

declare global {
	interface Window {
		rsConf: Object;
	}
}

export default class A11yToolbar {
	private readonly options: DefaultOptionsType;
	private readonly selector: string;

	constructor(selector: string, options?: {}) {
		this.selector = selector;
		this.options = { ...DEFAULTS, ...options };
	}

	/**
	 * Initializes the A11yToolbar.
	 */
	init(): this {
		const toolbar = this.createToolbar();

		this.addButtonWithReadSpeaker(toolbar);
		addTextSizeButton(toolbar, this.options);
		addContrastButton(toolbar, this.options);
		addPrintButton(toolbar, this.options);
		addLanguageButton(toolbar, this.options);

		const container = document.querySelector(this.selector);
		container?.appendChild(toolbar);

		/**
		 * Used to make sure that no dynamic content disappears after clicking on
		 * the readspeaker button, such as the gemeente-search-block.
		 */
		if (window.rsConf) {
			window.rsConf = { general: { usePost: true } };
		}

		return this;
	}

	/**
	 * Creates a new toolbar element with the necessary classes and ID.
	 */
	private createToolbar(): HTMLElement {
		const toolbar = document.createElement('div');
		toolbar.id = 'js-a11y-toolbar';
		toolbar.classList.add('a11y-toolbar');
		return toolbar;
	}

	/**
	 * Adds a button to the toolbar that toggles the read speaker.
	 *
	 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
	 */
	private addButtonWithReadSpeaker(toolbar: HTMLElement): void {
		if (!this.options.showReadSpeakerButton) return;

		const readSpeakerIcon = this.options.iconOptions?.readSpeakerIcon || '';
		const readSpeakerButton = createButton(
			'js-a11y-toolbar-read-speaker',
			'Read speaker',
			readSpeakerIcon
		);
		toolbar.appendChild(readSpeakerButton);

		// Todo: change above code to <a> of ReadSpeaker
	}
}
