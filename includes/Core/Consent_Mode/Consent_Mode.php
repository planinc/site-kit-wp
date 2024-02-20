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

		add_action(
			'wp_head',
			function() use ( $consent_defaults ) {
				?>
<!-- <?php echo esc_html__( 'Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ); ?> -->
<script id='google_gtagjs-js-consent-default'>
window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
gtag("consent","default", <?php	echo wp_json_encode( $consent_defaults ); ?>);
</script>
<!-- <?php echo esc_html__( 'End Google tag (gtag.js) snippet added by Site Kit', 'google-site-kit' ); ?> -->
				<?php
			},
			1
		);
	}
}
