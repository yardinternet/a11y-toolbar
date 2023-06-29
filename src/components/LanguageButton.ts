/**
 * External dependencies
 */
import * as focusTrap from 'focus-trap';

/**
 * Internal dependencies
 */
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';
import { checkCanFocusTrap } from '../utils/checkCanFocusTrap';

const LANGUAGE_BODY_CLASS = 'a11y-toolbar--translate-is-open';
const trapFocusOptions = {
	allowOutsideClick: true,
	clickOutsideDeactivates: true,
	checkCanFocusTrap,
	onActivate: () => {
		document.body.classList.add(LANGUAGE_BODY_CLASS);
	},
	onDeactivate: () => {
		document.body.classList.remove(LANGUAGE_BODY_CLASS);
	},
};
let trapFocus = false as any; // Couldn't get the type from the focus-trap package.

/**
 * Adds a button to the toolbar that toggles the language options dropdown.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the language button.
 */
export const addLanguageButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	if (!options || !options.showLanguageButton) return;

	const languageIcon = options.iconOptions?.languageIcon || '';
	const languageTextAfter = options.textAfterOptions?.languageTextAfter || '';
	const languageButton = createButton(
		'language-button',
		'Toon vertaalopties',
		languageIcon,
		languageTextAfter
	);

	toolbar.appendChild(languageButton);

	const modal = createLanguageModalContent();

	toolbar.appendChild(modal);

	languageButton.addEventListener('click', () => handleButtonClick());
};

/**
 * Handles the click event on the language button.
 *
 * @param {HTMLElement} button - The language button element to add the event listener to.
 */
const handleButtonClick = (): void => {
	if (!document.body.classList.contains(LANGUAGE_BODY_CLASS)) {
		openLanguageModal();
	} else {
		closeLanguageModal();
	}
};

const closeLanguageModal = (): void => {
	if (!document.body.classList.contains(LANGUAGE_BODY_CLASS)) return;
	trapFocus.deactivate();
};

const openLanguageModal = (): void => {
	trapFocus = focusTrap.createFocusTrap('.a11y-toolbar__translate-dropdown', trapFocusOptions);
	trapFocus.activate();
};

/**
 * Creates the content for the language modal.
 */
const createLanguageModalContent = (): HTMLElement => {
	const modalContent = document.createElement('div');
	modalContent.classList.add('a11y-toolbar__translate-dropdown');
	modalContent.setAttribute('lang', 'en');

	const title = document.createElement('h3');
	title.textContent = 'Translate';

	const closeButton = document.createElement('button');
	closeButton.classList.add('a11y-toolbar__translate-close-button');
	closeButton.setAttribute('aria-label', 'Close translate modal');
	closeButton.addEventListener('click', () => closeLanguageModal());

	const closeIcon = document.createElement('i');
	closeIcon.classList.add('fal', 'fa-times');

	closeButton.appendChild(closeIcon);
	modalContent.appendChild(title);
	modalContent.appendChild(closeButton);

	const description = document.createElement('p');
	description.textContent =
		'Use Google to translate this website. We take no responsibility for the accuracy of the translation.';
	modalContent.appendChild(description);

	const translationContainer = document.createElement('div');
	translationContainer.id = 'google_translate_element';
	translationContainer.setAttribute('lang', 'nl');
	modalContent.appendChild(translationContainer);

	return modalContent;
};
