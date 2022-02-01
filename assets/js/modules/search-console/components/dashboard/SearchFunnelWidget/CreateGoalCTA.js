import Data from 'googlesitekit-data';
import { CORE_SITE } from '../../../../../googlesitekit/datastore/site/constants';
import Button from '../../../../../components/Button';
import CTAGraph from './CTAGraph';
import GoalsGraph from '../../../../../../svg/graphics/cta-graph-goals.svg';
const { useSelect } = Data;

export default function CreateGoalCTA() {
	const supportURL = useSelect( ( select ) =>
		select( CORE_SITE ).getGoogleSupportURL( {
			path: '/analytics/answer/1032415',
			hash: 'create_or_edit_goals',
		} )
	);

	return (
		<div className="googlesitekit-cta--analytics googlesitekit-cta--analytics--half">
			<div>
				Set up goals to track how well your site fullfils your business
				objectives
				<Button
					className="mdc-button--cta"
					href={ supportURL }
					target="_blank"
				>
					Create a new goal
				</Button>
			</div>
			<div>
				<CTAGraph title="Goals completed" GraphSVG={ GoalsGraph } />
			</div>
		</div>
	);
}
