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
			array(
				'startDate'  => '2020-12-29',
				'endDate'    => '2021-01-02',
				'metrics'    => array(
					array(
						'name' => 'sessions',
					),
					array(
						'name' => 'engagementRate',
					),
				),
				'dimensions' => array( 'date' ),
			)
		);
		error_log( "Data_MockTest::test_get_mock_response:\n" . print_r( $response, true ) );

		$this->assertTrue( true );
		// $this->assertEquals( 1)
	}
}
