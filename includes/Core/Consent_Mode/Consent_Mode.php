<?php

namespace Google\Site_Kit\Core\Consent_Mode;

use Google\Site_Kit\Core\Util\Method_Proxy_Trait;

class Consent_Mode {
	use Method_Proxy_Trait;

	public function register() {
		$consent_defaults = array(
			'ad_storage'         => 'denied',
			'ad_personalization' => 'denied',
		);

		$consent_category_map = apply_filters(
			'googlesitekit_consent_category_map',
			array(
				'statistics' => array( 'analytics_storage' ),
				'marketing'  => array( 'ad_storage', 'ad_user_data', 'ad_personalization' ),
			)
		);

		add_action(
			'wp_head',
			function() use ( $consent_defaults, $consent_category_map ) {
				$this->print_gtag_snippet( $consent_defaults );
				$this->print_wp_consent_api_snippet( $consent_category_map );
			},
			1
		);
	}

	protected function print_gtag_snippet( $consent_defaults ) {
		?>
<!-- <?php echo esc_html__( 'Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ); ?> -->
<script id='google_gtagjs-js-consent-default'>
window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
gtag("consent","default", <?php echo wp_json_encode( $consent_defaults ); ?>);
</script>
<!-- <?php echo esc_html__( 'End Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ); ?> -->
		<?php
	}

	protected function print_wp_consent_api_snippet( $consent_category_map ) {
		?>
<!-- <?php echo esc_html__( 'WP Consent API integration snippet added by Site Kit', 'google-site-kit' ); ?> -->
<script id='googlesitekit-wp-consent-api'>
window._googlesitekitConsentCategoryMap = <?php	echo wp_json_encode( $consent_category_map ); ?>;

function toConsentParameters(  parameters, [ category, value ] ) {
	if ( window._googlesitekitConsentCategoryMap[ category ] ) {
		const mappedValue = value === 'allow' ? 'granted' : 'denied';
		window._googlesitekitConsentCategoryMap[ category ].forEach( ( parameter ) => {
			parameters[ parameter ] = mappedValue;
		} );
	}
	return parameters;
}

document.addEventListener( 'wp_listen_for_consent_change', function( event ) {
	var consentData = event.detail;
	if ( consentData ) {
		const consentParameters = Object.entries( consentData ).reduce( toConsentParameters, {} )
		gtag( 'consent', 'update', consentData );
	}
});
</script>
<!-- <?php echo esc_html__( 'End WP Consent API integration snippet added by Site Kit', 'google-site-kit' ); ?> -->
		<?php
	}
}
