import { Close, Key } from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
	clearGitHubToken,
	getGitHubToken,
	setGitHubToken,
} from "@/utils/authUtils";

export default function GitHubTokenModal({ open, onClose, onTokenUpdated }) {
	const [token, setToken] = useState("");
	const [hasSavedToken, setHasSavedToken] = useState(false);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		if (open) {
			const existing = getGitHubToken();
			setToken(existing);
			setHasSavedToken(Boolean(existing));
			setMessage(null);
		}
	}, [open]);

	const handleSave = () => {
		if (!token.trim()) {
			clearGitHubToken();
			setHasSavedToken(false);
			setMessage({ type: "info", text: "GitHub token cleared." });
			if (onTokenUpdated) onTokenUpdated("");
			return;
		}

		setGitHubToken(token.trim());
		setHasSavedToken(true);
		setMessage({
			type: "success",
			text: "GitHub token saved securely in local storage.",
		});
		if (onTokenUpdated) onTokenUpdated(token.trim());
	};

	const handleClear = () => {
		clearGitHubToken();
		setToken("");
		setHasSavedToken(false);
		setMessage({ type: "info", text: "Token removed." });
		if (onTokenUpdated) onTokenUpdated("");
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					backgroundColor: "background.paper",
					border: 1,
					borderColor: "divider",
					backgroundImage: "none",
				},
			}}
		>
			<DialogTitle
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderBottom: 1,
					borderColor: "divider",
					py: 2,
				}}
			>
				<Box>
					<Typography
						variant="overline"
						sx={{
							color: "secondary.main",
							letterSpacing: "0.15em",
							fontWeight: 600,
						}}
					>
						Curator Dispatch Desk
					</Typography>
					<Typography
						variant="h6"
						component="div"
						sx={{
							fontFamily: "Newsreader, serif",
							fontWeight: 700,
							color: "text.primary",
						}}
					>
						GitHub Publication Token
					</Typography>
				</Box>
				<IconButton onClick={onClose} size="small" aria-label="Close">
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ py: 3 }}>
				{message && (
					<Alert severity={message.type} sx={{ mb: 2.5 }}>
						{message.text}
					</Alert>
				)}

				<Typography
					variant="body2"
					sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2.5 }}
				>
					To commit changes directly to the live repository (
					<strong>moodynooby/HOMEPAGE-NEXTGEN</strong>) via the GitHub Contents
					API, supply a Personal Access Token (classic with <code>repo</code>{" "}
					scope or fine-grained with repository{" "}
					<code>Contents: Read and write</code> permissions).
				</Typography>

				<TextField
					fullWidth
					label="GitHub Personal Access Token"
					type="password"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
					margin="normal"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Key fontSize="small" sx={{ color: "text.secondary" }} />
							</InputAdornment>
						),
					}}
					helperText="Token is stored strictly in your browser's local storage and transmitted only to api.github.com."
				/>

				<Box
					sx={{
						mt: 2,
						p: 2,
						backgroundColor: "background.default",
						border: 1,
						borderColor: "divider",
					}}
				>
					<Typography
						variant="caption"
						sx={{ display: "block", color: "text.secondary" }}
					>
						<strong>Autonomous Publication Note:</strong> When you commit from
						this desk, the change is committed directly to the <code>main</code>{" "}
						branch, triggering GitHub Actions to build and deploy your updated
						portfolio automatically.
					</Typography>
				</Box>
			</DialogContent>

			<DialogActions
				sx={{
					px: 3,
					py: 2,
					borderTop: 1,
					borderColor: "divider",
					backgroundColor: "background.default",
					justifyContent: "space-between",
				}}
			>
				{hasSavedToken ? (
					<Button onClick={handleClear} color="error" size="small">
						Clear Token
					</Button>
				) : (
					<div />
				)}
				<Box sx={{ display: "flex", gap: 1 }}>
					<Button onClick={onClose} sx={{ color: "text.secondary" }}>
						Close
					</Button>
					<Button
						variant="contained"
						onClick={handleSave}
						sx={{
							backgroundColor: "primary.main",
							color: "primary.contrastText",
							fontWeight: 600,
							"&:hover": { backgroundColor: "primary.dark" },
						}}
					>
						Save Token
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	);
}

GitHubTokenModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onTokenUpdated: PropTypes.func,
};
