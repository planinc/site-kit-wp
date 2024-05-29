/**
 * WordPress dependencies
 */
import { useEffect, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_MODULES } from '../../../googlesitekit/modules/datastore/constants';
import { CORE_SITE } from '../../../googlesitekit/datastore/site/constants';
import { CORE_USER } from '../../../googlesitekit/datastore/user/constants';
import { CORE_FORMS } from '../../../googlesitekit/datastore/forms/constants';
import {
	EDIT_SCOPE,
	FORM_CUSTOM_DIMENSIONS_CREATE,
	MODULES_ANALYTICS_4,
} from '../datastore/constants';

const { useSelect, useDispatch } = Data;

export default function useCreateCustomDimensionsEffect() {
	const isKeyMetricsSetupCompleted = useSelect( ( select ) =>
		select( CORE_SITE ).isKeyMetricsSetupCompleted()
	);

	const isGA4Connected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'analytics-4' )
	);

	const hasAnalyticsEditScope = useSelect( ( select ) =>
		select( CORE_USER ).hasScope( EDIT_SCOPE )
	);

	const autoSubmit = useSelect( ( select ) =>
		select( CORE_FORMS ).getValue(
			FORM_CUSTOM_DIMENSIONS_CREATE,
			'autoSubmit'
		)
	);

	const { createCustomDimensions } = useDispatch( MODULES_ANALYTICS_4 );
	const { setValues } = useDispatch( CORE_FORMS );

	const createDimensionsAndUpdateForm = useCallback( async () => {
		await createCustomDimensions();
		setValues( FORM_CUSTOM_DIMENSIONS_CREATE, {
			isAutoCreatingCustomDimensions: false,
		} );
	}, [ createCustomDimensions, setValues ] );

	useEffect( () => {
		if (
			isKeyMetricsSetupCompleted &&
			isGA4Connected &&
			hasAnalyticsEditScope &&
			autoSubmit
		) {
			setValues( FORM_CUSTOM_DIMENSIONS_CREATE, {
				autoSubmit: false,
				isAutoCreatingCustomDimensions: true,
			} );
			createDimensionsAndUpdateForm();
		}
	}, [
		autoSubmit,
		createCustomDimensions,
		hasAnalyticsEditScope,
		isKeyMetricsSetupCompleted,
		isGA4Connected,
		setValues,
		createDimensionsAndUpdateForm,
	] );
}
