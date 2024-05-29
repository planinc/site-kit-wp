/**
 * `core/effects` data store: widgets info.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
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
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import { createReducer } from '../../../../js/googlesitekit/data/create-reducer';

const REGISTER_EFFECT = 'REGISTER_EFFECT';

export const initialState = {
	effects: {},
};

export const actions = {
	/**
	 * Registers an effect with a given slug and callback.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string}   slug   Widget's slug.
	 * @param {Function} effect Callback hook.
	 * @return {Object} Redux-style action.
	 */
	registerModuleEffect( slug, effect = {} ) {
		invariant( effect, 'effect is required.' );

		return {
			payload: {
				slug,
				effect,
			},
			type: REGISTER_EFFECT,
		};
	},
};

export const controls = {};

export const reducer = createReducer( ( state, { type, payload } ) => {
	switch ( type ) {
		case REGISTER_EFFECT: {
			const { slug, effect } = payload;

			if ( state.effects[ slug ] !== undefined ) {
				global.console.warn(
					`Could not register effect with slug "${ slug }". Effect "${ slug }" is already registered.`
				);

				return state;
			}

			state.effects[ slug ] = { effect, slug };
			return state;
		}

		default: {
			return state;
		}
	}
} );

export const resolvers = {};

export const selectors = {
	/**
	 * Returns all registered effects.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {Array} An ordered array of widgets for this area.
	 */
	getEffects( state ) {
		return Object.values( state.effects );
	},
};

export default {
	initialState,
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
};
