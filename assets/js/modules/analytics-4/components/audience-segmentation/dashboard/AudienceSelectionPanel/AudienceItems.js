/**
 * Audience Selection Panel Audience Items
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_USER } from '../../../../../../googlesitekit/datastore/user/constants';
import {
	DATE_RANGE_OFFSET,
	MODULES_ANALYTICS_4,
} from '../../../../datastore/constants';
import AudienceItem from './AudienceItem';
import { SelectionPanelItems } from '../../../../../../components/SelectionPanel';

const { useSelect } = Data;

export default function AudienceItems( { savedItemSlugs = [] } ) {
	const availableAudiences = useSelect( ( select ) => {
		const { getConfigurableAudiences, getReport } =
			select( MODULES_ANALYTICS_4 );

		const audiences = getConfigurableAudiences();

		if ( undefined === audiences ) {
			return undefined;
		}

		if ( ! audiences.length ) {
			return [];
		}

		// eslint-disable-next-line @wordpress/no-unused-vars-before-return -- We might return before `otherAudiences` is used.
		const [ siteKitAudiences, otherAudiences ] = audiences.reduce(
			( [ siteKit, other ], audience ) => {
				if ( audience.audienceType === 'SITE_KIT_AUDIENCE' ) {
					siteKit.push( audience );
				} else {
					other.push( audience );
				}
				return [ siteKit, other ];
			},
			[ [], [] ] // Initial values.
		);

		const siteKitAudiencesPartialData = siteKitAudiences.map(
			( audience ) =>
				select( MODULES_ANALYTICS_4 ).isAudiencePartialData(
					audience.name
				)
		);

		// If any of the Site Kit audiences' partial data state is still loading, return undefined.
		if ( siteKitAudiencesPartialData.includes( undefined ) ) {
			return undefined;
		}

		const isSiteKitAudiencePartialData =
			siteKitAudiencesPartialData.includes( true );

		const dateRangeDates = select( CORE_USER ).getDateRangeDates( {
			offsetDays: DATE_RANGE_OFFSET,
		} );

		const reportOptions = {
			...dateRangeDates,
			metrics: [
				{
					name: 'totalUsers',
				},
			],
		};

		// Get the user count for the available Site Kit audiences using the `newVsReturning` dimension
		// to avoid the partial data state for these audiences.
		const newVsReturningReport =
			isSiteKitAudiencePartialData &&
			getReport( {
				...reportOptions,
				dimensions: [ { name: 'newVsReturning' } ],
			} );

		const audienceResourceNames = (
			isSiteKitAudiencePartialData ? otherAudiences : audiences
		 ).map( ( { name } ) => name );

		// Get the user count for the available audiences using the `audienceResourceName` dimension.
		const audienceResourceNameReport = getReport( {
			...reportOptions,
			dimensions: [ { name: 'audienceResourceName' } ],
			dimensionFilters: {
				audienceResourceName: audienceResourceNames,
			},
		} );

		const { rows: newVsReturningRows = [] } = newVsReturningReport || {};
		const { rows: audienceResourceNameRows = [] } =
			audienceResourceNameReport || {};

		function findAudienceRow( rows, dimensionValue ) {
			return rows.find(
				( row ) => row?.dimensionValues?.[ 0 ]?.value === dimensionValue
			);
		}

		return audiences.map( ( audience ) => {
			let audienceRow;

			if (
				audience.audienceType === 'SITE_KIT_AUDIENCE' &&
				isSiteKitAudiencePartialData
			) {
				audienceRow = findAudienceRow(
					newVsReturningRows,
					audience.audienceSlug === 'new-visitors'
						? 'new'
						: 'returning'
				);
			} else {
				audienceRow = findAudienceRow(
					audienceResourceNameRows,
					audience.name
				);
			}

			return {
				...audience,
				userCount:
					Number( audienceRow?.metricValues?.[ 0 ]?.value ) || 0,
			};
		} );
	} );

	const audiencesListReducer = (
		acc,
		{ audienceType, description, displayName, name, userCount }
	) => {
		let citation = '';

		switch ( audienceType ) {
			case 'DEFAULT_AUDIENCE':
				citation = __(
					'Created by default by Google Analytics',
					'google-site-kit'
				);
				description = '';
				break;
			case 'SITE_KIT_AUDIENCE':
				citation = __( 'Created by Site Kit', 'google-site-kit' );
				break;
			case 'USER_AUDIENCE':
				citation = __(
					'Already exists in your Analytics property',
					'google-site-kit'
				);
				break;
		}

		return {
			...acc,
			[ name ]: {
				title: displayName,
				subtitle: description,
				description: citation,
				userCount,
			},
		};
	};

	const availableSavedItems = availableAudiences
		?.filter( ( { name } ) => savedItemSlugs.includes( name ) )
		.reduce( audiencesListReducer, {} );

	const availableUnsavedItems = availableAudiences
		?.filter( ( { name } ) => ! savedItemSlugs.includes( name ) )
		.reduce( audiencesListReducer, {} );

	return (
		<SelectionPanelItems
			availableItemsTitle={ __( 'Additional groups', 'google-site-kit' ) }
			availableSavedItems={ availableSavedItems }
			availableUnsavedItems={ availableUnsavedItems }
			ItemComponent={ AudienceItem }
			savedItemSlugs={ savedItemSlugs }
		/>
	);
}

AudienceItems.propTypes = {
	savedItemSlugs: PropTypes.array,
};
