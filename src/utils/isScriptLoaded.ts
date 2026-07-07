/**
 * Checks if a script source is already loaded
 *
 * @param {string} scriptSrc - The script source to check.
 */
export const isScriptLoaded = ( scriptSrc: string ): boolean => {
	const scriptEntries = performance
		.getEntriesByType( 'resource' )
		// @ts-ignore
		.filter( ( e ) => e.initiatorType === 'script' );

	for ( const entry of scriptEntries ) {
		if ( entry.name.includes( scriptSrc ) && entry.duration > 0 ) {
			return true;
		}
	}

	return false;
};
