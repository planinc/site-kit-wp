<?php
/**
 * Dismissed_ItemsTest
 *
 * @package   Google\Site_Kit\Tests\Core\Dismissals
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Dismissals;

use Google\Site_Kit\Context;
use Google\Site_Kit\Core\Dismissals\Dismissed_Items;
use Google\Site_Kit\Core\Storage\User_Options;
use Google\Site_Kit\Tests\TestCase;

class Dismissed_ItemsTest extends TestCase {

	/**
	 * @var User_Options
	 */
	private $user_options;

	/**
	 * @var Dismissed_Items
	 */
	private $dismissed_items;

	/**
	 * @before
	 */
	public function beforeEach() {
		parent::beforeEach();

		$user_id = $this->factory()->user->create();
		$context = new Context( GOOGLESITEKIT_PLUGIN_MAIN_FILE );

		$this->user_options    = new User_Options( $context, $user_id );
		$this->dismissed_items = new Dismissed_Items( $this->user_options );
		$this->dismissed_items->register();
	}

	public function test_add() {
		$this->assertEmpty( $this->user_options->get( Dismissed_Items::OPTION ) );

		$this->dismissed_items->add( 'foo' );
		$this->assertEquals(
			array(
				'foo' => 0,
			),
			$this->user_options->get( Dismissed_Items::OPTION )
		);

		$this->dismissed_items->add( 'bar', 100 );
		$this->assertEquals(
			array(
				'foo' => 0,
				'bar' => time() + 100,
			),
			$this->user_options->get( Dismissed_Items::OPTION )
		);
	}

	public function test_get_dismissed_items() {
		$this->user_options->set(
			Dismissed_Items::OPTION,
			array(
				'foo' => 0,
				'bar' => time() + 100,
				'baz' => time() - 100,
			)
		);

		$this->assertEquals(
			array(
				'foo',
				'bar',
			),
			$this->dismissed_items->get_dismissed_items()
		);
	}

	public function test_is_dismissed() {
		$this->user_options->set(
			Dismissed_Items::OPTION,
			array(
				'foo' => 0,
				'bar' => time() + 100,
				'baz' => time() - 100,
			)
		);

		$this->assertTrue( $this->dismissed_items->is_dismissed( 'foo' ) );
		$this->assertTrue( $this->dismissed_items->is_dismissed( 'bar' ) );
		$this->assertFalse( $this->dismissed_items->is_dismissed( 'baz' ) );
	}

}
