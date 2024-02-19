<?php

namespace Google\Site_Kit\Core\Consent_Mode;

use Google\Site_Kit\Core\Util\Method_Proxy_Trait;

class Consent_Mode {
	use Method_Proxy_Trait;

	public function register() {
		add_action( 'googlesitekit_setup_gtag', $this->get_method_proxy( 'setup_gtag' ) );
	}

	protected function setup_gtag( $gtag ) {
		$gtag->add_command(
			'consent',
			array(
				'default',
				array(
					'ad_storage'         => 'denied',
					'ad_personalization' => 'denied',
				),
			),
			'before'
		);
	}
}
