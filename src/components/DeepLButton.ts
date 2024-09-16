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
	const DEFAULT_LANGUAGE = 'NL';
	const CONTENT_SELECTOR =
		'.nav li a, ' +
		'.main-content p, .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6, .main-content span, .main-content li, .main-content a, .main-content button ' +
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
	const originalTextMap: Map<string, HTMLElement[]> = new Map();

	const init = (): void => {
		if (!options || !options.showDeepLButton) return;

		languageIcon = options.iconOptions?.languageIcon || '';
		languageTextAfter = options.textAfterOptions?.languageTextAfter || '';
		languageLabel = options.labelOptions?.languageLabel || '';

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
		const savedLanguage = sessionStorage.getItem('DeepLSelectedLanguage') ?? '';

		if (DEFAULT_LANGUAGE !== savedLanguage && savedLanguage) {
			translatePage(savedLanguage);
		}
	};

	const saveOriginalText = (): void => {
		const uniqueTextSet = new Set<string>(); // Track unique text content

		const elements = document.querySelectorAll(CONTENT_SELECTOR);
		elements.forEach((el) => {
			if (isVisible(el) && el instanceof HTMLElement) {
				const textContent = el.textContent?.trim();

				if (textContent && textContent.length > 2) {
					const normalizedText = textContent.replace(/\s\s+/g, ' '); // Normalize whitespace

					if (!uniqueTextSet.has(normalizedText)) {
						// If this text hasn't been processed yet, create a new entry in the map
						originalTextMap.set(normalizedText, [el]);
						uniqueTextSet.add(normalizedText);
					} else {
						// If this text has already been processed, add the element to the list
						const elementsWithSameText = originalTextMap.get(normalizedText);
						if (elementsWithSameText) {
							elementsWithSameText.push(el);
						}
					}
				}
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
		modalContent.appendChild(select);

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

		// Retrieve the selected language from sessionStorage
		const storedLanguage = sessionStorage.getItem('DeepLSelectedLanguage') || DEFAULT_LANGUAGE;

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
		defaultOption.value = DEFAULT_LANGUAGE;
		defaultOption.textContent = 'Nederlands (standaard)';
		select.appendChild(defaultOption);

		// Sort the supported languages by name
		const sortedLanguages = [...window.ydpl.ydpl_supported_languages].sort((a, b) =>
			a.name.localeCompare(b.name)
		);

		// Add options from supported languages
		sortedLanguages.forEach((language) => {
			const option = document.createElement('option');
			option.value = language.iso_alpha2;
			option.textContent = language.name;
			// Set the selected attribute if this option matches the stored language
			if (option.value === storedLanguage) {
				option.selected = true;
			}
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
		sessionStorage.setItem('DeepLSelectedLanguage', selectedLanguage); // Save selected language and translate
		console.log('Selected Language:', selectedLanguage);

		if (selectedLanguage === DEFAULT_LANGUAGE) {
			revertToOriginalText();
		} else {
			translatePage(selectedLanguage);
		}
	};

	const revertToOriginalText = (): void => {
		originalTextMap.forEach((elements, originalText) => {
			elements.forEach((el) => {
				if (isVisible(el)) {
					el.textContent = originalText;
				}
			});
		});
	};

	const translatePage = async (targetLang: string): Promise<void> => {
		const uniqueTextArray = Array.from(new Set(originalTextMap.keys()));
		await translateText(uniqueTextArray, targetLang);
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
		translations.forEach((translation) => {
			const elements = originalTextMap.get(translation.text); // Get all elements with the same text
			if (elements) {
				elements.forEach((el) => {
					el.textContent = translation.translation;
				});
			}
		});
	};

	init();
};
