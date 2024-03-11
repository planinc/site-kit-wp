<?php
/**
 * Class Google\Site_Kit\Core\Modules\Ads\Tag_Matchers
 *
 * @package   Google\Site_Kit\Core\Modules\Ads
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Modules\Ads;

use Google\Site_Kit\Core\Modules\Tags\Module_Tag_Matchers;
use Google\Site_Kit\Core\Tags\Tag_Matchers_Interface;

/**
 * Class for Tag matchers.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Tag_Matchers extends Module_Tag_Matchers implements Tag_Matchers_Interface {

	/**
	 * Holds array of regex tag matchers.
	 *
	 * @since n.e.x.t
	 *
	 * @return array Array of regex matchers.
	 */
	public function regex_matchers() {
		return array(
			// Detect Ads gtag config with valid AdWords Conversion ID.
			"/gtag\(['|\"]config['|\"],['|\"]AW-[0-9]+['|\"]\)/",
		);
	}

}
