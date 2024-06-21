<?php
/**
 * Class Google\Site_Kit\Tests\Modules\Analytics_4\Data_MockTest
 *
 * @package   Google\Site_Kit\Tests\Modules\Analytics_4
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Modules\Analytics_4;

use PHPUnit\Framework\TestCase;

class Data_MockTest extends TestCase {

	public function test_get_mock_response() {
		$dataMock = new Data_Mock();
		$response = $dataMock->get_mock_response(
			// array(
			// 	'startDate'  => '2020-12-29',
			// 	'endDate'    => '2021-01-02',
			// 	'metrics'    => array(
			// 		array(
			// 			'name' => 'sessions',
			// 		),
			// 		array(
			// 			'name' => 'engagementRate',
			// 		),
			// 	),
			// 	'dimensions' => array( 'date' ),
			// )
			array(
				'startDate'        => '2020-12-29',
				'endDate'          => '2021-01-02',
				'metrics'          => array(
					array(
						'name' => 'totalUsers',
					),
					array(
						'name' => 'engagementRate',
					),
				),
				'dimensions'       => array( 'audienceResourceName' ),
				'dimensionFilters' => array(
					'audienceResourceName' => array( 'abc', 'def', 'ghi' ),
				),
			)
			// array(
			// 	'startDate'        => '2020-12-01',
			// 	'endDate'          => '2020-12-02',
			// 	'compareStartDate' => '2020-12-04',
			// 	'compareEndDate'   => '2020-12-05',
			// 	'metrics'          => array(
			// 		array( 'name' => 'totalUsers' ),
			// 		array( 'name' => 'averageSessionDuration' ),
			// 	),
			// 	'dimensions'       => array(
			// 		array( 'name' => 'date' ),
			// 		array( 'name' => 'sessionDefaultChannelGrouping' ),
			// 	),
			// 	'orderby'          => array(
			// 		array(
			// 			'dimension' => array( 'dimensionName' => 'date' ),
			// 			'desc'      => false,
			// 		),
			// 		array(
			// 			'metric' => array( 'metricName' => 'totalUsers' ),
			// 			'desc'   => true,
			// 		),
			// 	),
			// )
		);
		error_log( "Data_MockTest::test_get_mock_response:\n" . print_r( $response, true ) ) . PHP_EOL;

		$this->assertTrue( true );

		// error_log( 'Data_MockTest::test_get_mock_response completed' );
		file_put_contents( 'foo.json', json_encode( $response, JSON_PRETTY_PRINT ) );
	}

	// public function test_get_mock_pivot_response() {
	// 	$dataMock = new Data_Mock();
	// 	$response = $dataMock->get_mock_pivot_response(
	// 		array(
	// 			'startDate'  => '2024-04-18',
	// 			'endDate'    => '2024-05-15',
	// 			'metrics'    => array(
	// 				array(
	// 					'name' => 'screenPageViewsPerSession',
	// 				),
	// 				array(
	// 					'name' => 'averageSessionDuration',
	// 				),
	// 			),
	// 			'dimensions' => array( 'city', 'audienceResourceName' ),
	// 			'pivots'     => array(
	// 				array(
	// 					'fieldNames' => array( 'audienceResourceName' ),
	// 					'limit'      => 3,
	// 				),
	// 				array(
	// 					'fieldNames' => array( 'city' ),
	// 					'limit'      => 3,
	// 					'orderby'    => array(
	// 						array(
	// 							'metric' => array(
	// 								'metricName' => 'screenPageViewsPerSession',
	// 							),
	// 						),
	// 					),
	// 				),
	// 			),
	// 		)
	// 	);
	// 	error_log( "Data_MockTest::test_get_mock_pivot_response:\n" . print_r( $response, true ) ) . PHP_EOL;

	// 	$this->assertTrue( true );

	// 	// error_log( 'Data_MockTest::test_get_mock_response completed' );
	// 	file_put_contents( 'foo.json', json_encode( $response, JSON_PRETTY_PRINT ) );
	// }
}
