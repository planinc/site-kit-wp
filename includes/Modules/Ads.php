<?php

namespace Google\Site_Kit\Modules;

use Google\Site_Kit\Core\Authentication\Clients\Google_Site_Kit_Client;
use Google\Site_Kit\Core\Modules\Module;
use Google\Site_Kit\Core\Modules\Module_With_Scopes;
use Google\Site_Kit\Core\Modules\Module_With_Scopes_Trait;
use Google\Site_Kit\Core\REST_API\Data_Request;
use Google\Site_Kit_Dependencies\Google_Service_GoogleAds;
use Google\Site_Kit_Dependencies\GuzzleHttp\Psr7\Request;

class Ads extends Module implements Module_With_Scopes {
	use Module_With_Scopes_Trait;

	const MODULE_SLUG = 'ads';

	public function register() {
		$this->register_scopes_hook();
	}

	protected function get_datapoint_definitions() {
		return array(
			'GET:accessible-customers' => array(
				'service' => 'ads',
			),
		);
	}

	protected function create_data_request( Data_Request $data ) {
		switch ( "{$data->method}:{$data->datapoint}" ) {
			case 'GET:accessible-customers':
				$service = $this->get_service( 'ads' );
				/** @var Google_Service_GoogleAds $service */

				$request = $service->customers->listAccessibleCustomers();
				/** @var Request $request */
				return $request->withAddedHeader('developer-token', 'test');
		}

		return parent::create_data_request( $data );
	}

	public static function is_force_active() {
		return true;
	}

	protected function setup_services( Google_Site_Kit_Client $client ) {

//		$guzzle_client = clone $client->getHttpClient();
//		/** @var Client $guzzle_client */
//		$guzzle_client->

		return array(
			'ads' => new Google_Service_GoogleAds( $client ),
		);
	}

	protected function setup_info() {
		return array(
			'slug'        => self::MODULE_SLUG,
			'name'        => _x( 'Ads', 'Service name', 'google-site-kit' ),
			'description' => __( 'Earn money by placing ads on other websites. It’s free and easy.', 'google-site-kit' ),
			'order'       => 2,
//			'homepage'    => add_query_arg( $idenfifier_args, 'https://www.google.com/adsense/start' ),
		);
	}

	public function get_scopes() {
		return array(
			Google_Service_GoogleAds::ADWORDS,
		);
	}
}
