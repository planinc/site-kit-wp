<?php
// phpcs:disable WordPress.PHP.YodaConditions.NotYoda
/**
 * Class Google\Site_Kit\Tests\Modules\Analytics_4\Data_Mock
 *
 * @package   Google\Site_Kit\Tests\Modules\Analytics_4
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Modules\Analytics_4;

use DateTime;
use Exception;
use Rx\Observable;
use Rx\Scheduler;
use Rx\Scheduler\ImmediateScheduler;
use Faker\Factory as Faker;
use Faker\Generator as FakerGenerator;
use InvalidArgumentException;
use PHP_CodeSniffer\Tokenizers\PHP;

// You only need to set the default scheduler once.
Scheduler::setDefaultFactory(
	function() {
		return new ImmediateScheduler();
	}
);

class Data_Mock {
	public const STRATEGY_CARTESIAN = 'cartesian';
	public const STRATEGY_ZIP       = 'zip';

	const ANALYTICS_4_METRIC_TYPES = array(
		'totalUsers'                => 'TYPE_INTEGER',
		'newUsers'                  => 'TYPE_INTEGER',
		'activeUsers'               => 'TYPE_INTEGER',
		'sessions'                  => 'TYPE_INTEGER',
		'bounceRate'                => 'TYPE_FLOAT',
		'conversions'               => 'TYPE_INTEGER',
		'screenPageViews'           => 'TYPE_INTEGER',
		'screenPageViewsPerSession' => 'TYPE_FLOAT',
		'engagedSessions'           => 'TYPE_INTEGER',
		'engagementRate'            => 'TYPE_FLOAT',
		'averageSessionDuration'    => 'TYPE_SECONDS',
		'sessionConversionRate'     => 'TYPE_FLOAT',
		'sessionsPerUser'           => 'TYPE_FLOAT',
		'totalAdRevenue'            => 'TYPE_INTEGER',
	);

	const ANALYTICS_4_DIMENSION_OPTIONS = array(
		'sessionDefaultChannelGrouping'             => array(
			'Direct',
			'Organic Search',
			'Paid Social',
			'(other)',
			'Email',
			'Affiliates',
			'Referral',
			'Paid Search',
			'Video',
			'Display',
		),
		'sessionDefaultChannelGroup'                => array( 'Organic Search' ),
		'country'                                   => array(
			'United States',
			'United Kingdom',
			'India',
			'(not set)',
			'France',
			'Ukraine',
			'Italy',
			'Mexico',
		),
		'city'                                      => array(
			'Dublin',
			'(not set)',
			'Cork',
			'New York',
			'London',
			'Los Angeles',
			'San Francisco',
		),
		'deviceCategory'                            => array( 'Desktop', 'Tablet', 'Mobile' ),
		'newVsReturning'                            => array( 'new', 'returning' ),
		'customEvent:googlesitekit_post_categories' => array(
			'Entertainment; Sports; Media',
			'Wealth',
			'Health',
			'Technology',
			'Business',
		),
		'audienceResourceName'                      => array(
			'properties/12345/audiences/1',
			'properties/12345/audiences/2',
			'properties/12345/audiences/3',
			'properties/12345/audiences/4',
			'properties/12345/audiences/5',
		),
	);

	const ANALYTICS_4_DIMENSION_GENERATOR_OPTIONS = array(
		'pageTitle'                             => array( self::class, 'generate_pageTitle' ),
		'pagePath'                              => array( self::class, 'generate_pagePath' ),
		'customEvent:googlesitekit_post_author' => array( self::class, 'generate_customEvent_googlesitekit_post_author' ),
	);

	public static function generate_pageTitle( $i ) {
		return $i <= 12 ? "Test Post $i" : false;
	}

	public static function generate_pagePath( $i ) {
		return $i <= 12 ? "/test-post-$i/" : false;
	}

	public static function generate_customEvent_googlesitekit_post_author( $i ) {
		return $i <= 12 ? "User $i" : false;
	}

	protected FakerGenerator $faker;

	public function __construct() {
		$this->faker = Faker::create();
	}

	public function get_mock_response( $options, $extraOptions = array( 'dimensionCombinationStrategy' => self::STRATEGY_CARTESIAN ) ) {
		invariant( is_array( $options ), 'Report options are required to generate a mock response.' );
		invariant( isValidDateString( $options['startDate'] ), 'A valid startDate is required.' );
		invariant( isValidDateString( $options['endDate'] ), 'A valid endDate is required.' );

		$args  = $options;
		$faker = Faker::create();

		$argsURL = $args['url'] ?? 'http://example.com';
		$seed    = $argsURL;

		if ( isset( $args['dimensionFilters'] ) ) {
			invariant( isValidDimensionFilters( $args['dimensionFilters'] ), 'dimensionFilters must be an object with valid keys and values.' );
			$seed .= stringifyObject( $args['dimensionFilters'] );
		}

		$argsHash = hexdec( substr( md5( $seed ), 0, 8 ) );

		if ( ! is_nan( $argsHash ) ) {
			$faker->seed( $argsHash );
		}

		$data = array(
			'rowCount' => 0,
			'rows'     => array(),
			'totals'   => array(),
			'minimums' => array(),
			'maximums' => array(),
			'metadata' => array(
				'currencyCode' => 'USD',
				'timeZone'     => 'America/Los_Angeles',
			),
			'kind'     => 'analyticsData#runReport',
		);

		$compareStartDate = $args['compareStartDate'] ?? null;
		$compareEndDate   = $args['compareEndDate'] ?? null;
		$hasDateRange     = $compareStartDate && $compareEndDate;

		$validMetrics = array_filter(
			$args['metrics'] ?? array(),
			function( $metric ) {
				return getMetricType( $metric );
			}
		);
		$streams      = array();

		$dimensions = $args['dimensions'] ? parseDimensionArgs( $args['dimensions'] ) : array();

		if ( $hasDateRange ) {
			$dimensions[] = 'dateRange';
		}

		foreach ( $dimensions as $singleDimension ) {
			$dimension = getItemKey( $singleDimension );

			if ( $dimension === 'date' ) {
				$dateRanges = array( generateDateRange( $args['startDate'], $args['endDate'] ) );
				if ( $compareStartDate && $compareEndDate ) {
					$dateRanges[] = generateDateRange( $compareStartDate, $compareEndDate );
				}
				$dateRange = array_unique( array_merge( ...$dateRanges ) );
				$streams[] = Observable::fromArray( $dateRange );
			} elseif ( $dimension === 'dateRange' ) {
				$streams[] = Observable::fromArray( array( 'date_range_0', 'date_range_1' ) );
			} elseif ( isset( self::ANALYTICS_4_DIMENSION_GENERATOR_OPTIONS[ $dimension ] ) ) {
				$streams[] = Observable::create(
					function ( $observer ) use ( $dimension ) {
						for ( $i = 1; $i <= 90; $i++ ) {
							$val = call_user_func( self::ANALYTICS_4_DIMENSION_GENERATOR_OPTIONS[ $dimension ] );
							if ( $val ) {
								$observer->onNext( $val );
							} else {
								break;
							}
						}
						$observer->onCompleted();
					}
				);
			} elseif ( isset( self::ANALYTICS_4_DIMENSION_OPTIONS[ $dimension ] ) && is_array( self::ANALYTICS_4_DIMENSION_OPTIONS[ $dimension ] ) ) {
				$streams[] = Observable::fromArray( self::ANALYTICS_4_DIMENSION_OPTIONS[ $dimension ] );
			} else {
				$streams[] = Observable::fromArray( array( null ) );
			}
		}

			$limit    = isset( $args['limit'] ) && $args['limit'] > 0 ? intval( $args['limit'] ) : 90;
			$rowLimit = $hasDateRange ? $limit * 2 : $limit;

			$ops = array(
				'map'     => function ( $dimensionValue ) use ( $validMetrics ) {
					return array(
						'dimensionValues' => array_map(
							function ( $value ) {
								return array( 'value' => $value );
							},
							(array) $dimensionValue
						),
						'metricValues'    => $this->generateMetricValues( $validMetrics ),
					);
				},
				'take'    => $rowLimit,
				'reduce'  => function ( $rows, $row ) {
					$rows[] = $row;
					return $rows;
				},
				'mapSort' => function ( $rows ) use ( $args, $validMetrics, $dimensions ) {
					return isset( $args['orderby'] ) ? sortRows( $rows, $validMetrics, $dimensions, $args['orderby'] ) : $rows;
				},
			);

			$dimensionCombinationStrategy = $extraOptions['dimensionCombinationStrategy'];
			$mergeMapper                  = null;

			if ( $dimensionCombinationStrategy === self::STRATEGY_CARTESIAN ) {
				$mergeMapper = function( $arrays ) {
					return cartesianProduct( $arrays );
				};
			} elseif ( $dimensionCombinationStrategy === self::STRATEGY_ZIP ) {
				$mergeMapper = function ( $arrays ) {
					return zip( ...$arrays );
				};
			} else {
				throw new Exception( "Invalid dimension combination strategy: $dimensionCombinationStrategy" );
			}

			echo 'streams count: ' . count( $streams ) . PHP_EOL;
			// print_r( $streams );

			Observable::fromArray(
			// merge(
				array_map(
					function ( $stream ) {
						return $stream->toArray();
					},
					$streams
				)
			)
			// Print the array of arrays to the console via a call to map.
			->mergeAll()
			->toArray()
			// ->map(
			// 	function ( $arrays ) {
			// 		// echo '>>>>> ' . get_class( $arrays ) . "\n";
			// 		print_r( $arrays );
			// 		return $arrays;
			// 	}
			// )
			->flatMap(
				function ( $arrays ) use ( $mergeMapper ) {
					$mapped = call_user_func( $mergeMapper, $arrays );
					return Observable::fromArray( $mapped );
				}
			)
			->map( $ops['map'] )
			->take( $ops['take'] )
			->reduce( $ops['reduce'], array() )
			->map( $ops['mapSort'] )
			->subscribe(
				function ( $rows ) use ( &$data, $dimensions, $hasDateRange ) {
					echo 'ROW COUNT ' . count( $rows ) . PHP_EOL;
					// print_r( $rows );
					$data['rows']     = $rows;
					$data['rowCount'] = count( $rows );

					$data['minimums'] = array(
						array(
							'dimensionValues' => array_map(
								function ( $dimension ) {
									return array( 'value' => $dimension === 'dateRange' ? 'date_range_0' : 'RESERVED_MIN' );
								},
								$dimensions
							),
							'metricValues'    => $rows[0]['metricValues'] ?? array(),
						),
					);

					if ( $hasDateRange ) {
						$data['minimums'][] = array(
							'dimensionValues' => array_map(
								function ( $dimension ) {
									return array( 'value' => $dimension === 'dateRange' ? 'date_range_1' : 'RESERVED_MIN' );
								},
								$dimensions
							),
							'metricValues'    => $rows[1]['metricValues'] ?? array(),
						);
					}

					$firstItemIndex   = count( $rows ) - ( $hasDateRange ? 2 : 1 );
					$data['maximums'] = array(
						array(
							'dimensionValues' => array_map(
								function ( $dimension ) {
									return array( 'value' => $dimension === 'dateRange' ? 'date_range_0' : 'RESERVED_MAX' );
								},
								$dimensions
							),
							'metricValues'    => $rows[ $firstItemIndex ]['metricValues'] ?? array(),
						),
					);

					if ( $hasDateRange ) {
						$data['maximums'][] = array(
							'dimensionValues' => array_map(
								function ( $dimension ) {
									return array( 'value' => $dimension === 'dateRange' ? 'date_range_1' : 'RESERVED_MAX' );
								},
								$dimensions
							),
							'metricValues'    => $rows[ count( $rows ) - 1 ]['metricValues'] ?? array(),
						);
					}

					$data['totals'] = array(
						array(
							'dimensionValues' => array_map(
								function ( $dimension ) {
									return array( 'value' => $dimension === 'dateRange' ? 'date_range_0' : 'RESERVED_TOTAL' );
								},
								$dimensions
							),
							'metricValues'    => $rows[ $firstItemIndex ]['metricValues'] ?? array(),
						),
					);

					if ( $hasDateRange ) {
						$data['totals'][] = array(
							'dimensionValues' => array_map(
								function ( $dimension ) {
									return array( 'value' => $dimension === 'dateRange' ? 'date_range_1' : 'RESERVED_TOTAL' );
								},
								$dimensions
							),
							'metricValues'    => $rows[ count( $rows ) - 1 ]['metricValues'] ?? array(),
						);
					}

					// echo 'DATA1: ' . print_r( $data, true ) . PHP_EOL;
				}
			);

			// echo 'DATA2: ' . print_r( $data, true ) . PHP_EOL;

			return array(
				'dimensionHeaders' => isset( $args['dimensions'] ) ? array_map(
					function ( $dimension ) {
						return array( 'name' => $dimension );
					},
					$dimensions
				) : null,
				'metricHeaders'    => array_map(
					function ( $metric ) {
						return array(
							'name' => $metric['name'] ?? $metric,
							'type' => getMetricType( $metric ),
						);
					},
					$validMetrics
				),
				'data'             => $data,
			);
	}

	private function generateMetricValues( $validMetrics ) {
		$values = array();

		foreach ( $validMetrics as $validMetric ) {
			switch ( getMetricType( $validMetric ) ) {
				case 'TYPE_INTEGER':
					$values[] = array(
						'value' => (string) $this->faker->numberBetween( 0, 100 ),
					);
					break;
				case 'TYPE_FLOAT':
					// The GA4 API returns 17 decimal places, so specify that here. TODO: Check Faker output.
					$values[] = array(
						'value' => (string) $this->faker->randomFloat( 17, 0, 1 ),
					);
					break;
				case 'TYPE_SECONDS':
					$values[] = array(
						'value' => (string) $this->faker->numberBetween( 0, 60 ),
					);
					break;
			}
		}

		return $values;
	}
}


// Helper functions
function invariant( $condition, $message ) {
	if ( ! $condition ) {
		throw new InvalidArgumentException( $message );
	}
}

function isValidDateString( $date ) {
	return strtotime( $date ) !== false;
}

function isValidDimensionFilters( $filters ) {
	// Ensure every dimensionFilter key corresponds to a valid dimension.
	$validType = array( 'string' );

	foreach ( $filters as $dimension => $value ) {
		if ( in_array( gettype( $value ), $validType, true ) ) {
			continue;
		}

		if ( is_array( $value ) ) {
			foreach ( $value as $param ) {
				if ( ! in_array( gettype( $param ), $validType, true ) ) {
					return false;
				}
			}

			continue;
		}

		if ( is_array( $value ) && isset( $value['filterType'] ) && isset( $value['value'] ) ) {
			continue;
		}

		return false;
	}

	return true;
}

function stringifyObject( $object ) {
	return json_encode( $object );
}

function parseDimensionArgs( $dimensions ) {
	// Ensure $dimensions is always an array.
	$dimensionsArray = is_array( $dimensions ) ? $dimensions : array( $dimensions );

	if ( count( $dimensionsArray ) && is_object( $dimensionsArray[0] ) ) {
			return array_map(
				function( $dimension ) {
					return $dimension['name'];
				},
				$dimensionsArray
			);
	}

	return $dimensionsArray;
}

function getItemKey( $item ) {
	return isset( $item['name'] ) ? $item['name'] : (string) $item;
}

function generateDateRange( $startDate, $endDate ) {
	$dates = array();

	$currentDate = new DateTime( $startDate );
	$end         = new DateTime( $endDate );

	while ( $currentDate->getTimestamp() <= $end->getTimestamp() ) {
			// Ensure the generated dates are the same regardless of local timezone.
			$year  = $currentDate->format( 'Y' );
			$month = $currentDate->format( 'm' );
			$day   = $currentDate->format( 'd' );

			$dates[] = $year . $month . $day;

			$currentDate->modify( '+1 day' );
	}

	return $dates;
}

function getMetricType( $metric ) {
	return Data_Mock::ANALYTICS_4_METRIC_TYPES[ getItemKey( $metric ) ];
}

function findMetricValue( $row, $metrics, $metricName ) {
	$index = null;
	foreach ( $metrics as $i => $metric ) {
		if ( getItemKey( $metric ) === $metricName ) {
				$index = $i;
				break;
		}
	}
	if ( $index === null ) {
			return null;
	}
	return intval( $row['metricValues'][ $index ]['value'] );
}

function findDimensionValue( $row, $dimensions, $dimensionName ) {
	$index = null;
	foreach ( $dimensions as $i => $metric ) {
		if ( getItemKey( $metric ) === $dimensionName ) {
				$index = $i;
				break;
		}
	}
	if ( $index === null ) {
			return null;
	}
	return intval( $row['dimensionValues'][ $index ]['value'] );
}

function compareRows( $rowA, $rowB, $metrics, $dimensions, $orderby ) {
	$order = $orderby[0];
	$valA  = null;
	$valB  = null;

	if ( isset( $order['metric'] ) ) {
			$valA = findMetricValue( $rowA, $metrics, $order['metric']['metricName'] );
			$valB = findMetricValue( $rowB, $metrics, $order['metric']['metricName'] );
	} elseif ( isset( $order['dimension'] ) ) {
			$valA = findDimensionValue( $rowA, $dimensions, $order['dimension']['dimensionName'] );
			$valB = findDimensionValue( $rowB, $dimensions, $order['dimension']['dimensionName'] );
	}

	if ( $valA === $valB ) {
		if ( count( $orderby ) > 1 ) {
				return compareRows( $rowA, $rowB, $metrics, $dimensions, array_slice( $orderby, 1 ) );
		}
			return 0;
	}

	$direction = isset( $order['desc'] ) && $order['desc'] ? -1 : 1;
	return ( $valA < $valB ? -1 : 1 ) * $direction;
}

function sortRows( $rows, $metrics, $dimensions, $orderby ) {
	usort(
		$rows,
		function( $rowA, $rowB ) use ( $metrics, $dimensions, $orderby ) {
			return compareRows( $rowA, $rowB, $metrics, $dimensions, $orderby );
		}
	);

	return $rows;
}

function cartesianProduct( $arrays ) {
	$result = array( array() );

	foreach ( $arrays as $array ) {
			$append = array();

		foreach ( $result as $product ) {
			foreach ( $array as $item ) {
					$productCopy   = $product;
					$productCopy[] = $item;
					$append[]      = $productCopy;
			}
		}

			$result = $append;
	}

	return $result;
}

function zip( ...$arrays ) {
	// The NULL callback allows array_map to act like zip, transposing the array.
	return array_map( null, ...$arrays );
}
