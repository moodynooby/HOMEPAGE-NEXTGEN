import { Lock } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { isPasswordSet, login } from "@/utils/authUtils";

export default function AdminLogin({ onAuthenticated }) {
	const hasMasterPassword = isPasswordSet();
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		if (!password.trim()) {
			setError("Please enter a passkey.");
			return;
		}

		setSubmitting(true);
		try {
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
		<div
			className="editorial-container"
			style={{
				maxWidth: "480px",
				paddingTop: "6rem",
				paddingBottom: "6rem",
			}}
		>
			<div
				className="surface-card"
				style={{
					padding: "2.5rem",
					border: "1px solid var(--color-border)",
				}}
			>
				<div style={{ textAlign: "center", marginBottom: "2rem" }}>
					<p className="editorial-meta" style={{ marginBottom: "0.5rem" }}>
						Curator Console · Security Gate
					</p>
					<h2
						className="editorial-headline"
						style={{ fontSize: "2rem", margin: "0.25rem 0 0.75rem 0" }}
					>
						Ledger Access
					</h2>
					<p
						className="editorial-body text-secondary"
						style={{ fontSize: "0.875rem" }}
					>
						{hasMasterPassword
							? "Enter the editorial passkey to manage portfolio JSON data, projects, and the tech stack radar."
							: "No master hash is set. Enter any passphrase to unlock in development mode."}
					</p>
				</div>

				{error && (
					<div
						style={{
							padding: "0.75rem 1rem",
							marginBottom: "1.25rem",
							border: "1px solid var(--color-status-maintenance)",
							color: "var(--color-status-maintenance)",
							fontFamily: "var(--font-family-code)",
							fontSize: "0.8rem",
						}}
					>
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="admin-passkey"
							className="editorial-meta"
							style={{ display: "block", marginBottom: "0.4rem" }}
						>
							Master Passkey
						</label>
						<div
							style={{
								position: "relative",
								display: "flex",
								alignItems: "center",
							}}
						>
							<Lock
								size={16}
								style={{
									position: "absolute",
									left: "0.8rem",
									color: "var(--color-text-secondary)",
								}}
							/>
							<input
								id="admin-passkey"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter passkey..."
								style={{ paddingLeft: "2.4rem" }}
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={submitting}
						className="btn btn-primary"
						style={{ marginTop: "0.5rem", width: "100%" }}
					>
						{submitting ? "Verifying..." : "Unlock Curator Console"}
					</button>
				</form>
			</div>
		</div>
	);
}

AdminLogin.propTypes = {
	onAuthenticated: PropTypes.func.isRequired,
};
