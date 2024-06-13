import { useState } from '@wordpress/element';
import ConsentModeSetupCTAWidget from '../../../../../components/consent-mode/ConsentModeSetupCTAWidget';
import AdsModuleSetupCTAWidget from '../../../../../components/notifications/AdsModuleSetupCTAWidget';
import AudienceSegmentationSetupCTAWidget from './AudienceSegmentationSetupCTAWidget';

export default function SetupCTAWidgets() {
	const [ widgets, setWidgets ] = useState( {
		'consent-mode': {
			Component: ConsentModeSetupCTAWidget,
			ready: false,
		},
		'audience-segmentation': {
			Component: AudienceSegmentationSetupCTAWidget,
			ready: false,
		},
		'ads-module': {
			Component: AdsModuleSetupCTAWidget,
			ready: false,
		},
	} );

	return Object.keys( widgets ).map( ( key ) => {
		const { Component, id } = widgets[ key ];

		return (
			<Component
				key={ id }
				onReady={ ( value ) => {
					setWidgets( {
						...widgets,
						[ key ]: {
							...widgets[ key ],
							ready: value,
						},
					} );
				} }
			/>
		);
	} );
}
