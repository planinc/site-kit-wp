import classnames from 'classnames';

import Button from '../../../../../components/Button';

export const SIZE = {
	FULL: 'full',
	HALF: 'half',
};

export default function AnalyticsCTA( {
	title,
	label,
	onClick,
	paneContent,
	size = SIZE.FULL,
} ) {
	return (
		<div
			className={ classnames( 'googlesitekit-cta--analytics', {
				'googlesitekit-cta--analytics--full': size === SIZE.FULL,
				'googlesitekit-cta--analytics--half': size === SIZE.HALF,
			} ) }
		>
			<div>
				{ title }
				<Button className="mdc-button--cta" onClick={ onClick }>
					{ label }
				</Button>
			</div>
			<div>{ paneContent }</div>
		</div>
	);
}
