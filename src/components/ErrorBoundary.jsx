import PropTypes from "prop-types";
import { Component } from "react";

export default class ErrorBoundary extends Component {
	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Unhandled application error", { error, errorInfo });
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	handleReload = () => {
		window.location.reload();
	};

	render() {
		if (!this.state.hasError) return this.props.children;

		return (
			<div
				style={{
					minHeight: "60vh",
					display: "grid",
					placeItems: "center",
					padding: "0 1rem",
					background: "var(--color-background-body, #fdffda)",
				}}
			>
				<div style={{ maxWidth: "480px", width: "100%" }}>
					<div
						role="alert"
						style={{
							padding: "1rem",
							marginBottom: "1rem",
							background: "rgba(220, 38, 38, 0.08)",
							border: "1px solid rgba(220, 38, 38, 0.2)",
							color: "var(--color-text-primary, #38392e)",
							fontFamily:
								"var(--font-family-body, 'Noto Serif', Georgia, serif)",
						}}
					>
						Something went wrong while loading this page.
					</div>
					<p
						style={{
							fontFamily:
								"var(--font-family-body, 'Noto Serif', Georgia, serif)",
							color: "var(--color-text-secondary, #7d5d53)",
							fontSize: "0.875rem",
							marginBottom: "1.5rem",
							lineHeight: 1.5,
						}}
					>
						Try again first. If the problem persists, reload the page to fetch a
						fresh application bundle.
					</p>
					<div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
						<button
							type="button"
							onClick={this.handleRetry}
							style={{
								padding: "8px 16px",
								background: "var(--color-text-primary, #38392e)",
								color: "var(--color-background-body, #fdffda)",
								border: "none",
								cursor: "pointer",
								fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
								textTransform: "uppercase",
								fontSize: "0.75rem",
								letterSpacing: "0.1em",
								fontWeight: 600,
							}}
						>
							Try again
						</button>
						<button
							type="button"
							onClick={this.handleReload}
							style={{
								padding: "8px 16px",
								background: "transparent",
								border: "1px solid var(--color-border, rgba(56, 57, 46, 0.2))",
								color: "var(--color-text-primary, #38392e)",
								cursor: "pointer",
								fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
								textTransform: "uppercase",
								fontSize: "0.75rem",
								letterSpacing: "0.1em",
								fontWeight: 600,
							}}
						>
							Reload page
						</button>
					</div>
				</div>
			</div>
		);
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
};
