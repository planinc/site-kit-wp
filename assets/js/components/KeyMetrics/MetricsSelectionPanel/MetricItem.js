/**
 * Key Metrics Selection Panel MetricItem
 *
 * Site Kit by Google, Copyright 2023 Google LLC
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useCallback, Fragment } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import PanelItem from '../../SelectionPanel/PanelItem';
import { CORE_FORMS } from '../../../googlesitekit/datastore/forms/constants';
import { KEY_METRICS_SELECTED, KEY_METRICS_SELECTION_FORM } from '../constants';
const { useSelect, useDispatch } = Data;

export default function MetricItem( {
	id,
	slug,
	title,
	subtitle,
	description,
	disconnectedModules,
	savedMetric,
} ) {
	const selectedMetrics = useSelect( ( select ) =>
		select( CORE_FORMS ).getValue(
			KEY_METRICS_SELECTION_FORM,
			KEY_METRICS_SELECTED
		)
	);

	const { getValue } = useSelect( ( select ) => select( CORE_FORMS ) );
	const { setValues } = useDispatch( CORE_FORMS );

	const onCheckboxChange = useCallback(
		( event ) => {
			const metrics = getValue(
				KEY_METRICS_SELECTION_FORM,
				KEY_METRICS_SELECTED
			);
			setValues( KEY_METRICS_SELECTION_FORM, {
				[ KEY_METRICS_SELECTED ]: event.target.checked
					? metrics.concat( [ slug ] )
					: metrics.filter(
							( selectedMetric ) => selectedMetric !== slug
					  ),
			} );
		},
		[ getValue, setValues, slug ]
	);

	const isMetricSelected = selectedMetrics?.includes( slug );
	const isMetricDisabled = ! savedMetric && disconnectedModules.length > 0;

	function Description() {
		return (
			<Fragment>
				{ subtitle && (
					<div className="mdc-panel-checkbox-subtitle">
						{ subtitle }
					</div>
				) }
				{ description && (
					<div className="mdc-panel-checkbox-description">
						{ description }
					</div>
				) }
				{ disconnectedModules.length > 0 && (
					<div className="googlesitekit-km-selection-panel-metrics__metric-item-error">
						{ sprintf(
							/* translators: %s: module names. */
							_n(
								'%s is disconnected, no data to show',
								'%s are disconnected, no data to show',
								disconnectedModules.length,
								'google-site-kit'
							),
							disconnectedModules.join(
								__( ' and ', 'google-site-kit' )
							)
						) }
					</div>
				) }
			</Fragment>
		);
	}

	return (
		<div className="googlesitekit-km-selection-panel-metrics__metric-item">
			<PanelItem
				title={ title }
				slug={ slug }
				id={ id }
				description={ <Description /> }
				onChange={ onCheckboxChange }
				suffix={ null }
				checked={ isMetricSelected }
				disabled={ isMetricDisabled }
			/>
		</div>
	);
}

MetricItem.propTypes = {
	id: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	disconnectedModules: PropTypes.array,
	savedMetric: PropTypes.bool,
};
