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
			<div className="error-boundary-screen">
				<div className="error-boundary-card">
					<div role="alert" className="error-alert mb-4">
						Something went wrong while loading this page.
					</div>
					<p className="caption text-secondary mb-6">
						Try again first. If the problem persists, reload the page to fetch a
						fresh application bundle.
					</p>
					<div className="flex gap-3 flex-wrap">
						<button
							type="button"
							onClick={this.handleRetry}
							className="btn btn-primary"
						>
							Try again
						</button>
						<button
							type="button"
							onClick={this.handleReload}
							className="btn btn-outline"
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
