import { Alert, Box, Button, Container, Typography } from "@mui/material";
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
			<Box
				sx={{
					minHeight: "60vh",
					display: "grid",
					placeItems: "center",
					px: 2,
				}}
			>
				<Container maxWidth="sm">
					<Alert severity="error" sx={{ mb: 2 }}>
						Something went wrong while loading this page.
					</Alert>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
						Try again first. If the problem persists, reload the page to fetch a
						fresh application bundle.
					</Typography>
					<Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
						<Button variant="contained" onClick={this.handleRetry}>
							Try again
						</Button>
						<Button variant="outlined" onClick={this.handleReload}>
							Reload page
						</Button>
					</Box>
				</Container>
			</Box>
		);
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,
};
