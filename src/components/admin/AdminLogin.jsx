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
				<div className="text-center mb-8">
					<span className="overline mb-1">Curator Desk • Security Check</span>
					<h2 className="mb-2">Ledger Access</h2>
					<p className="caption text-secondary mx-auto max-w-md">
						{hasMasterPassword
							? "Enter the editorial passkey to manage projects, edit metadata, and publish changes to the live portfolio."
							: "No passkey is configured. Set VITE_ADMIN_PASSWORD_HASH in your .env file, then restart the dev server."}
					</p>
				</div>

				{error && <div className="error-callout mb-4">{error}</div>}

				<form onSubmit={handleLogin} className="flex flex-col gap-4">
					<div className="form-group">
						<label htmlFor="admin-passkey" className="form-label">
							Master Passkey
						</label>
						<div className="relative flex items-center">
							<Lock size={16} className="input-leading-icon" />
							<input
								id="admin-passkey"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter passkey..."
								className="input-with-leading-icon"
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
