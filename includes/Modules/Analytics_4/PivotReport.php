<?php
/**
 * Class Google\Site_Kit\Modules\Analytics_4\PivotReport
 *
 * @package   Google\Site_Kit\Modules\Analytics_4
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Modules\Analytics_4;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\REST_API\Data_Request;
use Google\Site_Kit\Modules\Analytics_4\Report\ReportParsers;
use Google\Site_Kit_Dependencies\Google\Service\AnalyticsData\Pivot as Google_Service_AnalyticsData_Pivot;

/**
 * The base class for Analytics 4 pivot reports.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class PivotReport extends ReportParsers {

	/**
	 * Plugin context.
	 *
	 * @since n.e.x.t
	 * @var Context
	 */
	protected $context;

	/**
	 * Constructor.
	 *
	 * @since n.e.x.t
	 *
	 * @param Context $context Plugin context.
	 */
	public function __construct( Context $context ) {
		$this->context = $context;
	}

	/**
	 * Parses the pivots value of the data request into an array of AnalyticsData Pivot object instances.
	 *
	 * @since n.e.x.t
	 *
	 * @param Data_Request $data Data request object.
	 * @return Google_Service_AnalyticsData_Pivot[] An array of AnalyticsData Pivot objects.
	 */
	protected function parse_pivots( Data_Request $data ) {
		$pivots = array();

		if ( is_array( $data['pivots'] ) ) {
			foreach ( $data['pivots'] as $key => $value ) {
				if ( is_array( $value['fieldNames'] ) && is_numeric( $value['limit'] ) ) {
					$pivots[] = $value;
				}
			}
		}

		if ( empty( $pivots ) || ! is_array( $pivots ) || ! wp_is_numeric_array( $pivots ) ) {
			return array();
		}

		$results = array_map(
			function ( $pivot_def ) {
				$pivot = new Google_Service_AnalyticsData_Pivot();

				$pivot->setMetricAggregations( array( 'TOTAL', 'MINIMUM', 'MAXIMUM' ) );

				$pivot->setFieldNames( $pivot_def['fieldNames'] );
				$pivot->setLimit( $pivot_def['limit'] );

				if ( isset( $pivot_def['orderby'] ) ) {
					$pivot->setOrderBys( $pivot_def['orderby'] );
				}

				return $pivot;
			},
			$pivots
		);

		$results = array_filter( $results );
		$results = array_values( $results );

		return $results;
	}

}
