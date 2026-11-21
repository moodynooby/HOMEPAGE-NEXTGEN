export default function ProjectsSkeleton() {
	return (
		<div
			style={{ minHeight: "60vh", padding: "4rem 0" }}
			role="status"
			aria-label="Loading projects"
		>
			<div className="editorial-container">
				<div
					className="skeleton"
					style={{ width: "40%", height: "64px", marginBottom: "4rem" }}
				/>
				{[1, 2, 3].map((item) => (
					<div
						key={item}
						style={{
							display: "flex",
							gap: "1.5rem",
							padding: "1.5rem 0",
							borderTop: "1px solid var(--color-border, var(--hairline-rule))",
						}}
					>
						<div
							className="skeleton"
							style={{ width: "88px", height: "88px", flexShrink: 0 }}
						/>
						<div
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								gap: "0.5rem",
							}}
						>
							<div
								className="skeleton"
								style={{ width: "30%", height: "1.25rem" }}
							/>
							<div
								className="skeleton"
								style={{ width: "70%", height: "1rem" }}
							/>
							<div
								className="skeleton"
								style={{ width: "22%", height: "0.875rem" }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
