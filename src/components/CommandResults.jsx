import { KBarResults, useMatches } from "kbar";

export default function CommandResults() {
	const { results } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div className="kbar-section-header">{item}</div>
				) : (
					<div className={`kbar-result-item ${active ? "active" : ""}`}>
						<div className="flex items-center gap-4">
							{item.icon && <span className="kbar-icon">{item.icon}</span>}
							<span className="font-body text-primary">{item.name}</span>
						</div>
						{item.shortcut?.length > 0 && (
							<div className="flex gap-1">
								{item.shortcut.map((sc) => (
									<span key={sc} className="kbd-sm">
										{sc}
									</span>
								))}
							</div>
						)}
					</div>
				)
			}
		/>
	);
}
