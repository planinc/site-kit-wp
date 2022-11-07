/**
 * SettingsModules component.
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

/**
 * External dependencies
 */
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import SettingsAdmin from './SettingsAdmin';
import SettingsActiveModules from './SettingsActiveModules';
import SettingsInactiveModules from './SettingsInactiveModules';
const { useSelect } = Data;

function SettingsModules() {
	const { path } = useRouteMatch();
	const modules = useSelect( ( select ) =>
		select( CORE_MODULES ).getModules()
	);

	if ( modules === undefined || ! Object.values( modules ).length ) {
		return null;
	}

	return (
		<Switch>
			{ /* Settings Module Routes */ }
			<Route path={ `${ path }/connected-services/:moduleSlug/:action` }>
				<SettingsActiveModules />
			</Route>
			<Route path={ `${ path }/connected-services/:moduleSlug` }>
				<SettingsActiveModules />
			</Route>
			<Route path={ `${ path }/connected-services` }>
				<SettingsActiveModules />
			</Route>
			<Route path={ `${ path }/connect-more-services` }>
				<SettingsInactiveModules />
			</Route>
			<Route path={ `${ path }/admin-settings` }>
				<SettingsAdmin />
			</Route>

			{ /* Redirects for routes that existed before React Router implementation. */ }
			<Redirect
				from="/settings/:moduleSlug/edit"
				to="/settings/connected-services/:moduleSlug/edit"
			/>
			<Redirect
				from="/settings/:moduleSlug"
				to="/settings/connected-services/:moduleSlug"
			/>
			<Redirect from="/settings" to="/settings/connected-services" />
			<Redirect from="/connect" to="/settings/connect-more-services" />
			<Redirect from="/admin" to="/settings/admin-settings" />

			{ /* Fallback to `/connected-services` route if no match found. */ }
			<Redirect to="/connected-services" />
		</Switch>
	);
}

export default SettingsModules;
