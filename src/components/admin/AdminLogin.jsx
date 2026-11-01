import { Lock, VpnKey } from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Container,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { isPasswordSet, login, setMasterPassword } from "@/utils/authUtils";

export default function AdminLogin({ onAuthenticated }) {
	const hasMasterPassword = isPasswordSet();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		if (!password) {
			setError("Please enter your master passkey.");
			return;
		}

		setSubmitting(true);
		try {
			if (!hasMasterPassword) {
				if (password.length < 4) {
					setError("Password must be at least 4 characters.");
					setSubmitting(false);
					return;
				}
				if (password !== confirmPassword) {
					setError("Passwords do not match.");
					setSubmitting(false);
					return;
				}
				await setMasterPassword(password);
			}

			const valid = await login(password);
			if (valid) {
				if (onAuthenticated) onAuthenticated();
			} else {
				setError("Invalid passkey. Access denied.");
			}
		} catch (err) {
			setError(err.message || "Authentication failed.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Container maxWidth="sm" sx={{ py: { xs: 8, md: 14 } }}>
			<Card
				elevation={0}
				sx={{
					border: 1,
					borderColor: "divider",
					backgroundColor: "background.paper",
					p: { xs: 3, md: 5 },
				}}
			>
				<CardContent sx={{ p: 0 }}>
					<Box sx={{ textAlign: "center", mb: 4 }}>
						<Typography
							variant="overline"
							sx={{
								color: "secondary.main",
								letterSpacing: "0.15em",
								fontWeight: 600,
								display: "block",
								mb: 1,
							}}
						>
							Curator Desk • Security Check
						</Typography>
						<Typography
							variant="h4"
							component="h1"
							sx={{
								fontFamily: "Newsreader, serif",
								fontWeight: 700,
								color: "text.primary",
								mb: 1.5,
							}}
						>
							{hasMasterPassword
								? "Ledger Access"
								: "Initialize Curator Passkey"}
						</Typography>
						<Typography
							variant="body2"
							sx={{
								color: "text.secondary",
								maxWidth: 420,
								mx: "auto",
								lineHeight: 1.6,
							}}
						>
							{hasMasterPassword
								? "Enter the editorial passkey to manage projects, edit metadata, and publish changes to the live portfolio."
								: "No passkey is established yet. Set a private master password to protect editorial publication controls."}
						</Typography>
					</Box>

					{error && (
						<Alert
							severity="error"
							sx={{
								mb: 3,
								border: 1,
								borderColor: "error.light",
								backgroundColor: "transparent",
							}}
						>
							{error}
						</Alert>
					)}

					<Box component="form" onSubmit={handleLogin} noValidate>
						<TextField
							fullWidth
							label={hasMasterPassword ? "Master Passkey" : "Create Passkey"}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoFocus
							margin="normal"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock fontSize="small" sx={{ color: "text.secondary" }} />
									</InputAdornment>
								),
							}}
							placeholder="Enter passkey..."
							sx={{
								"& .MuiOutlinedInput-root": {
									"& fieldset": {
										borderColor: "divider",
									},
								},
							}}
						/>

						{!hasMasterPassword && (
							<TextField
								fullWidth
								label="Confirm Passkey"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								margin="normal"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<VpnKey
												fontSize="small"
												sx={{ color: "text.secondary" }}
											/>
										</InputAdornment>
									),
								}}
								placeholder="Repeat passkey..."
								sx={{
									"& .MuiOutlinedInput-root": {
										"& fieldset": {
											borderColor: "divider",
										},
									},
								}}
							/>
						)}

						<Button
							type="submit"
							fullWidth
							variant="contained"
							disabled={submitting}
							sx={{
								mt: 3,
								py: 1.25,
								backgroundColor: "primary.main",
								color: "primary.contrastText",
								fontWeight: 600,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								"&:hover": {
									backgroundColor: "primary.dark",
								},
							}}
						>
							{submitting
								? "Verifying..."
								: hasMasterPassword
									? "Unlock Curator Console"
									: "Set Passkey & Enter"}
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
}

AdminLogin.propTypes = {
	onAuthenticated: PropTypes.func,
};
