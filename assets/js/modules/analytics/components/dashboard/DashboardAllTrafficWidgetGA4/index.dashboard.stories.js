/**
 * DashboardAllTrafficWidgetGA4 Component Stories.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
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
import {
	createTestRegistry,
	provideModules,
	provideSiteInfo,
	WithTestRegistry,
} from '../../../../../../../tests/js/utils';
import {
	getAnalytics4MockResponse,
	provideAnalytics4MockReport,
} from '../../../../analytics-4/utils/data-mock';
import { CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { getWidgetComponentProps } from '../../../../../googlesitekit/widgets/util';
import { MODULES_ANALYTICS_4 } from '../../../../analytics-4/datastore/constants';
import { replaceValuesInAnalytics4ReportWithZeroData } from '../../../../../../../.storybook/utils/zeroReports';
import DashboardAllTrafficWidgetGA4 from '.';

function limitResponseToSingleDate( analyticsResponse ) {
	const findFirstDateRangeRow = ( dateRange ) =>
		analyticsResponse.rows.find(
			( { dimensionValues } ) => dimensionValues[ 1 ].value === dateRange
		);

	return {
		...analyticsResponse,
		rows: [
			findFirstDateRangeRow( 'date_range_0' ),
			findFirstDateRangeRow( 'date_range_1' ),
		],
	};
}

const widgetComponentProps = getWidgetComponentProps(
	'analyticsAllTraffic-widget'
);

const Template = () => (
	<DashboardAllTrafficWidgetGA4 { ...widgetComponentProps } />
);

const baseAllTrafficOptions = {
	startDate: '2020-12-09',
	endDate: '2021-01-05',
	compareStartDate: '2020-11-11',
	compareEndDate: '2020-12-08',
	metrics: [
		{
			name: 'totalUsers',
		},
	],
};

const allTrafficReportOptions = [
	{
		...baseAllTrafficOptions,
		dimensions: [ 'sessionDefaultChannelGrouping' ],
		orderby: {
			fieldName: 'totalUsers',
			sortOrder: 'DESCENDING',
		},
		limit: 6,
	},
	{
		...baseAllTrafficOptions,
		dimensions: [ 'country' ],
		orderby: {
			fieldName: 'totalUsers',
			sortOrder: 'DESCENDING',
		},
		limit: 6,
	},
	{
		...baseAllTrafficOptions,
		dimensions: [ 'deviceCategory' ],
		orderby: {
			fieldName: 'totalUsers',
			sortOrder: 'DESCENDING',
		},
		limit: 6,
	},
	baseAllTrafficOptions,
	{
		startDate: '2020-12-09',
		endDate: '2021-01-05',
		dimensions: [ 'date' ],
		metrics: [
			{
				name: 'totalUsers',
			},
		],
	},
];

export const MainDashboardLoaded = Template.bind( {} );
MainDashboardLoaded.storyName = 'Loaded';
MainDashboardLoaded.args = {
	setupRegistry: ( registry ) => {
		allTrafficReportOptions.forEach( ( options ) => {
			provideAnalytics4MockReport( registry, options );
		} );
	},
};
MainDashboardLoaded.scenario = {
	label: 'Modules/Analytics/Widgets/DashboardAllTrafficWidgetGA4/MainDashboard/Loaded',
};

export const MainDashboardLoading = Template.bind( {} );
MainDashboardLoading.storyName = 'Loading';
MainDashboardLoading.args = {
	setupRegistry: ( registry ) => {
		allTrafficReportOptions.forEach( ( options ) => {
			provideAnalytics4MockReport( registry, options );
			registry
				.dispatch( MODULES_ANALYTICS_4 )
				.startResolution( 'getReport', [ options ] );
		} );
	},
};
MainDashboardLoading.scenario = {
	label: 'Modules/Analytics/Widgets/DashboardAllTrafficWidgetGA4/MainDashboard/Loading',
};

export const MainDashboardDataUnavailable = Template.bind( {} );
MainDashboardDataUnavailable.storyName = 'Data Unavailable';
MainDashboardDataUnavailable.args = {
	setupRegistry: ( registry ) => {
		allTrafficReportOptions.forEach( ( options ) => {
			registry
				.dispatch( MODULES_ANALYTICS_4 )
				.receiveGetReport( {}, { options } );
		} );
	},
};
MainDashboardDataUnavailable.scenario = {
	label: 'Modules/Analytics/Widgets/DashboardAllTrafficWidgetGA4/MainDashboard/DataUnavailable',
};

export const MainDashboardZeroData = Template.bind( {} );
MainDashboardZeroData.storyName = 'Zero Data';
MainDashboardZeroData.args = {
	setupRegistry: ( registry ) => {
		allTrafficReportOptions.forEach( ( options ) => {
			registry
				.dispatch( MODULES_ANALYTICS_4 )
				.receiveGetReport(
					replaceValuesInAnalytics4ReportWithZeroData(
						getAnalytics4MockResponse( options )
					),
					{
						options,
					}
				);
		} );
	},
};
MainDashboardZeroData.scenario = {
	label: 'Modules/Analytics/Widgets/DashboardAllTrafficWidgetGA4/MainDashboard/ZeroData',
};

export const MainDashboardError = Template.bind( {} );
MainDashboardError.storyName = 'Error';
MainDashboardError.args = {
	setupRegistry: ( registry ) => {
		const error = {
			code: 'missing_required_param',
			message: 'Request parameter is empty: metrics.',
			data: {},
		};

		allTrafficReportOptions.forEach( ( options ) => {
			registry
				.dispatch( MODULES_ANALYTICS_4 )
				.receiveError( error, 'getReport', [ options ] );
			registry
				.dispatch( MODULES_ANALYTICS_4 )
				.finishResolution( 'getReport', [ options ] );
		} );
	},
};
MainDashboardError.scenario = {
	label: 'Modules/Analytics/Widgets/DashboardAllTrafficWidgetGA4/MainDashboard/Error',
};

export const MainDashboardOneRowOfData = Template.bind( {} );
MainDashboardOneRowOfData.storyName = 'One row of data';
MainDashboardOneRowOfData.args = {
	setupRegistry: ( registry ) => {
		allTrafficReportOptions.slice( 0, 3 ).forEach( ( options ) => {
			registry
				.dispatch( MODULES_ANALYTICS_4 )
				.receiveGetReport(
					limitResponseToSingleDate(
						getAnalytics4MockResponse( options )
					),
					{ options }
				);
		} );

		allTrafficReportOptions.slice( 3, 5 ).forEach( ( options ) => {
			provideAnalytics4MockReport( registry, options );
		} );
	},
};
MainDashboardOneRowOfData.scenario = {
	label: 'Modules/Analytics/Widgets/DashboardAllTrafficWidgetGA4/MainDashboard/OneRowOfData',
};

export default {
	title: 'Modules/Analytics/Widgets/All Traffic Widget GA4/Dashboard',
	component: DashboardAllTrafficWidgetGA4,
	decorators: [
		( Story, { args } ) => {
			const registry = createTestRegistry();
			// Activate the module.
			provideModules( registry, [
				{
					slug: 'analytics',
					active: true,
					connected: true,
				},
			] );

			// Set some site information.
			provideSiteInfo( registry );

			registry.dispatch( CORE_USER ).setReferenceDate( '2021-01-06' );

			// Call story-specific setup.
			args.setupRegistry( registry );

			return (
				<WithTestRegistry registry={ registry }>
					<Story />
				</WithTestRegistry>
			);
		},
	],
};
