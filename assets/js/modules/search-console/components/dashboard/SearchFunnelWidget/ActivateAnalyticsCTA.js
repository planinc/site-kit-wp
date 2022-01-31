/**
 * ActivateModule component.
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
import PropTypes from 'prop-types';

import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useActivateModuleCallback from '../../../../../hooks/useActivateModuleCallback';
import Button from '../../../../../components/Button';
import { Cell, Grid, Row } from '../../../../../material-components';
import VisitorsGraph from '../../../../../../svg/graphics/cta-graph-visitors.svg';
import GoalsGraph from '../../../../../../svg/graphics/cta-graph-goals.svg';

const CTAGraph = ( { title, GraphSVG } ) => (
	<div className="googlesitekit-cta__graph">
		{ title }
		<div>
			<GraphSVG />
		</div>
	</div>
);
export default function ActivateAnalyticsCTA() {
	const activateModuleCallback = useActivateModuleCallback( 'analytics' );

	if ( ! activateModuleCallback ) return null;

	const title = (
		<span>
			See how many people visit your site from Search and track how you’re
			achieving your goals: <b>install Google Analytics</b>.
		</span>
	);

	const buttonLabel = __( 'Set up Google Analytics', 'google-site-kit' );
	const onButtonClick = activateModuleCallback;

	const paneContent = (
		<div className="googlesitekit-cta__activate-analytics">
			<CTAGraph
				title="Unique visitors from Search"
				GraphSVG={ VisitorsGraph }
			/>
			<CTAGraph title="Goals completed" GraphSVG={ GoalsGraph } />
		</div>
	);

	const cellProps = {
		smSize: 4,
		mdSize: 8,
		lgSize: 6,
	};

	return (
		<Grid>
			<Row>
				<Cell { ...cellProps }>
					{ title }
					<Button
						className="mdc-button--cta"
						onClick={ onButtonClick }
					>
						{ buttonLabel }
					</Button>
				</Cell>
				<Cell { ...cellProps }>{ paneContent }</Cell>
			</Row>
		</Grid>
	);
}

ActivateAnalyticsCTA.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
};
