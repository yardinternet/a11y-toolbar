/**
 * Creates a button element with the given ID, label, and icon class.
 *
 * @param {string} id - The ID of the button.
 * @param {string} label - The label for the button.
 * @param {string} iconClass - The CSS class for the button's icon.
 */
export const createButton = (
  id: string,
  label: string,
  iconClass?: string | undefined
): HTMLElement => {
  const button = document.createElement('button');
  button.id = id;
  button.classList.add('a11y-toolbar__button');
  button.classList.add(`a11y-toolbar__button--${id}`);
  button.setAttribute('aria-label', label);

  if (iconClass !== undefined && iconClass !== '') {
    const icon = createIcon(iconClass);
    button.appendChild(icon);
  }

  return button;
};

/**
 * Creates an icon element with the given CSS class.
 *
 * @param {string} iconClass - The CSS class for the icon.
 */
export const createIcon = (iconClass: string): HTMLElement => {
  const icon = document.createElement('i');
  icon.classList.add('a11y-toolbar__icon');
  icon.classList.add(...iconClass.split(' '));
  icon.setAttribute('aria-hidden', 'true');

  return icon;
};
