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
 * Adds a button to the toolbar that toggles the contrast.
 *
 * @param {HTMLElement} toolbar - The toolbar element to add the button to.
 * @param {DefaultOptionsType} options - The options for the contrast button.
 */
export const addContrastButton = (toolbar: HTMLElement, options?: DefaultOptionsType): void => {
  if (!options || !options.showContrastButton) return;

  const contrastIcon = options.iconOptions?.contrastIcon || '';
  const contrastButton = createButton(
    'js-a11y-toolbar-contrast-toggler',
    'Vergroot leestekst',
    contrastIcon
  );

  toolbar.appendChild(contrastButton);

  initContrastBodyClass();
  addContrastButtonEventListener(contrastButton);
};

/**
 * Initialize the body class based on the cookie. Checks first if the cookie is already set server side.
 */
const initContrastBodyClass = (): void => {
  const hasContrast = hasContrastCookie();

  if (hasContrast && !document.body.classList.contains('a11y-toolbar-contrast')) {
    document.body.classList.toggle('a11y-toolbar-contrast');
  }
};

/**
 * Adds event listener to the contrast button to toggle the contrast.
 *
 * @param {HTMLElement} button - The contrast button element.
 */
const addContrastButtonEventListener = (button: HTMLElement): void => {
  button.addEventListener('click', () => {
    const newContrastCookie = !hasContrastCookie();
    Cookies.set(COOKIES.CONTRAST, newContrastCookie.toString(), { expires: 90 });

    button.setAttribute('aria-pressed', newContrastCookie.toString());
    button.setAttribute(
      'aria-label',
      newContrastCookie ? 'Verminder schermcontrast' : 'Vergroot schermcontrast'
    );

    document.body.classList.toggle('a11y-toolbar-contrast');
  });
};

/**
 * Checks if a contrast cookie ahs been set.
 */
const hasContrastCookie = (): boolean => {
  return Cookies.get(COOKIES.CONTRAST) === 'true';
};
