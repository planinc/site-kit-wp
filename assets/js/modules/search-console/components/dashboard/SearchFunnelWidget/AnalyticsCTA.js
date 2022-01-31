import Button from '../../../../../components/Button';
import { Cell, Grid, Row } from '../../../../../material-components';

export default function AnalyticsCTA( { title, label, onClick, paneContent } ) {
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
					<Button className="mdc-button--cta" onClick={ onClick }>
						{ label }
					</Button>
				</Cell>
				<Cell { ...cellProps }>{ paneContent }</Cell>
			</Row>
		</Grid>
	);
}
