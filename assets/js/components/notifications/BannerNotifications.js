/**
 * BannerNotifications component.
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
 * WordPress dependencies
 */
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { useFeature } from '../../hooks/useFeature';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import useQueryArg from '../../hooks/useQueryArg';
import SetupSuccessBannerNotification from './SetupSuccessBannerNotification';
import CoreSiteBannerNotifications from './CoreSiteBannerNotifications';
import IdeaHubPromptBannerNotification from './IdeaHubPromptBannerNotification';
import UserInputPromptBannerNotification from './UserInputPromptBannerNotification';
import AdSenseAlerts from './AdSenseAlerts';
import ZeroDataStateNotifications from './ZeroDataStateNotifications';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import useViewOnly from '../../hooks/useViewOnly';
import BannerNotification from './BannerNotification';
import TourTooltip from '../../components/TourTooltip';
import Joyride, { EVENTS } from 'react-joyride';

const { useSelect } = Data;

// TODO: Share this configuration with TourTooltips, where it's been copied from.

/** For available options, see: {@link https://github.com/gilbarbara/react-joyride/blob/3e08384415a831b20ce21c8423b6c271ad419fbf/src/styles.js}. */
const joyrideStyles = {
	options: {
		arrowColor: '#1A73E8', // $c-royal-blue
		backgroundColor: '#1A73E8', // $c-royal-blue
		overlayColor: 'rgba(0, 0, 0, 0.6)',
		textColor: '#ffffff', // $c-white
	},
};

// Provides button content as well as aria-label & title attribute values.
const joyrideLocale = {
	last: __( 'Got it', 'google-site-kit' ),
};

/** For available options, see: {@link https://github.com/gilbarbara/react-floater#props}. */
const floaterProps = {
	disableAnimation: true,
	styles: {
		arrow: {
			length: 8,
			margin: 56,
			spread: 16,
		},
		floater: {
			filter:
				'drop-shadow(rgba(60, 64, 67, 0.3) 0px 1px 2px) drop-shadow(rgba(60, 64, 67, 0.15) 0px 2px 6px)',
		},
	},
};

function Acknowledgement( { title, content, target, onDismiss } ) {
	const steps = [
		{
			title,
			target,
			content,
			disableBeacon: true,
			isFixed: true,
			placement: 'auto',
		},
	];

	return (
		<Joyride
			callback={ ( { type } ) => {
				if ( type === EVENTS.STEP_AFTER ) {
					// This is not strictly necessary as the tooltip will hide without it, but this allows the consumer of the component to clean up post-dismiss.
					onDismiss();
				}
			} }
			disableOverlay
			disableScrolling
			floaterProps={ floaterProps }
			locale={ joyrideLocale }
			run={ true }
			steps={ steps }
			styles={ joyrideStyles }
			tooltipComponent={ TourTooltip }
		/>
	);
}

function BannerWithAcknowledgement() {
	const [ showAck, setShowAck ] = useState( false );

	return (
		<Fragment>
			<BannerNotification
				id="test-notification"
				title="Test Notification"
				description="This is a test notification."
				dismiss="Dismiss me"
				dismissExpires={ 1 }
				isDismissible={ true }
				onDismiss={ () => {
					// eslint-disable-next-line no-console
					console.log( 'Notification dismissed' );
					setShowAck( true );
				} }
			/>
			{ showAck && (
				<Acknowledgement
					title="Acknowledgement Title"
					content="This is an acknowledgement"
					target=".googlesitekit-submenu-item__googlesitekit-settings"
					onDismiss={ () => {
						// eslint-disable-next-line no-console
						console.log( 'Acknowledgement dismissed' );
						setShowAck( false );
					} }
				/>
			) }
		</Fragment>
	);
}

export default function BannerNotifications() {
	const ideaHubModuleEnabled = useFeature( 'ideaHubModule' );
	const userInputEnabled = useFeature( 'userInput' );
	const zeroDataStatesEnabled = useFeature( 'zeroDataStates' );

	const viewOnly = useViewOnly();

	const isAuthenticated = useSelect( ( select ) =>
		select( CORE_USER ).isAuthenticated()
	);
	const adSenseModuleActive = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleActive( 'adsense' )
	);

	const [ notification ] = useQueryArg( 'notification' );

	return (
		<Fragment>
			<BannerWithAcknowledgement />
			{ ! viewOnly && (
				<Fragment>
					{ ( 'authentication_success' === notification ||
						'user_input_success' === notification ) && (
						<SetupSuccessBannerNotification />
					) }
					{ isAuthenticated && <CoreSiteBannerNotifications /> }
				</Fragment>
			) }
			{ zeroDataStatesEnabled && <ZeroDataStateNotifications /> }
			{ ! viewOnly && (
				<Fragment>
					{ userInputEnabled && (
						<UserInputPromptBannerNotification />
					) }
					{ ideaHubModuleEnabled && (
						<IdeaHubPromptBannerNotification />
					) }
					{ adSenseModuleActive && <AdSenseAlerts /> }
				</Fragment>
			) }
		</Fragment>
	);
}
