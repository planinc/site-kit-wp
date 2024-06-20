/**
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

( function () {
	document.addEventListener(
		'wp_listen_for_consent_change',
		function ( event ) {
			if ( event.detail ) {
				const consentParameters = {};
				let hasConsentParameters = false;
				for ( const category in event.detail ) {
					if ( window._googlesitekitConsentCategoryMap[ category ] ) {
						const status = event.detail[ category ];
						const mappedStatus =
							status === 'allow' ? 'granted' : 'denied';
						const parameters =
							window._googlesitekitConsentCategoryMap[ category ];
						for ( let i = 0; i < parameters.length; i++ ) {
							consentParameters[ parameters[ i ] ] = mappedStatus;
						}
						hasConsentParameters = !! parameters.length;
					}
				}
				if ( hasConsentParameters ) {
					gtag( 'consent', 'update', consentParameters );
				}
			}
		}
	);

	function updateGrantedConsent() {
		if ( ! ( window.wp_consent_type || window.wp_fallback_consent_type ) ) {
			return;
		}
		const consentParameters = {};
		let hasConsentParameters = false;
		for ( const category in window._googlesitekitConsentCategoryMap ) {
			if ( window.wp_has_consent && window.wp_has_consent( category ) ) {
				const parameters =
					window._googlesitekitConsentCategoryMap[ category ];
				for ( let i = 0; i < parameters.length; i++ ) {
					consentParameters[ parameters[ i ] ] = 'granted';
				}
				hasConsentParameters =
					hasConsentParameters || !! parameters.length;
			}
		}
		if ( hasConsentParameters ) {
			gtag( 'consent', 'update', consentParameters );
		}
	}
	document.addEventListener(
		'wp_consent_type_defined',
		updateGrantedConsent
	);
	document.addEventListener( 'DOMContentLoaded', function () {
		if ( ! window.waitfor_consent_hook ) {
			updateGrantedConsent();
		}
	} );
} )();
