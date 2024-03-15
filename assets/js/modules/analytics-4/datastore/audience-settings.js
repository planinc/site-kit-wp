/**
 * `modules/analytics-4` data store: audience settings.
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
import { isEqual, isPlainObject } from 'lodash';

/**
 * WordPress dependencies
 */
import { createRegistrySelector } from '@wordpress/data';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { MODULES_ANALYTICS_4 } from './constants';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';
import { createValidatedAction } from '../../../googlesitekit/data/utils';
import { createReducer } from '../../../googlesitekit/data/create-reducer';
import { actions as errorStoreActions } from '../../../googlesitekit/data/create-error-store';

const { receiveError, clearError } = errorStoreActions;

const validateAudienceSettings = ( settings ) => {
	invariant(
		isPlainObject( settings ),
		'Audience settings should be an object.'
	);
	invariant(
		Array.isArray( settings.configuredAudiences ),
		'Configured audiences should be an array.'
	);
	invariant(
		typeof settings.isAudienceSegmentationWidgetHidden === 'boolean',
		'Audience segmentation widget visibility should be a boolean.'
	);
};

const fetchStoreReducerCallback = createReducer(
	( state, audienceSettings ) => {
		if ( ! state.audienceSettings ) {
			state.audienceSettings = {};
		}

		state.audienceSettings.settings = audienceSettings;
		state.audienceSettings.savedSettings = audienceSettings;
	}
);

const fetchGetAudienceSettingsStore = createFetchStore( {
	baseName: 'getAudienceSettings',
	controlCallback() {
		return API.get(
			'modules',
			'analytics-4',
			'audience-settings',
			{},
			{
				useCache: false,
			}
		);
	},
	reducerCallback: fetchStoreReducerCallback,
} );

const fetchSaveAudienceSettingsStore = createFetchStore( {
	baseName: 'saveAudienceSettings',
	controlCallback: ( settings ) =>
		API.set( 'modules', 'analytics-4', 'audience-settings', { settings } ),
	reducerCallback: fetchStoreReducerCallback,
	argsToParams: ( settings ) => settings,
	validateParams: validateAudienceSettings,
} );

const baseInitialState = {
	audienceSettings: undefined,
};

const baseActions = {
	/**
	 * Saves the audience settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} settings Optional. By default, this saves whatever there is in the store. Use this object to save additional settings.
	 * @return {Object} Object with `response` and `error`.
	 */
	saveAudienceSettings: createValidatedAction(
		( settings = {} ) => {
			invariant(
				isPlainObject( settings ),
				'audience settings should be an object to save.'
			);
		},
		function* ( settings = {} ) {
			yield clearError( 'saveAudienceSettings', [] );

			const registry = yield Data.commonActions.getRegistry();
			const audienceSettings = registry
				.select( MODULES_ANALYTICS_4 )
				.getAudienceSettings();

			const { response, error } =
				yield fetchSaveAudienceSettingsStore.actions.fetchSaveAudienceSettings(
					{
						...audienceSettings,
						...settings,
					}
				);

			if ( error ) {
				yield receiveError( error, 'saveAudienceSettings', [] );
			}

			return { response, error };
		}
	),
};

const baseControls = {};

const baseReducer = ( state, { type } ) => {
	switch ( type ) {
		default: {
			return state;
		}
	}
};

const baseResolvers = {
	*getAudienceSettings() {
		const registry = yield Data.commonActions.getRegistry();

		const audienceSettings = registry
			.select( MODULES_ANALYTICS_4 )
			.getAudienceSettings();

		if ( audienceSettings === undefined ) {
			yield fetchGetAudienceSettingsStore.actions.fetchGetAudienceSettings();
		}
	},
};

const baseSelectors = {
	/**
	 * Gets the audience settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Object|undefined)} Audience settings; `undefined` if not loaded.
	 */
	getAudienceSettings( state ) {
		return state.audienceSettings?.settings;
	},

	/**
	 * Gets the configured audiences from the audience settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Array|undefined)} An array with configured audiences; `undefined` if not loaded.
	 */
	getConfiguredAudiences: createRegistrySelector( ( select ) => () => {
		const audienceSettings =
			select( MODULES_ANALYTICS_4 ).getAudienceSettings();

		return audienceSettings?.configuredAudiences;
	} ),

	/**
	 * Gets the audience segmentation widget visibility from the audience settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {(boolean|undefined)} Whether or not the audience segmentation widget is hidden; `undefined` if not loaded.
	 */
	isAudienceSegmentationWidgetHidden: createRegistrySelector(
		( select ) => () => {
			const audienceSettings =
				select( MODULES_ANALYTICS_4 ).getAudienceSettings();

			return audienceSettings?.isAudienceSegmentationWidgetHidden;
		}
	),

	/**
	 * Checks if the audience settings have changed from the saved settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state Data store's state.
	 * @return {boolean} True if settings have changed, otherwise false.
	 */
	haveConfiguredAudiencesChanged( state ) {
		const { settings, savedSettings } = state.audienceSettings || {};

		return ! isEqual( settings, savedSettings );
	},
};

const store = Data.combineStores(
	fetchGetAudienceSettingsStore,
	fetchSaveAudienceSettingsStore,
	{
		initialState: baseInitialState,
		actions: baseActions,
		controls: baseControls,
		reducer: baseReducer,
		resolvers: baseResolvers,
		selectors: baseSelectors,
	}
);

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
