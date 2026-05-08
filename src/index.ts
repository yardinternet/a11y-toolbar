/**
 * Internal dependencies
 */
import { addContrastButton } from './components/ContrastButton';
import { addCustomButton } from './components/CustomButton';
import { addDeepLButton } from './components/DeepLButton';
import { addLanguageButton } from './components/LanguageButton';
import { addOpenDyslexicButton } from './components/OpenDyslexicButton';
import { addPrintButton } from './components/PrintButton';
import { addReadSpeakerButton } from './components/ReadSpeakerButton';
import { addTextSizeButton } from './components/TextSizeButton';
import { addTolkieTranslateButton } from './components/TolkieTranslate';

import { DEFAULTS } from './constants/default-options';
import { DefaultOptionsType } from './types/default-options-type';
import { deepMerge } from './utils/deepMerge';

import './styles.scss';

const IS_OPEN_BODY_CLASS = 'a11y-toolbar--is-open';

export { createButton } from './utils/createButton';

export default class A11yToolbar {
	private readonly options: DefaultOptionsType;
	private readonly selector: string;
	private toolbar: HTMLElement | null = null;

	constructor(selector: string, options?: {}) {
		this.selector = selector;
		this.options = deepMerge(DEFAULTS, options || {});
	}

	/**
	 * Initializes the A11yToolbar.
	 */
	init(): this {
		this.toolbar = this.createToolbar();
		const toggleButton = this.createToggleButton();

		addReadSpeakerButton(this.toolbar, this.options);
		addTextSizeButton(this.toolbar, this.options);
		addContrastButton(this.toolbar, this.options);
		addPrintButton(this.toolbar, this.options);
		addOpenDyslexicButton(this.toolbar, this.options);
		addLanguageButton(this.toolbar, this.options);
		addDeepLButton(this.toolbar, this.options);
		addTolkieTranslateButton(this.toolbar, this.options);
		addCustomButton(this.toolbar, this.options);

		const container = document.querySelector(this.selector);

		container?.appendChild(this.toolbar);
		container?.insertBefore(toggleButton, this.toolbar);

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
		const iconClass = this.options.iconOptions?.toggleIcon || '';
		icon.classList.add(...iconClass.split(' '));

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
		const isOpen = document.body.classList.toggle(IS_OPEN_BODY_CLASS);
		button.setAttribute('aria-expanded', isOpen.toString());

		if (isOpen) {
			document.addEventListener('click', this.handleOutsideClick);
			document.addEventListener('keydown', this.handleEscapeKey);
			this.toolbar?.addEventListener('focusout', this.handleFocusOut.bind(this));
		} else {
			document.removeEventListener('click', this.handleOutsideClick);
			document.removeEventListener('keydown', this.handleEscapeKey);
			this.toolbar?.removeEventListener('focusout', this.handleFocusOut.bind(this));
		}
	}

	/**
	 * Handles clicks outside the toolbar to close it.
	 */
	private handleOutsideClick = (event: MouseEvent): void => {
		const target = event.target as HTMLElement;

		if (
			this.toolbar &&
			!this.toolbar.contains(target) &&
			!target.closest('.a11y-toolbar__toggle-button')
		) {
			this.closeToolbar();
		}
	};

	/**
	 * Handles the escape key to close the toolbar.
	 */
	private handleEscapeKey = (event: KeyboardEvent): void => {
		if (event.key !== 'Escape') return;

		const target = event.target as HTMLElement;

		if (
			this.toolbar &&
			this.toolbar.contains(target) &&
			!target.closest('.a11y-toolbar__translate-dropdown')
		) {
			this.closeToolbar(true);
		}
	};

	/**
	 * Handles focus out events to close the toolbar.
	 */
	private handleFocusOut(event: FocusEvent): void {
		const relatedTarget = event.relatedTarget as HTMLElement;

		if (
			!this.toolbar?.contains(relatedTarget) &&
			!relatedTarget.closest('.a11y-toolbar__toggle-button')
		) {
			this.closeToolbar();
		}
	}

	/**
	 * Closes the toolbar.
	 */
	private closeToolbar(focusToggleButton: boolean = false): void {
		document.body.classList.remove(IS_OPEN_BODY_CLASS);

		document.removeEventListener('click', this.handleOutsideClick);
		document.removeEventListener('keydown', this.handleEscapeKey);
		this.toolbar?.removeEventListener('focusout', this.handleFocusOut.bind(this));

		const toggleButton = document.querySelector(
			'.a11y-toolbar__toggle-button'
		) as HTMLButtonElement | null;

		if (toggleButton) {
			toggleButton.setAttribute('aria-expanded', 'false');
		}

		if (toggleButton && focusToggleButton) {
			toggleButton.focus();
		}
	}
}
