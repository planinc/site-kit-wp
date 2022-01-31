import useActivateModuleCallback from '../../../../../hooks/useActivateModuleCallback';
import AnalyticsCTA from './AnalyticsCTA';
import CTAGraph from './CTAGraph';
import VisitorsGraph from '../../../../../../svg/graphics/cta-graph-visitors.svg';
import GoalsGraph from '../../../../../../svg/graphics/cta-graph-goals.svg';

export default function ActivateAnalyticsCTA() {
	const activateModuleCallback = useActivateModuleCallback( 'analytics' );

	if ( ! activateModuleCallback ) return null;

	return (
		<AnalyticsCTA
			title={
				<span>
					See how many people visit your site from Search and track
					how you’re achieving your goals:&nbsp;
					<b>install Google Analytics</b>.
				</span>
			}
			label="Set up Google Analytics"
			onClick={ activateModuleCallback }
			paneContent={
				<div className="googlesitekit-cta--activate-analytics">
					<CTAGraph
						title="Unique visitors from Search"
						GraphSVG={ VisitorsGraph }
					/>
					<CTAGraph title="Goals completed" GraphSVG={ GoalsGraph } />
				</div>
			}
		/>
	);
}
