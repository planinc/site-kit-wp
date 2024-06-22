/**
 * GatheringDataNotification component.
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

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useSelect } from 'googlesitekit-data';
import BannerNotification from '../BannerNotification';
import GatheringDataIcon from '../../../../svg/graphics/zero-state-red.svg';
import { CORE_SITE } from '../../../googlesitekit/datastore/site/constants';
import { getTimeInSeconds, trackEvent } from '../../../util';
import useViewContext from '../../../hooks/useViewContext';

export default function GatheringDataNotification( {
	title,
	gatheringDataWaitTimeInHours,
} ) {
	const viewContext = useViewContext();
	const eventCategory = `${ viewContext }_gathering-data-notification`;
	const handleOnView = useCallback( () => {
		trackEvent( eventCategory, 'view_notification' );
	}, [ eventCategory ] );
	const handleOnDismiss = useCallback( () => {
		trackEvent( eventCategory, 'dismiss_notification' );
	}, [ eventCategory ] );
	const handleCTAClick = useCallback( () => {
		trackEvent( eventCategory, 'confirm_notification' );
	}, [ eventCategory ] );

	const settingsAdminURL = useSelect( ( select ) =>
		select( CORE_SITE ).getAdminURL( 'googlesitekit-settings' )
	);

	if ( ! gatheringDataWaitTimeInHours ) {
		return null;
	}

	return (
		<BannerNotification
			id="gathering-data-notification"
			title={ title }
			description={ sprintf(
				/* translators: %s: the number of hours the site can be in a gathering data state */
				_n(
					'It can take up to %s hour before stats show up for your site. While you’re waiting, connect more services to get more stats.',
					'It can take up to %s hours before stats show up for your site. While you’re waiting, connect more services to get more stats.',
					gatheringDataWaitTimeInHours,
					'google-site-kit'
				),
				gatheringDataWaitTimeInHours
			) }
			format="small"
			onView={ handleOnView }
			ctaLabel={ __( 'See other services', 'google-site-kit' ) }
			ctaLink={ `${ settingsAdminURL }#/connect-more-services` }
			onCTAClick={ handleCTAClick }
			dismiss={ __( 'Maybe later', 'google-site-kit' ) }
			dismissExpires={ getTimeInSeconds( 'day' ) }
			SmallImageSVG={ GatheringDataIcon }
			onDismiss={ handleOnDismiss }
			isDismissible
		/>
	);
}

GatheringDataNotification.propTypes = {
	title: PropTypes.string,
	gatheringDataWaitTimeInHours: PropTypes.number,
};
