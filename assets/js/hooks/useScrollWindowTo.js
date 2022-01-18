import { useCallback } from '@wordpress/element';

import Data from 'googlesitekit-data';
import {
	CORE_UI,
	UI_IS_SCROLLING,
} from '../googlesitekit/datastore/ui/constants';
import { scrollTo } from '../util/scroll';
const { useDispatch } = Data;

export function useScrollWindowTo() {
	const { setValue } = useDispatch( CORE_UI );

	const scrollWindowTo = useCallback(
		( offset ) => {
			setValue( UI_IS_SCROLLING, true );

			scrollTo( offset, () => {
				// eslint-disable-next-line no-console
				console.log( 'FINISHED SCROLLING', offset );

				setValue( UI_IS_SCROLLING, false );
			} );
		},
		[ setValue ]
	);

	return scrollWindowTo;
}
