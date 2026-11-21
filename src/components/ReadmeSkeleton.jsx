export default function ReadmeSkeleton() {
	return (
		<div
			style={{ padding: "1rem 0" }}
			role="status"
			aria-label="Loading project documentation"
		>
			<div
				className="skeleton"
				style={{ height: "40px", width: "50%", marginBottom: "1rem" }}
			/>
			<div
				className="skeleton"
				style={{ height: "18px", marginBottom: "0.5rem" }}
			/>
			<div
				className="skeleton"
				style={{ height: "18px", marginBottom: "0.5rem" }}
			/>
			<div
				className="skeleton"
				style={{ height: "18px", width: "70%", marginBottom: "2rem" }}
			/>
			<div
				className="skeleton"
				style={{ height: "30px", width: "40%", marginBottom: "1rem" }}
			/>
			<div
				className="skeleton"
				style={{ height: "18px", marginBottom: "0.5rem" }}
			/>
			<div className="skeleton" style={{ height: "18px", width: "85%" }} />
		</div>
	);
}
