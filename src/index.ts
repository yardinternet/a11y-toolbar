/**
 * The frontend class for the A11yToolbar
 *
 * @since 0.1.0
 */
import { DEFAULTS } from './constants/defaults';

export default class A11yToolbar {
  /**
   * The current options.
   */
  private readonly options: {};

  /**
   * The A11yToolbar constructor.
   *
   * @param options - Optional. An object with options.
   */
  constructor(options?: {}) {
    this.options = { ...DEFAULTS, ...options };
  }

  /**
   * Initializes the instance.
   *
   * @return `this`
   */
  init(): this {
    console.log('A11yToolbar init');

    return this;
  }
}
