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
import { deepMerge } from './utils/deepMerge';

import './styles.scss';

const IS_OPEN_BODY_CLASS = 'a11y-toolbar--is-open';

export default class A11yToolbar {
	private readonly options: DefaultOptionsType;
	private readonly selector: string;

	constructor(selector: string, options?: {}) {
		this.selector = selector;
		this.options = deepMerge(DEFAULTS, options || {});
	}

	/**
	 * Initializes the A11yToolbar.
	 */
	init(): this {
		const toolbar = this.createToolbar();
		const toggleButton = this.createToggleButton();

		addReadSpeakerButton(toolbar, this.options);
		addTextSizeButton(toolbar, this.options);
		addContrastButton(toolbar, this.options);
		addPrintButton(toolbar, this.options);
		addLanguageButton(toolbar, this.options);

		const container = document.querySelector(this.selector);

		container?.appendChild(toolbar);
		container?.insertBefore(toggleButton, toolbar);

		return this;
	}

	/**
	 * Creates the toolbar element.
	 */
	private createToolbar(): HTMLElement {
		const toolbar = document.createElement('div');
		toolbar.id = 'js-a11y-toolbar';
		toolbar.classList.add('a11y-toolbar');
		return toolbar;
	}

	/**
	 * Creates mobile toggle button.
	 */
	private createToggleButton(): HTMLButtonElement {
		const button = document.createElement('button');
		button.classList.add('a11y-toolbar__toggle-button');
		button.setAttribute('aria-expanded', 'false');
		button.setAttribute('aria-controls', 'a11y-toolbar');
		button.setAttribute('aria-label', 'Open toegankelijkheid toolbar');

		const icon = document.createElement('i');
		icon.classList.add('fa-regular', 'fa-universal-access');

		button.appendChild(icon);
		button.addEventListener('click', () => this.toggleToolbar(button));

		return button;
	}

	/**
	 * Toggles the toolbar visibility on mobile devices.
	 *
	 * @param button - The toggle button element.
	 */
	private toggleToolbar(button: HTMLButtonElement): void {
		document.body.classList.toggle(IS_OPEN_BODY_CLASS);
		button.setAttribute(
			'aria-expanded',
			document.body.classList.contains(IS_OPEN_BODY_CLASS).toString()
		);
	}
}
