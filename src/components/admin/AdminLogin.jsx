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

		if (!password) {
			setError("Please enter your master passkey.");
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
		<div className="container-sm py-8">
			<div className="surface-card">
				<div style={{ textAlign: "center", marginBottom: "2rem" }}>
					<span className="overline mb-1">Curator Desk • Security Check</span>
					<h2 className="mb-2">Ledger Access</h2>
					<p
						className="caption text-secondary"
						style={{ maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}
					>
						{hasMasterPassword
							? "Enter the editorial passkey to manage projects, edit metadata, and publish changes to the live portfolio."
							: "No passkey is configured. Set VITE_ADMIN_PASSWORD_HASH in your .env file, then restart the dev server."}
					</p>
				</div>

				{error && (
					<div
						className="surface-card mb-4 text-error"
						style={{
							padding: "0.75rem 1rem",
							borderLeft: "4px solid #b71c1c",
						}}
					>
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="flex flex-col gap-4">
					<div className="form-group">
						<label htmlFor="admin-passkey" className="form-label">
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
									left: 12,
									color: "var(--color-text-secondary, #7d5d53)",
									pointerEvents: "none",
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
						className="btn btn-primary w-full mt-2"
					>
						{submitting ? "Verifying..." : "Unlock Curator Console"}
					</button>
				</form>
			</div>
		</div>
	);
}

AdminLogin.propTypes = {
	onAuthenticated: PropTypes.func,
};
