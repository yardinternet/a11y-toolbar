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

interface SupportedLanguage {
	iso_alpha2: string;
	name: string;
}

interface YDPL {
	ydpl_rest_translate_url: string;
	ydpl_api_request_nonce: string;
	ydpl_translate_post_id: string;
	ydpl_supported_languages: SupportedLanguage[];
}

declare global {
	interface Window {
		ydpl: YDPL;
	}
}

/**
 * Adds a button to the toolbar that toggles the language options dropdown.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the language button.
 */
export const addDeepLButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
	const LANGUAGE_BODY_CLASS = 'a11y-toolbar--translate-is-open';
	const LABEL_CLASS = 'a11y-toolbar__translate-label';
	const CONTENT_SELECTOR =
		'.nav li a, ' +
		'.main-content p, .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6, .main-content span, .main-content li, .main-content a, ' +
		'.footer p, .footer h2, .footer h3, .footer h4, .footer h5, .footer h6, .footer span, .footer li:not(.wp-block-social-link), .footer a:not(.wp-block-social-link-anchor)';
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

	let languageIcon: string;
	let languageTextAfter: string;
	let languageLabel: string;
	let includedLanguages: string;
	const originalTextMap: Map<HTMLElement, string> = new Map();

	const init = (): void => {
		if (!options || !options.showDeepLButton) return;

		languageIcon = options.iconOptions?.languageIcon || '';
		languageTextAfter = options.textAfterOptions?.languageTextAfter || '';
		languageLabel = options.labelOptions?.languageLabel || '';
		includedLanguages = options.translateIncludedLanguages || '';

		const languageButton = createButton(
			'language-button',
			languageLabel,
			languageIcon,
			languageTextAfter
		);

		toolbar.appendChild(languageButton);

		const modal = createLanguageModalContent();
		toolbar.appendChild(modal);

		languageButton.addEventListener('click', () => handleButtonClick());

		saveOriginalText();

		console.log('Original Text Map:', Array.from(originalTextMap.entries()));

		// Set the saved language and translate on page load
		const savedLanguage = localStorage.getItem('selectedLanguage');
		// if (savedLanguage) {
		// 	translatePage(savedLanguage);
		// }
	};

	/**
	 * Handles the click event on the language button.
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
			'Use DeepL to translate this website. We take no responsibility for the accuracy of the translation.';
		modalContent.appendChild(description);

		const select = createSelect();
		if (select) {
			modalContent.appendChild(select);
		}

		return modalContent;
	};

	const createSelect = () => {
		if (!window.ydpl || !window.ydpl.ydpl_supported_languages) {
			const error = document.createElement('p');
			error.style.color = 'red';
			error.textContent = 'The DeepL API is not available. Check the console for more information.';

			if (!window.ydpl) {
				console.error(
					'window.ydpl global is not available or there is no window.ydpl.ydpl_supported_languages. Make sure the Yard DeepL plugin is configured properly.'
				);
			}
			return error;
		}

		// Create and set up the label
		const label = document.createElement('label');
		label.classList.add(LABEL_CLASS);
		label.textContent = 'Select language:';
		label.setAttribute('for', 'a11y-toolbar__translate-select');

		// Create and set up the select element
		const select = document.createElement('select');
		select.id = 'a11y-toolbar__translate-select';
		select.classList.add('a11y-toolbar__translate-select');

		select.addEventListener('change', () => handleSelectChange(select));

		// Create and add the default option
		const defaultOption = document.createElement('option');
		defaultOption.value = 'DEFAULT';
		defaultOption.textContent = 'Select language';
		defaultOption.selected = true; // Make default option pre-selected
		select.appendChild(defaultOption);

		// Add options from supported languages
		window.ydpl.ydpl_supported_languages.forEach((language) => {
			const option = document.createElement('option');
			option.value = language.iso_alpha2;
			option.textContent = language.name;
			select.appendChild(option);
		});

		// Wrap label and select in a container
		const container = document.createElement('div');
		container.classList.add('a11y-toolbar__translate-select-container');
		container.appendChild(label);
		container.appendChild(select);

		return container;
	};

	const handleSelectChange = (select: HTMLSelectElement): void => {
		const selectedLanguage = select.value;

		console.log('Selected Language:', selectedLanguage);

		// Revert to original text if default or 'NL' is selected
		if (selectedLanguage === 'DEFAULT' || selectedLanguage === 'NL') {
			revertToOriginalText();
		} else {
			localStorage.setItem('selectedLanguage', selectedLanguage); // Save selected language and translate

			console.log('Translating page to: ', selectedLanguage);
			translatePage(selectedLanguage);
		}
	};

	const translatePage = async (targetLang: string): Promise<void> => {
		const originalTextArray = Array.from(originalTextMap.values());
		console.log('Using original text array: ', originalTextArray);
		await translateText(originalTextArray, targetLang);
	};

	const translateText = async (textArray: string[], targetLang: string): Promise<void> => {
		const url = window.ydpl.ydpl_rest_translate_url;
		const headers = {
			'Content-Type': 'application/json',
			nonce: window.ydpl.ydpl_api_request_nonce,
		};

		const requestBody = {
			text: textArray,
			target_lang: targetLang,
			object_id: window.ydpl.ydpl_translate_post_id,
		};

		console.log('Request body:', requestBody);

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error(`Request failed with status: ${response.statusText}`);
			}

			const responseData = await response.json();
			console.log('Translation Response:', responseData);
			applyTranslations(responseData);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const applyTranslations = (translations: Array<{ text: string; translation: string }>): void => {
		originalTextMap.forEach((originalText, el) => {
			const translation = translations.find((t) => t.text === originalText);

			if (translation) {
				el.textContent = translation.translation;
			}
		});
	};

	const saveOriginalText = (): void => {
		const uniqueTextSet = new Set<string>(); // Track unique text content

		const elements = document.querySelectorAll(CONTENT_SELECTOR);
		elements.forEach((el) => {
			if (isVisible(el) && el instanceof HTMLElement) {
				const textContent = el.textContent?.trim();

				if (textContent && textContent.length > 2 && !originalTextMap.has(el)) {
					const normalizedText = textContent.replace(/\s\s+/g, ' '); // Normalize whitespace

					// Only add if the text content is unique
					if (!uniqueTextSet.has(normalizedText)) {
						originalTextMap.set(el, normalizedText);
						uniqueTextSet.add(normalizedText); // Mark this text as processed
					}
				}
			}
		});
	};

	const revertToOriginalText = (): void => {
		originalTextMap.forEach((originalText, el) => {
			if (isVisible(el)) {
				el.textContent = originalText;
			}
		});
	};

	const isVisible = (element: Element): boolean => {
		const style = window.getComputedStyle(element);
		return (
			style.display !== 'none' &&
			style.visibility !== 'hidden' &&
			element.getClientRects().length > 0
		);
	};

	init();
};
