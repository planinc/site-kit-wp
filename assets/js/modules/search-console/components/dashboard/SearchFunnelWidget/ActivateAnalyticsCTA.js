import useActivateModuleCallback from '../../../../../hooks/useActivateModuleCallback';
import Button from '../../../../../components/Button';
import PreviewGraph from './PreviewGraph';
import VisitorsGraph from '../../../../../../svg/graphics/cta-graph-visitors.svg';
import GoalsGraph from '../../../../../../svg/graphics/cta-graph-goals.svg';

export default function ActivateAnalyticsCTA() {
	const activateModuleCallback = useActivateModuleCallback( 'analytics' );

	if ( ! activateModuleCallback ) return null;

	return (
		<div className="googlesitekit-cta--analytics googlesitekit-cta--analytics--full">
			<div>
				<span>
					See how many people visit your site from Search and track
					how you’re achieving your goals:&nbsp;
					<b>install Google Analytics</b>.
				</span>
				<Button
					className="mdc-button--cta"
					onClick={ activateModuleCallback }
				>
					Set up Google Analytics
				</Button>
			</div>
			<div>
				<div className="googlesitekit-cta--activate-analytics">
					<PreviewGraph
						title="Unique visitors from Search"
						GraphSVG={ VisitorsGraph }
					/>
					<PreviewGraph
						title="Goals completed"
						GraphSVG={ GoalsGraph }
					/>
				</div>
			</div>
		</div>
	);
}
