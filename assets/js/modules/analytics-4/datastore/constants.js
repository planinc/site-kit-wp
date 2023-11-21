/**
 * `modules/analytics-4` data store constants.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const MODULES_ANALYTICS_4 = 'modules/analytics-4';

export const PROPERTY_CREATE = 'property_create';
export const WEBDATASTREAM_CREATE = 'webdatastream_create';

export const MAX_WEBDATASTREAMS_PER_BATCH = 10;

// Date range offset days for Analytics 4 report requests.
export const DATE_RANGE_OFFSET = 1;

export const GTM_SCOPE = 'https://www.googleapis.com/auth/tagmanager.readonly';

export const ENHANCED_MEASUREMENT_FORM = 'enhanced-measurement-form';
export const ENHANCED_MEASUREMENT_ENABLED = 'enhanced-measurement-enabled';
export const ENHANCED_MEASUREMENT_SHOULD_DISMISS_ACTIVATION_BANNER =
	'enhanced-measurement-should-dismiss-activation-banner';

export const FORM_CUSTOM_DIMENSIONS_CREATE = 'analytics4CustomDimensionsCreate';

export const CUSTOM_DIMENSION_DEFINITIONS = {
	googlesitekit_post_date: {
		parameterName: 'googlesitekit_post_date',
		displayName: 'WordPress Post Creation Date',
		description: 'Created by Site Kit: Date when a post was created',
		scope: 'EVENT',
	},
	googlesitekit_post_author: {
		parameterName: 'googlesitekit_post_author',
		displayName: 'WordPress Post Author',
		description: 'Created by Site Kit: WordPress name of the post author',
		scope: 'EVENT',
	},
	googlesitekit_post_categories: {
		parameterName: 'googlesitekit_post_categories',
		displayName: 'WordPress Post Categories',
		description:
			'Created by Site Kit: Names of categories assigned to posts',
		scope: 'EVENT',
	},
	googlesitekit_post_type: {
		parameterName: 'googlesitekit_post_type',
		displayName: 'WordPress Post Type',
		description: 'Created by Site Kit: Content type of posts',
		scope: 'EVENT',
	},
};
