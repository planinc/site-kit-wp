export default function PreviewGraph( { title, GraphSVG } ) {
	return (
		<div className="googlesitekit-cta--graph">
			{ title }
			<div>
				<GraphSVG />
			</div>
		</div>
	);
}
