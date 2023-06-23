/**
 * External dependencies
 */
import Cookies from 'js-cookie';

/**
 * Internal dependencies
 */
import { COOKIES } from '../constants/cookies';
import { createButton } from '../utils/createButton';
import { DefaultOptionsType } from '../types/default-options-type';

/**
 * Adds a button to the toolbar that toggles the text size.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the text size button.
 */
export const addTextSizeButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
  if (!options || !options.showTextSizeButton) return;

  const textSizeIcon = options.iconOptions?.textSizeIcon || '';
  const textSizeButton = createButton(
    'js-a11y-toolbar-text-size-toggler',
    'Vergroot leestekst',
    textSizeIcon
  );

  toolbar.appendChild(textSizeButton);

  initTextSizeBodyClass();
  addTextSizeButtonEventListener(textSizeButton);
};

/**
 * Initialize the body class based on the cookie. Checks first if the cookie is already set server side.
 */
const initTextSizeBodyClass = (): void => {
  const hasTextSize = hasTextSizeCookie();

  if (hasTextSize && !document.body.classList.contains('a11y-toolbar-text-size')) {
    document.body.classList.toggle('a11y-toolbar-text-size');
  }
};

/**
 * Adds event listener to the text size button to toggle the text size.
 *
 * @param {HTMLElement} button - The text size button element.
 */
const addTextSizeButtonEventListener = (button: HTMLElement): void => {
  button.addEventListener('click', () => {
    const newTextSizeCookie = !hasTextSizeCookie();
    Cookies.set(COOKIES.TEXT_SIZE, newTextSizeCookie.toString(), { expires: 90 });

    button.setAttribute('aria-pressed', newTextSizeCookie.toString());
    button.setAttribute(
      'aria-label',
      newTextSizeCookie ? 'Verklein schermtekst' : 'Vergroot schermtekst'
    );

    document.body.classList.toggle('a11y-toolbar-text-size');
  });
};

/**
 * Checks if a text size cookie has been set.
 */
const hasTextSizeCookie = (): boolean => {
  return Cookies.get(COOKIES.TEXT_SIZE) === 'true';
};
