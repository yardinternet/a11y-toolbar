/**
 * The frontend class for the A11yToolbar
 *
 * @since 0.1.0
 */
import { DEFAULTS } from './constants/defaults';
import { A11yToolbarDefaultOptions } from './types/defaults-types';

export default class A11yToolbar {
  private readonly options: A11yToolbarDefaultOptions;
  private readonly selector: string;

  constructor(selector: string, options?: {}) {
    this.selector = selector;
    this.options = { ...DEFAULTS, ...options };
  }

  /**
   * Initializes the A11yToolbar.
   */
  init(): this {
    const toolbar = this.createToolbar();

    this.addButtonWithReadSpeaker(toolbar);
    this.addButtonWithTextSize(toolbar);
    this.addButtonWithContrast(toolbar);
    this.addButtonWithPrint(toolbar);
    this.addButtonWithLanguage(toolbar);

    const container = document.querySelector(this.selector);
    container?.appendChild(toolbar);

    return this;
  }

  /**
   * Creates a new toolbar element with the necessary classes and ID.
   */
  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.id = 'js-a11y-toolbar';
    toolbar.classList.add('a11y-toolbar');
    return toolbar;
  }

  /**
   * Adds a button to the toolbar that toggles the read speaker.
   *
   * @param {HTMLElement} toolbar - The toolbar element to add the button to.
   */
  private addButtonWithReadSpeaker(toolbar: HTMLElement): void {
    if (!this.options.showReadSpeakerButton) return;

    const readSpeakerIcon = this.options.iconOptions?.readSpeakerIcon || '';
    const readSpeakerButton = this.createButton(
      'js-a11y-toolbar-read-speaker',
      'Read speaker',
      readSpeakerIcon
    );
    toolbar.appendChild(readSpeakerButton);

    // Todo: change above code to <a> of ReadSpeaker
  }

  /**
   * Adds a button to the toolbar that toggles the text size.
   *
   * @param {HTMLElement} toolbar - The toolbar element to add the button to.
   */
  private addButtonWithTextSize(toolbar: HTMLElement): void {
    if (!this.options.showTextSizeButton) return;

    const textSizeIcon = this.options.iconOptions?.textSizeIcon || '';
    const textSizeButton = this.createButton(
      'js-a11y-toolbar-text-size-toggler',
      'Vergroot leestekst',
      textSizeIcon
    );
    toolbar.appendChild(textSizeButton);

    // Todo: add event listener
    textSizeButton.addEventListener('click', () => {});
  }

  /**
   * Adds a button to the toolbar that toggles the contrast.
   *
   * @param {HTMLElement} toolbar - The toolbar element to add the button to.
   */
  private addButtonWithContrast(toolbar: HTMLElement): void {
    if (!this.options.showContrastButton) return;

    const contrastIcon = this.options.iconOptions?.contrastIcon || '';
    const contrastButton = this.createButton(
      'js-a11y-toolbar-contrast-toggler',
      'Verhoog schermcontrast',
      contrastIcon
    );
    toolbar.appendChild(contrastButton);

    // Todo: add event listener
    contrastButton.addEventListener('click', () => {});
  }

  /**
   * Adds a button to the toolbar that prints the page.
   *
   * @param {HTMLElement} toolbar - The toolbar element to add the button to.
   */
  private addButtonWithPrint(toolbar: HTMLElement): void {
    if (!this.options.showPrintButton) return;
    const printIcon = this.options.iconOptions?.printIcon || '';
    const printButton = this.createButton(
      'js-a11y-toolbar-print-button',
      'Print pagina',
      printIcon
    );
    toolbar.appendChild(printButton);

    printButton.addEventListener('click', () => {
      window.print();
    });
  }

  /**
   * Adds a button to the toolbar that prints the page.
   *
   * @param {HTMLElement} toolbar - The toolbar element to add the button to.
   */
  private addButtonWithLanguage(toolbar: HTMLElement): void {
    if (!this.options.showLanguageButton) return;
    const languageIcon = this.options.iconOptions?.languageIcon || '';
    const languageButton = this.createButton(
      'js-a11y-toolbar-print-button',
      'Open Google Translate scherm',
      languageIcon
    );
    toolbar.appendChild(languageButton);

    // Todo: add event listener
    languageButton.addEventListener('click', () => {});
  }

  /**
   * Creates a button element with the given ID, label, and icon class.
   *
   * @param {string} id - The ID of the button.
   * @param {string} label - The label for the button.
   * @param {string} iconClass - The CSS class for the button's icon.
   */
  private createButton(id: string, label: string, iconClass?: string | undefined): HTMLElement {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('a11y-toolbar__button');
    button.classList.add(`a11y-toolbar__button--${id}`);
    button.setAttribute('aria-label', label);

    if (iconClass !== undefined && iconClass !== '') {
      const icon = this.createIcon(iconClass);
      button.appendChild(icon);
    }

    return button;
  }

  /**
   * Creates an icon element with the given CSS class.
   *
   * @param {string} iconClass - The CSS class for the icon.
   */
  private createIcon(iconClass: string): HTMLElement {
    const icon = document.createElement('i');
    icon.classList.add('a11y-toolbar__icon');
    icon.classList.add(...iconClass.split(' '));
    icon.setAttribute('aria-hidden', 'true');

    return icon;
  }
}
