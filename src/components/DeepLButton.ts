/**
 * External dependencies
 */
import * as focusTrap from 'focus-trap';

/**
 * Internal dependencies
 */
import { createButton, createSvgIcon } from '../utils/createButton';
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
		'div, p, span, h1, h2, h3, h4, h5, h6, li, button, blockquote, a, label, details, summary, strong, em, figcaption, code, pre, th, td, textarea, time, input[type="button"], input[type="submit"], input[type="reset"]';
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
	let languageDisclaimer: string;
	const originalTextMap: Map<string, HTMLElement[]> = new Map();

	const init = (): void => {
		if (!options || !options.showDeepLButton) return;

		languageIcon = options.iconOptions?.languageIcon || '';
		languageTextAfter = options.textAfterOptions?.languageTextAfter || '';
		languageLabel = options.labelOptions?.languageLabel || '';
		languageDisclaimer = options.disclaimerOptions?.languageDisclaimer || 'Use DeepL to translate this website. We take no responsibility for the accuracy of the translation.';

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

		// Set the saved language and translate on page load
		const savedLanguage = window.sessionStorage.getItem('DeepLSelectedLanguage') ?? '';

		if (DEFAULT_LANGUAGE !== savedLanguage && savedLanguage) {
			translatePage(savedLanguage);
		}
	};

	/**
	 * Saves text content of the page and its corresponding elements in a Map.
	 * - Key: String text content
	 * - Value: Array of all the elements sharing the same textContent
	 * For example:
	 * {
	 *   "Home": [<h1>, <span>, <a>],
	 *   "Contact": [<a>],
	 * }
	 */
	const saveOriginalText = (): void => {
		const uniqueTextSet = new Set<string>(); // Track unique text content

		const elements = document.querySelectorAll(CONTENT_SELECTOR);
		elements.forEach((el) => {
			if (el instanceof HTMLElement) {
				const directText = Array.from(el.childNodes)
					.filter(
						(node) =>
							node.nodeType === Node.TEXT_NODE ||
							(node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR')
					)
					.map((node) => node.textContent?.trim())
					.join(' ')
					.trim();

				if (directText && directText.length > 2) {
					const normalizedText = directText.replace(/\s\s+/g, ' '); // Normalize whitespace

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
		description.classList.add('a11y-toolbar__translate-description-deepl');
		description.innerHTML = languageDisclaimer;
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

		const label = document.createElement('label');
		label.classList.add(LABEL_CLASS);
		label.textContent = 'Select language:';
		label.setAttribute('for', 'a11y-toolbar__translate-select');

		const select = document.createElement('select');
		select.id = 'a11y-toolbar__translate-select';
		select.classList.add('a11y-toolbar__translate-select');

		select.addEventListener('change', () => handleSelectChange(select));

		const defaultOption = document.createElement('option');
		defaultOption.value = DEFAULT_LANGUAGE;
		defaultOption.textContent = 'Nederlands (standaard)';
		select.appendChild(defaultOption);

		// Remove the language with iso_alpha2 'NL'
		const filteredLanguages = window.ydpl.ydpl_supported_languages.filter(
			(language) => language.iso_alpha2 !== 'NL'
		);

		// Sort the remaining supported languages by name
		const sortedLanguages = [...filteredLanguages].sort((a, b) => a.name.localeCompare(b.name));

		const storedLanguage =
			window.sessionStorage.getItem('DeepLSelectedLanguage') || DEFAULT_LANGUAGE;

		// Add options from supported languages
		sortedLanguages.forEach((language) => {
			const option = document.createElement('option');
			option.value = language.iso_alpha2;
			option.textContent = language.name;
			if (option.value === storedLanguage) {
				option.selected = true;
			}
			select.appendChild(option);
		});

		const container = document.createElement('div');
		container.classList.add('a11y-toolbar__translate-select-container');
		container.appendChild(label);
		container.appendChild(select);

		return container;
	};

	const handleSelectChange = (select: HTMLSelectElement): void => {
		const selectedLanguage = select.value;
		window.sessionStorage.setItem('DeepLSelectedLanguage', selectedLanguage);

		if (selectedLanguage === DEFAULT_LANGUAGE) {
			revertToOriginalText();
		} else {
			translatePage(selectedLanguage);
		}

		document.documentElement.lang = selectedLanguage;
	};

	const revertToOriginalText = (): void => {
		originalTextMap.forEach((elements, originalText) => {
			elements.forEach((el) => {
				el.textContent = originalText;
			});
		});

		toggleCheckMark(false);
	};

	const translatePage = async (targetLang: string): Promise<void> => {
		const uniqueTextArray = Array.from(new Set(originalTextMap.keys()));
		saveOriginalText();
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
				credentials: 'include',
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error(`Request failed with status: ${response.status}, ${response.status}`);
			}

			const responseData = await response.json();
			applyTranslations(responseData);
		} catch (error) {
			addErrorMessageToModal();
			console.error('Error:', error);
		}
	};

	const addErrorMessageToModal = (): void => {
		const error = document.createElement('p');
		error.classList.add('a11y-toolbar__translate-error');
		error.style.color = 'red';
		error.style.lineHeight = '1.4';
		error.textContent = `Something went wrong. Please try again later.`;

		const modal = document.querySelector('.a11y-toolbar__translate-dropdown');
		modal?.appendChild(error);
	};

	const applyTranslations = (translations: Array<{ text: string; translation: string }>): void => {
		translations.forEach((translation) => {
			const elements = originalTextMap.get(translation.text);
			if (elements) {
				elements.forEach((el) => {
					el.textContent = translation.translation;
				});
			}
		});

		toggleCheckMark(true);
	};

	const toggleCheckMark = (show: boolean): void => {
		const currentIcon = document.querySelector(
			'.a11y-toolbar__button--language-button .a11y-toolbar__icon'
		);
		const flag = createSvgIcon(languageIcon);
		const checkMark = createSvgIcon(
			'<svg xmlns="http://www.w3.org/2000/svg" width="25.17" height="17.975" viewBox="0 0 25.17 17.975"><path id="check-sharp-light" d="M25.17,97.247l-.623.646L9.751,113.3l-.646.674-.646-.674L.623,105.145,0,104.493l1.3-1.247.623.646,7.184,7.488L23.255,96.646,23.873,96Z" transform="translate(0 -96)"/></svg>'
		);
		checkMark.style.width = '25px';

		if (show) {
			currentIcon?.replaceWith(checkMark);
		} else {
			currentIcon?.replaceWith(flag);
		}
	};

	init();
};
