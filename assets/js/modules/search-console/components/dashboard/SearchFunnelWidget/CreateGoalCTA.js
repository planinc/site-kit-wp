import Data from 'googlesitekit-data';
import { CORE_SITE } from '../../../../../googlesitekit/datastore/site/constants';
import AnalyticsCTA from './AnalyticsCTA';
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
		<AnalyticsCTA
			title="Set up goals to track how well your site fullfils your business objectives"
			label="Create a new goal"
			href={ supportURL }
			paneContent={
				<CTAGraph title="Goals completed" GraphSVG={ GoalsGraph } />
			}
		/>
	);
}
