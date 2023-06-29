/**
 * Internal dependencies
 */
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';

const LANGUAGE_BODY_CLASS = 'a11y-toolbar-translate-open';

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

	languageButton.addEventListener('click', () => handleButtonClick(languageButton));
	document.addEventListener('click', (e) => handleOutsideClick(e, modal, languageButton));
};

/**
 * Handles the click event on the language button.
 *
 * @param {HTMLElement} button - The language button element to add the event listener to.
 */
const handleButtonClick = (button: HTMLElement): void => {
	if (!document.body.classList.contains(LANGUAGE_BODY_CLASS)) {
		openLanguageModal();
	} else {
		closeLanguageModal();
	}
};

const openLanguageModal = (): void => {
	document.body.classList.add(LANGUAGE_BODY_CLASS);
};

const closeLanguageModal = (): void => {
	document.body.classList.remove(LANGUAGE_BODY_CLASS);
};

/**
 * Handles the outside click event to close the modal.
 *
 * @param {Event} event - The click event.
 * @param {HTMLElement} modal - The modal element.
 * @param {HTMLElement} languageButton - The language button element.
 */
const handleOutsideClick = (event: any, modal: HTMLElement, languageButton: HTMLElement) => {
	if (
		(!modal.contains(event.target) && !languageButton.contains(event.target)) ||
		event.target.classList.contains('a11y-toolbar__translate-close-button')
	) {
		closeLanguageModal();
	}
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
