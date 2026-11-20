import { Key, X } from "lucide-react";
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

	if (!open) return null;

	return (
		<div
			className="dialog-backdrop"
			role="dialog"
			aria-modal="true"
			tabIndex={-1}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div className="dialog-panel" style={{ maxWidth: 560 }}>
				<div className="dialog-header">
					<div>
						<span className="overline">Curator Dispatch Desk</span>
						<h3 className="mt-1">GitHub Publication Token</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="btn btn-icon btn-ghost"
					>
						<X size={18} />
					</button>
				</div>

				<div className="flex flex-col gap-4">
					{message && (
						<div
							className="surface-card"
							style={{
								padding: "0.75rem 1rem",
								borderLeft: `4px solid ${message.type === "success" ? "#2e7d32" : "var(--color-accent, #7d5d53)"}`,
							}}
						>
							<p className="caption">{message.text}</p>
						</div>
					)}

					<p className="caption text-secondary" style={{ lineHeight: 1.6 }}>
						To commit changes directly to the live repository (
						<strong>moodynooby/HOMEPAGE-NEXTGEN</strong>) via the GitHub
						Contents API, supply a Personal Access Token (classic with{" "}
						<code>repo</code> scope or fine-grained with repository{" "}
						<code>Contents: Read and write</code> permissions).
					</p>

					<div className="form-group">
						<label htmlFor="github-token" className="form-label">
							GitHub Personal Access Token
						</label>
						<div
							style={{
								position: "relative",
								display: "flex",
								alignItems: "center",
							}}
						>
							<Key
								size={16}
								style={{
									position: "absolute",
									left: 12,
									color: "var(--color-text-secondary, #7d5d53)",
									pointerEvents: "none",
								}}
							/>
							<input
								id="github-token"
								type="password"
								value={token}
								onChange={(e) => setToken(e.target.value)}
								placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
								style={{ paddingLeft: "2.4rem" }}
							/>
						</div>
						<span
							className="caption text-secondary"
							style={{ fontSize: "0.7rem", marginTop: 4 }}
						>
							Token is stored strictly in your browser&apos;s local storage and
							transmitted only to api.github.com.
						</span>
					</div>

					<div
						className="surface-card"
						style={{
							padding: "0.85rem",
							backgroundColor: "var(--color-background-body, #fdffda)",
						}}
					>
						<p
							className="caption text-secondary"
							style={{ fontSize: "0.72rem" }}
						>
							<strong>Autonomous Publication Note:</strong> When you commit from
							this desk, the change is committed directly to the{" "}
							<code>main</code> branch, triggering GitHub Actions to build and
							deploy your updated portfolio automatically.
						</p>
					</div>
				</div>

				<div className="dialog-footer">
					{hasSavedToken ? (
						<button
							type="button"
							onClick={handleClear}
							className="btn btn-outline btn-sm text-error"
							style={{ marginRight: "auto" }}
						>
							Clear Token
						</button>
					) : (
						<div style={{ marginRight: "auto" }} />
					)}
					<button
						type="button"
						onClick={onClose}
						className="btn btn-ghost btn-sm"
					>
						Close
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="btn btn-primary btn-sm"
					>
						Save Token
					</button>
				</div>
			</div>
		</div>
	);
}

GitHubTokenModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onTokenUpdated: PropTypes.func,
};
