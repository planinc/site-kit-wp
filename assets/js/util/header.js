export function getHeaderHeight( breakpoint ) {
	const header = document.querySelector( '.googlesitekit-header' );

	const hasStickyAdminBar = breakpoint !== 'small';

	const headerHeight = hasStickyAdminBar
		? header.getBoundingClientRect().bottom
		: header.offsetHeight;

	/*
	 * Factor in the height of the new sticky unified dashboard navigation bar
	 * if it exists (when unified dashboard is enabled).
	 *
	 * @TODO Update this section to always factor in the navigation height
	 * when `unifiedDashboard` feature flag is removed.
	 */
	const navigation = document.querySelector( '.googlesitekit-navigation' );
	const navigationHeight = navigation ? navigation.offsetHeight : 0;

	return headerHeight + navigationHeight;
}
