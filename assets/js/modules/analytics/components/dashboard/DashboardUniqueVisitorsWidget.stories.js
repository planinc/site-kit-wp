/**
 * DashboardUniqueVisitorsWidget Component Stories.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { STORE_NAME } from '../../datastore/constants';
import { provideModules, provideSiteInfo } from '../../../../../../tests/js/utils';
import { provideAnalyticsMockReport } from '../../util/data-mock';
import { withWidgetComponentProps } from '../../../../googlesitekit/widgets/util/';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import DashboardUniqueVisitorsWidget, { selectSparklineArgs, selectReportArgs } from './DashboardUniqueVisitorsWidget';

const currentEntityURL = 'https://www.example.com/example-page/';
const WidgetWithComponentProps = withWidgetComponentProps( 'widget-slug' )( DashboardUniqueVisitorsWidget );

const VARIANT_READY = 'Ready';
const VARIANT_LOADING = 'Loading';
const VARIANT_DATA_UNAVAILABLE = 'Data Unavailable';
const VARIANT_ERROR = 'Error';

function Template( { setupRegistry, variant, ...args } ) {
	const setup = ( registry ) => {
		const options = selectReportArgs( registry.select );

		global.console.log( variant );

		switch ( variant ) {
			case VARIANT_READY: {
				const sparkOptions = selectSparklineArgs( registry.select );
				provideAnalyticsMockReport( registry, options );
				provideAnalyticsMockReport( registry, sparkOptions );
				registry.dispatch( STORE_NAME ).clearError( 'getReport', [ options ] );
				registry.dispatch( STORE_NAME ).finishResolution( 'getReport', [ options ] );
				registry.dispatch( STORE_NAME ).finishResolution( 'getReport', [ sparkOptions ] );
				break;
			}
			case VARIANT_LOADING: {
				const sparkOptions = selectSparklineArgs( registry.select );
				provideAnalyticsMockReport( registry, options );
				provideAnalyticsMockReport( registry, sparkOptions );
				registry.dispatch( STORE_NAME ).clearError( 'getReport', [ options ] );
				registry.dispatch( STORE_NAME ).startResolution( 'getReport', [ options ] );
				registry.dispatch( STORE_NAME ).startResolution( 'getReport', [ sparkOptions ] );
				break;
			}
			case VARIANT_DATA_UNAVAILABLE: {
				registry.dispatch( STORE_NAME ).clearError( 'getReport', [ options ] );
				registry.dispatch( STORE_NAME ).receiveGetReport( [], { options } );
				registry.dispatch( STORE_NAME ).finishResolution( 'getReport', [ options ] );
				break;
			}
			case VARIANT_ERROR: {
				const error = {
					code: 'test_error',
					message: 'Error message.',
					data: {},
				};
				registry.dispatch( STORE_NAME ).receiveError( error, 'getReport', [ options ] );
				// registry.dispatch( STORE_NAME ).receiveGetReport( {}, { options } );
				registry.dispatch( STORE_NAME ).finishResolution( 'getReport', [ options ] );
				break;
			}
			default:
				setupRegistry();
				break;
		}
	};

	return (
		<WithRegistrySetup func={ setup }>
			<WidgetWithComponentProps { ...args } />
		</WithRegistrySetup>
	);
}

export const Ready = Template.bind( {} );
Ready.storyName = 'Ready';
Ready.args = {
	variant: VARIANT_READY,
};

// export const Loading = Template.bind( {} );
// Loading.storyName = 'Loading';
// Loading.args = {
// 	setupRegistry: ( registry ) => {
// 	},
// };

// export const DataUnavailable = Template.bind( {} );
// DataUnavailable.storyName = 'Data Unavailable';
// DataUnavailable.args = {
// 	setupRegistry: ( registry ) => {
// 	},
// };

// export const Error = Template.bind( {} );
// Error.storyName = 'Error';
// Error.args = {
// 	setupRegistry: ( registry ) => {
// 	},
// };

export const LoadedEntityURL = Template.bind( {} );
LoadedEntityURL.storyName = 'Ready with entity URL set';
LoadedEntityURL.args = {
	setupRegistry: ( registry ) => {
		provideSiteInfo( registry, { currentEntityURL } );
		provideAnalyticsMockReport( registry, selectReportArgs( registry.select ) );
		provideAnalyticsMockReport( registry, selectSparklineArgs( registry.select ) );
	},
};

export const LoadingEntityURL = Template.bind( {} );
LoadingEntityURL.storyName = 'Loading with entity URL set';
LoadingEntityURL.args = {
	setupRegistry: ( registry ) => {
		provideSiteInfo( registry, { currentEntityURL } );
		provideAnalyticsMockReport( registry, selectReportArgs( registry.select ) );
		provideAnalyticsMockReport( registry, selectSparklineArgs( registry.select ) );
		registry.dispatch( STORE_NAME ).startResolution( 'getReport', [ selectReportArgs( registry.select ) ] );
		registry.dispatch( STORE_NAME ).startResolution( 'getReport', [ selectSparklineArgs( registry.select ) ] );
	},
};

export const DataUnavailableEntityURL = Template.bind( {} );
DataUnavailableEntityURL.storyName = 'Data Unavailable with entity URL set';
DataUnavailableEntityURL.args = {
	setupRegistry: ( registry ) => {
		provideSiteInfo( registry, { currentEntityURL } );

		const options = selectReportArgs( registry.select );
		registry.dispatch( STORE_NAME ).receiveGetReport( [], { options } );
	},
};

export const ErrorEntityURL = Template.bind( {} );
ErrorEntityURL.storyName = 'Error with entity URL set';
ErrorEntityURL.args = {
	setupRegistry: ( registry ) => {
		const error = {
			code: 'test_error',
			message: 'Error with entity URL set.',
			data: {},
		};

		provideSiteInfo( registry, { currentEntityURL } );

		const options = selectReportArgs( registry.select );
		registry.dispatch( STORE_NAME ).receiveError( error, 'getReport', [ options ] );
		registry.dispatch( STORE_NAME ).finishResolution( 'getReport', [ options ] );
	},
};

export default {
	title: 'Modules/Analytics/Widgets/DashboardUniqueVisitorsWidget',
	argTypes: {
		variant: {
			control: {
				type: 'radio',
			},
			options: [
				VARIANT_READY,
				VARIANT_LOADING,
				VARIANT_DATA_UNAVAILABLE,
				VARIANT_ERROR,
			],
		},
	},
	decorators: [
		( Story ) => (
			<div className="googlesitekit-widget">
				<div className="googlesitekit-widget__body">
					<Story />
				</div>
			</div>
		),
		( Story ) => {
			const setupRegistry = ( registry ) => {
				registry.dispatch( CORE_USER ).setReferenceDate( '2020-09-08' );

				provideModules( registry, [ {
					active: true,
					connected: true,
					slug: 'analytics',
				} ] );

				registry.dispatch( STORE_NAME ).receiveGetSettings( {} );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};
