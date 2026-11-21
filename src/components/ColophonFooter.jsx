export default function ColophonFooter() {
	return (
		<footer
			style={{
				borderTop: "1px solid var(--color-border)",
				padding: "1.5rem 0",
				marginTop: "3rem",
			}}
		>
			<div className="editorial-container flex justify-between flex-wrap gap-2">
				<p className="editorial-meta">
					© {new Date().getFullYear()} Manas Doshi
				</p>
				<p className="editorial-meta">Set in Newsreader &amp; Noto Serif</p>
			</div>
		</footer>
	);
}
