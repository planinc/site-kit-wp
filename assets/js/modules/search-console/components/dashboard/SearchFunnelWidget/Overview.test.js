/**
 * Overview component tests.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
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

import {
	render,
	createTestRegistry,
	provideModules,
	provideUserCapabilities,
	provideUserInfo,
	provideUserAuthentication,
	provideSiteInfo,
	act,
} from '../../../../../../../tests/js/test-utils';
import {
	getViewportWidth,
	setViewportWidth,
} from '../../../../../../../tests/js/viewport-width-utils';
import coreModulesFixture from '../../../../../googlesitekit/modules/datastore/__fixtures__';
import { CORE_MODULES } from '../../../../../googlesitekit/modules/datastore/constants';
import { CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { MODULES_SEARCH_CONSOLE } from '../../../datastore/constants';
import { getWidgetComponentProps } from '../../../../../googlesitekit/widgets/util';
import Overview from './Overview';

describe( 'Overview', () => {
	let registry;
	let originalViewportWidth;

	const { WidgetReportError } = getWidgetComponentProps( 'searchFunnel' );

	const searchConsoleData = [
		{
			clicks: 123,
			ctr: 4.56,
			impressions: 7890,
			keys: [ '2022-06-21' ],
			position: 12.345,
		},
	];

	const overviewProps = {
		searchConsoleData,
		selectedStats: 0,
		handleStatsSelection: () => {},
		dateRangeLength: 28,
		WidgetReportError,
	};

	beforeEach( () => {
		registry = createTestRegistry();

		provideModules( registry );
		provideUserInfo( registry );
		provideUserAuthentication( registry );
		provideUserCapabilities( registry );
		provideSiteInfo( registry );
		registry.dispatch( CORE_USER ).receiveConnectURL( 'test-url' );
		registry.dispatch( MODULES_SEARCH_CONSOLE ).receiveGetSettings( {
			propertyID: 'http://example.com/',
		} );

		fetchMock.getOnce(
			/^\/google-site-kit\/v1\/modules\/search-console\/data\/searchanalytics/,
			{
				body: searchConsoleData,
			}
		);

		originalViewportWidth = getViewportWidth();

		// Set to a viewport larger than BREAKPOINT_SMALL, i.e. > 600, so as to test the execution
		// path that renders the ActivateAnalyticsCTA component.
		setViewportWidth( 1024 );
	} );

	afterEach( () => {
		setViewportWidth( originalViewportWidth );
	} );

	it( 'should render the Search Funnel Overview, including the Activate Analytics CTA', async () => {
		const { container, getByText } = render(
			<Overview { ...overviewProps } />,
			{ registry }
		);

		await act( async () => {
			await new Promise( ( resolve ) => setTimeout( resolve, 0 ) );
		} );

		expect( container ).toMatchSnapshot();

		expect( getByText( /Set up Google Analytics/ ) ).toBeInTheDocument();
	} );

	it( 'should not render the Activate Analytics CTA when the Analytics module is not available', async () => {
		registry
			.dispatch( CORE_MODULES )
			.receiveGetModules(
				coreModulesFixture.filter(
					( { slug } ) => slug !== 'analytics'
				)
			);

		const { container, queryByText } = render(
			<Overview { ...overviewProps } />,
			{ registry }
		);

		await act( async () => {
			await new Promise( ( resolve ) => setTimeout( resolve, 0 ) );
		} );

		expect( container ).toMatchSnapshot();

		expect(
			queryByText( /Set up Google Analytics/ )
		).not.toBeInTheDocument();
	} );
} );
