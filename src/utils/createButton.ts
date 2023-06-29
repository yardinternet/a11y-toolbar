/**
 * Creates a button element with the given ID, label, and icon class.
 *
 * @param {string} id - The ID of the button.
 * @param {string} label - The label for the button.
 * @param {string} icon - The icon for the button. Can be a CSS class or an SVG string.
 * @param {string} textAfter - The text to be added after the icon.
 */
export const createButton = (
	id: string,
	label: string,
	icon?: string | undefined,
	textAfter?: string | undefined
): HTMLElement => {
	const button = document.createElement('button');
	button.id = 'js-a11y-toolbar-' + id;
	button.classList.add('a11y-toolbar__button');
	button.classList.add(`a11y-toolbar__button--${id}`);
	button.setAttribute('aria-label', label);

	if (icon !== undefined && icon !== '') {
		const iconElement = createIcon(icon);
		button.appendChild(iconElement);
	}

	if (textAfter !== undefined && textAfter !== '') {
		const textAfterElement = createTextAfter(textAfter);
		button.appendChild(textAfterElement);
	} else {
		button.setAttribute('aria-label', label);
	}

	return button;
};

/**
 * Creates an icon element with the given icon parameter.
 *
 * @param {string} icon - The icon parameter. Can be a CSS class or an SVG string.
 */
export const createIcon = (icon: string): HTMLElement => {
	if (icon.startsWith('<svg')) {
		return createSvgIcon(icon);
	} else {
		return createFontAwesomeIcon(icon);
	}
};

/**
 * Creates an icon element using FontAwesome.
 *
 * @param {string} iconClass - The CSS class for the icon.
 */
const createFontAwesomeIcon = (iconClass: string): HTMLElement => {
	const icon = document.createElement('i');
	icon.classList.add('a11y-toolbar__icon');
	icon.classList.add(...iconClass.split(' '));
	icon.setAttribute('aria-hidden', 'true');

	return icon;
};

/**
 * Creates an icon element using SVG.
 *
 * @param {string} svg - The SVG string for the icon.
 */
const createSvgIcon = (svg: string): HTMLElement => {
	const icon = document.createElement('span');
	icon.classList.add('a11y-toolbar__icon');
	icon.classList.add('a11y-toolbar__icon--svg');
	icon.innerHTML = svg;
	icon.setAttribute('aria-hidden', 'true');

	return icon;
};

/**
 * Creates a span element with the given text to be added after the button icon.
 *
 * @param {string} textAfter - The text to be added after the icon.
 */
export const createTextAfter = (textAfter: string): HTMLElement => {
	const textElement = document.createElement('span');
	textElement.textContent = textAfter;
	textElement.classList.add('a11y-toolbar__button-text-after');

	return textElement;
};
