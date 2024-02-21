<?php

namespace Google\Site_Kit\Core\Consent_Mode;

class Consent_Mode {
	public function register() {
		// TODO: Bail out if Consent Mode `enabled` is not true.

		// Declare that the plugin is compatible with the WP Consent API.
		$plugin = plugin_basename( __FILE__ );
		add_filter( "wp_consent_api_registered_{$plugin}", '__return_true' );

		add_action(
			'wp_head',  // The wp_head action is used to ensure the snippets are printed in the head on the front-end (not admin).
			function() {
				$this->print_gtag_snippet();
				$this->print_wp_consent_api_snippet();
			},
			1 // Set priority to 1 to ensure the snippets are printed with top priority in the head.
		);
	}

	protected function print_gtag_snippet() {
		$consent_defaults = array(
			'analytics_storage'  => 'denied',
			'ad_storage'         => 'denied',
			'ad_user_data'       => 'denied',
			'ad_personalization' => 'denied',
			'region'             => array(), // This will be populated from the Consent Mode `region` setting.
			// `wait_for_update`     => 500, // TODO: We should probably add this to allow time for CMPs to update the consent status.
		);

		?>
<!-- <?php echo esc_html__( 'Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ); ?> -->
<script id='google_gtagjs-js-consent-default'>
window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
gtag("consent","default", <?php echo wp_json_encode( $consent_defaults ); ?>);
</script>
<!-- <?php echo esc_html__( 'End Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ); ?> -->
		<?php
	}

	protected function print_wp_consent_api_snippet() {
		$consent_category_map = apply_filters(
			'googlesitekit_consent_category_map',
			array(
				'statistics' => array( 'analytics_storage' ),
				'marketing'  => array( 'ad_storage', 'ad_user_data', 'ad_personalization' ),
			)
		);

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
