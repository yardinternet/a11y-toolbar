/**
 * The element has visibility: hidden, which makes it initially un-focusable, creating an error.
 * This ensures an wait until it can activate the trap.
 *
 * @param {HTMLElement[]} trapContainers - The elements to check.
 * @returns {Promise<void[]>} - A promise that resolves when the elements are focusable.
 */
export const checkCanFocusTrap = (
	trapContainers: HTMLElement[]
): Promise< void[] > => {
	const results = trapContainers.map( ( trapContainer ) => {
		return new Promise< void >( ( resolve ): void => {
			const interval = setInterval( () => {
				if (
					getComputedStyle( trapContainer ).visibility !== 'hidden'
				) {
					resolve();
					clearInterval( interval );
				}
			}, 5 );
		} );
	} );
	return Promise.all( results );
};
