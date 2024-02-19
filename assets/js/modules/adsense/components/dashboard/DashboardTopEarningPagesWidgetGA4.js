/**
 * AdBlockerWarningWidget component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useIntersection } from 'react-use';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { __, _x } from '@wordpress/i18n';
import { useRef, useEffect, useState, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { ADSENSE_GA4_TOP_EARNING_PAGES_NOTICE_DISMISSED_ITEM_KEY as DISMISSED_KEY } from '../../constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { MODULES_ADSENSE } from '../../datastore/constants';
import {
	MODULES_ANALYTICS,
	DATE_RANGE_OFFSET,
} from '../../../analytics/datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../../analytics-4/datastore/constants';
import { generateDateRangeArgs } from '../../../analytics/util/report-date-range-args';
import whenActive from '../../../../util/when-active';
import AdBlockerWarning from '../common/AdBlockerWarning';
import { AdSenseLinkCTA } from '../common';
import SourceLink from '../../../../components/SourceLink';
import SettingsNotice from '../../../../components/SettingsNotice';
import useViewOnly from '../../../../hooks/useViewOnly';
import ReportTable from '../../../../components/ReportTable';
import Null from '../../../../components/Null';
import InfoIcon from '../../../../../svg/icons/info-circle.svg';
import { Grid } from '../../../../material-components';
import useViewContext from '../../../../hooks/useViewContext';
import { trackEvent } from '../../../../util';

const { useSelect } = Data;

function DashboardTopEarningPagesWidgetGA4( { WidgetNull, Widget } ) {
	const viewOnlyDashboard = useViewOnly();
	const viewContext = useViewContext();
	const widgetRef = useRef();

	const isDismissed = useSelect( ( select ) =>
		select( CORE_USER ).isItemDismissed( DISMISSED_KEY )
	);

	const { startDate, endDate } = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeDates( {
			offsetDays: DATE_RANGE_OFFSET,
		} )
	);

	const analyticsMainURL = useSelect( ( select ) => {
		if ( viewOnlyDashboard ) {
			return null;
		}
		return select( MODULES_ANALYTICS ).getServiceReportURL(
			'content-publisher-overview',
			generateDateRangeArgs( { startDate, endDate } )
		);
	} );

	const isAdSenseLinked = useSelect( ( select ) =>
		select( MODULES_ANALYTICS_4 ).getAdSenseLinked()
	);

	const isAdblockerActive = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).isAdBlockerActive()
	);

	const intersectionEntry = useIntersection( widgetRef, {
		threshold: 0.25,
	} );
	const [ hasBeenInView, setHasBeenInView ] = useState( false );
	const inView = !! intersectionEntry?.intersectionRatio;

	const eventCategory = `${ viewContext }_top-earning-pages-widget`;

	useEffect( () => {
		if ( inView && ! hasBeenInView ) {
			if ( ! isAdSenseLinked && ! viewOnlyDashboard ) {
				trackEvent( eventCategory, 'view_notification' );
			}

			if ( isAdSenseLinked ) {
				trackEvent( eventCategory, 'view_widget' );
			}

			setHasBeenInView( true );
		}
	}, [
		inView,
		hasBeenInView,
		isAdSenseLinked,
		viewContext,
		viewOnlyDashboard,
		eventCategory,
	] );

	const handleAdSenseLinkCTAClick = useCallback( () => {
		trackEvent( eventCategory, 'click_learn_more_link' );
	}, [ eventCategory ] );

	if ( isDismissed ) {
		return <WidgetNull />;
	}

	if ( ! isAdSenseLinked && viewOnlyDashboard ) {
		return <WidgetNull />;
	}

	if ( isAdblockerActive ) {
		return (
			<Widget Footer={ Footer }>
				<AdBlockerWarning />
			</Widget>
		);
	}

	if ( ! isAdSenseLinked && ! viewOnlyDashboard ) {
		return (
			<Widget Footer={ Footer } innerRef={ widgetRef }>
				<AdSenseLinkCTA onClick={ handleAdSenseLinkCTAClick } />
			</Widget>
		);
	}

	function Footer() {
		return (
			<SourceLink
				className="googlesitekit-data-block__source"
				name={ _x( 'Analytics', 'Service name', 'google-site-kit' ) }
				href={ analyticsMainURL }
				external
			/>
		);
	}

	const tableColumns = [
		{
			title: __( 'Top Earning Pages', 'google-site-kit' ),
			tooltip: __( 'Top Earning Pages', 'google-site-kit' ),
			primary: true,
			Component: Null,
		},
	];

	return (
		<Widget noPadding Footer={ Footer } innerRef={ widgetRef }>
			<ReportTable rows={ [] } columns={ tableColumns } />

			<Grid className="googlesitekit-padding-top-0">
				<SettingsNotice
					Icon={ InfoIcon }
					notice={ __(
						'Top earning pages are not yet available in Google Analytics 4',
						'google-site-kit'
					) }
					dismiss={ DISMISSED_KEY }
					className="googlesitekit-margin-top-0 googlesitekit-margin-bottom-0 googlesitekit-settings-notice-adsense-top-earning-pages-widget"
				>
					{ __(
						'Site Kit will notify you as soon as you can connect AdSense and Analytics again',
						'google-site-kit'
					) }
				</SettingsNotice>
			</Grid>
		</Widget>
	);
}

DashboardTopEarningPagesWidgetGA4.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetNull: PropTypes.elementType.isRequired,
};

export default compose(
	whenActive( { moduleName: 'adsense' } ),
	whenActive( { moduleName: 'analytics-4' } )
)( DashboardTopEarningPagesWidgetGA4 );
