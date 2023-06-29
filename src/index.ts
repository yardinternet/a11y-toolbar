/**
 * Internal dependencies
 */
import { addContrastButton } from './components/ContrastButton';
import { addLanguageButton } from './components/LanguageButton';
import { addPrintButton } from './components/PrintButton';
import { addReadSpeakerButton } from './components/ReadSpeakerButton';
import { addTextSizeButton } from './components/TextSizeButton';

import { DEFAULTS } from './constants/default-options';
import { DefaultOptionsType } from './types/default-options-type';

import './styles.scss';

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

		addReadSpeakerButton(toolbar, this.options);
		addTextSizeButton(toolbar, this.options);
		addContrastButton(toolbar, this.options);
		addPrintButton(toolbar, this.options);
		addLanguageButton(toolbar, this.options);

		const container = document.querySelector(this.selector);
		container?.appendChild(toolbar);

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
}
