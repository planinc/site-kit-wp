/**
 * LinkAnalyticsAndAdSenseAccountsOverlayNotification component tests.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import LinkAnalyticsAndAdSenseAccountsOverlayNotification from './LinkAnalyticsAndAdSenseAccountsOverlayNotification';
import {
	render,
	createTestRegistry,
	provideModules,
	muteFetch,
	fireEvent,
} from '../../../../tests/js/test-utils';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { MODULES_ANALYTICS_4 } from '../../modules/analytics-4/datastore/constants';
import {
	LINK_ANALYTICS_ADSENSE_OVERLAY_DISMISSED,
	LINK_ANALYTICS_ADSENSE_OVERLAY_NOTIFICATION,
} from './constants';
import { CORE_UI } from '../../googlesitekit/datastore/ui/constants';
import { VIEW_CONTEXT_MAIN_DASHBOARD_VIEW_ONLY } from '../../googlesitekit/constants';

describe( 'LinkAnalyticsAndAdSenseAccountsOverlayNotification', () => {
	let registry;

	const dismissItemEndpointRegExp = RegExp(
		'^/google-site-kit/v1/core/user/data/dismiss-item'
	);

	beforeEach( () => {
		registry = createTestRegistry();
		provideModules( registry, [
			{
				slug: 'adsense',
				active: true,
				connected: true,
			},
			{
				slug: 'analytics-4',
				active: true,
				connected: true,
			},
		] );
		registry.dispatch( CORE_USER ).receiveGetDismissedItems( [] );
		registry.dispatch( MODULES_ANALYTICS_4 ).setSettings( {
			adSenseLinked: false,
		} );
	} );

	it( 'does not render when Analytics module is not connected', () => {
		provideModules( registry, [
			{
				slug: 'adsense',
				active: true,
				connected: true,
			},
			{
				slug: 'analytics-4',
				active: true,
				connected: false,
			},
		] );

		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'does not render when isAdSenseLinked is `true`', () => {
		registry.dispatch( MODULES_ANALYTICS_4 ).setAdSenseLinked( true );

		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'does not render if dismissed previously', () => {
		registry
			.dispatch( CORE_USER )
			.receiveGetDismissedItems( [
				LINK_ANALYTICS_ADSENSE_OVERLAY_DISMISSED,
			] );

		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'does not render if it was dismissed by dismissOverlayNotification action', async () => {
		// Dismissing notification will prevent `isShowingOverlayNotification` from
		// being set to the current notification.
		await registry
			.dispatch( CORE_UI )
			.setValue( 'dismissedOverlayNotifications', [
				LINK_ANALYTICS_ADSENSE_OVERLAY_NOTIFICATION,
			] );

		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'does not render if another notification is showing', async () => {
		await registry
			.dispatch( CORE_UI )
			.setValue(
				'isShowingOverlayNotification',
				'TestOverlayNotification'
			);

		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'does not render in "view only" dashboard', () => {
		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
				viewContext: VIEW_CONTEXT_MAIN_DASHBOARD_VIEW_ONLY,
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'does not render without the feature flag', () => {
		registry
			.dispatch( CORE_USER )
			.receiveGetDismissedItems( [
				LINK_ANALYTICS_ADSENSE_OVERLAY_DISMISSED,
			] );

		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
			}
		);
		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'renders if adSenseLinked is not set', () => {
		const { container } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);

		expect( container ).toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'renders `Learn how` and `Maybe later` buttons`', () => {
		const supportURL = registry.select( CORE_SITE ).getGoogleSupportURL( {
			path: '/adsense/answer/6084409',
		} );

		const { container, getByRole } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);

		expect( container ).toHaveTextContent( 'Learn how' );
		expect( getByRole( 'button', { name: /learn how/i } ) ).toHaveAttribute(
			'href',
			supportURL
		);
		expect( container ).toHaveTextContent( 'Maybe later' );
	} );

	it( 'clicking the `Learn how` button dismisses the notification', async () => {
		muteFetch( dismissItemEndpointRegExp );

		const { container, getByRole, waitForRegistry } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);

		await waitForRegistry();

		expect( container ).toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);

		fireEvent.click( getByRole( 'button', { name: /learn how/i } ) );

		const isShowingOverlayNotification = await registry
			.select( CORE_UI )
			.isShowingOverlayNotification();

		expect( fetchMock ).toHaveBeenCalledTimes(
			1,
			dismissItemEndpointRegExp
		);

		expect( isShowingOverlayNotification ).toBe( undefined );

		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );

	it( 'clicking the `Maybe later` button dismisses the notification', async () => {
		muteFetch( dismissItemEndpointRegExp );

		const { container, getByRole, waitForRegistry } = render(
			<LinkAnalyticsAndAdSenseAccountsOverlayNotification />,
			{
				registry,
				features: [ 'ga4AdSenseIntegration' ],
			}
		);

		await waitForRegistry();

		expect( container ).toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);

		fireEvent.click( getByRole( 'button', { name: /maybe later/i } ) );

		const isShowingOverlayNotification = await registry
			.select( CORE_UI )
			.isShowingOverlayNotification();

		expect( fetchMock ).toHaveBeenCalledTimes(
			1,
			dismissItemEndpointRegExp
		);

		expect( isShowingOverlayNotification ).toBe( undefined );

		expect( container ).not.toHaveTextContent(
			'Link your Analytics and AdSense accounts to find out'
		);
	} );
} );
