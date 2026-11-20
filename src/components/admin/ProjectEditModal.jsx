import { Star, Wand2, X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchGitHubRepoDetails } from "@/utils/githubUtils";
import { PROJECT_CATEGORIES } from "@/utils/projectCategories";

const CATEGORIES = [...PROJECT_CATEGORIES, "Other"];

const EMPTY_FORM = {
	githubName: "",
	tagline: "",
	category: "Web App",
	githubImg: "",
	githubContentPath: "",
	featured: false,
	addonId: "",
	chromeStatsId: "",
};

export default function ProjectEditModal({
	open,
	onClose,
	onSave,
	project,
	githubToken,
}) {
	const isEdit = Boolean(project?.githubName);

	const [formData, setFormData] = useState(EMPTY_FORM);
	const [fetchingGithub, setFetchingGithub] = useState(false);
	const [fetchMessage, setFetchMessage] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		setFormData(
			project
				? {
						...EMPTY_FORM,
						...project,
						addonId: project.addonId || "",
						chromeStatsId: project.chromeStatsId || "",
						featured: Boolean(project.featured),
					}
				: EMPTY_FORM,
		);
		setFetchMessage(null);
		setError("");
	}, [project]);

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAutoFetch = async () => {
		if (!formData.githubName.trim()) {
			setFetchMessage({
				type: "error",
				text: "Enter a repository name first (e.g. NotebookForge).",
			});
			return;
		}

		setFetchingGithub(true);
		setFetchMessage(null);

		try {
			const details = await fetchGitHubRepoDetails(
				formData.githubName.trim(),
				githubToken,
			);

			setFormData((prev) => ({
				...prev,
				githubName: details.name || prev.githubName,
				tagline: details.description || prev.tagline,
				githubContentPath: details.defaultReadmeUrl || prev.githubContentPath,
			}));

			setFetchMessage({
				type: "success",
				text: `Fetched info from GitHub! Default branch: ${details.defaultBranch}.`,
			});
		} catch (err) {
			setFetchMessage({
				type: "error",
				text:
					err.message ||
					"Failed to query GitHub repository. Check the name or provide a token.",
			});
		} finally {
			setFetchingGithub(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		if (!formData.githubName.trim()) {
			setError("GitHub repository name is required.");
			return;
		}
		if (!formData.tagline.trim()) {
			setError("A tagline is required for the monograph entry.");
			return;
		}
		if (!formData.category.trim()) {
			setError("Category is required.");
			return;
		}
		if (!formData.githubContentPath.trim()) {
			setError("A raw README URL (githubContentPath) is required.");
			return;
		}
		if (!formData.githubImg.trim()) {
			setError("A preview image URL is required.");
			return;
		}

		const cleanProject = {
			githubName: formData.githubName.trim(),
			tagline: formData.tagline.trim(),
			category: formData.category.trim(),
			githubImg: formData.githubImg.trim(),
			githubContentPath: formData.githubContentPath.trim(),
			featured: Boolean(formData.featured),
		};

		if (formData.addonId.trim()) {
			cleanProject.addonId = formData.addonId.trim();
		}
		if (formData.chromeStatsId.trim()) {
			cleanProject.chromeStatsId = formData.chromeStatsId.trim();
		}

		onSave(cleanProject);
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
			<div className="dialog-panel" style={{ maxWidth: 720 }}>
				<div className="dialog-header">
					<div>
						<span className="overline">Ledger Monograph Entry</span>
						<h3 className="mt-1">
							{isEdit
								? `Edit Entry: ${project.githubName}`
								: "New Project Monograph"}
						</h3>
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

				<form onSubmit={handleSubmit} noValidate>
					<div className="flex flex-col gap-4">
						{error && (
							<div
								className="surface-card text-error"
								style={{
									padding: "0.75rem 1rem",
									borderLeft: "4px solid #b71c1c",
								}}
							>
								{error}
							</div>
						)}

						{fetchMessage && (
							<div
								className="surface-card"
								style={{
									padding: "0.75rem 1rem",
									borderLeft: `4px solid ${fetchMessage.type === "success" ? "#2e7d32" : "#b71c1c"}`,
								}}
							>
								<p className="caption">{fetchMessage.text}</p>
							</div>
						)}

						{/* GitHub Sync Banner */}
						<div
							className="surface-card"
							style={{
								padding: "1rem",
								backgroundColor: "var(--color-background-body, #fdffda)",
							}}
						>
							<span className="overline mb-2">GitHub Repository Sync</span>
							<div className="flex gap-2 items-center flex-wrap">
								<div className="flex-1" style={{ minWidth: 240 }}>
									<input
										id="github-repo-name"
										value={formData.githubName}
										onChange={(e) => handleChange("githubName", e.target.value)}
										placeholder="e.g. NotebookForge or moodynooby/diet-logs"
										required
									/>
								</div>
								<button
									type="button"
									onClick={handleAutoFetch}
									disabled={fetchingGithub || !formData.githubName.trim()}
									className="btn btn-outline btn-sm"
								>
									{fetchingGithub ? (
										<span
											className="spinner"
											style={{ width: 14, height: 14 }}
										/>
									) : (
										<Wand2 size={14} />
									)}
									<span>
										{fetchingGithub ? "Fetching..." : "Auto-Fill Metadata"}
									</span>
								</button>
							</div>
						</div>

						{/* Category & Featured */}
						<div className="flex gap-4 items-center flex-wrap">
							<div className="form-group flex-1" style={{ minWidth: 200 }}>
								<label htmlFor="project-category" className="form-label">
									Category
								</label>
								<select
									id="project-category"
									value={formData.category}
									onChange={(e) => handleChange("category", e.target.value)}
								>
									{CATEGORIES.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>

							<div
								className="flex items-center gap-2"
								style={{ marginTop: "1.2rem" }}
							>
								<button
									type="button"
									onClick={() => handleChange("featured", !formData.featured)}
									className={`chip ${formData.featured ? "chip-active" : ""}`}
								>
									<Star
										size={14}
										fill={formData.featured ? "currentColor" : "none"}
									/>
									<span>Featured on Homepage</span>
								</button>
							</div>
						</div>

						{/* Tagline */}
						<div className="form-group">
							<label htmlFor="project-tagline" className="form-label">
								Tagline (Editorial Summary)
							</label>
							<textarea
								id="project-tagline"
								rows={2}
								value={formData.tagline}
								onChange={(e) => handleChange("tagline", e.target.value)}
								placeholder="One crisp, informative sentence describing what this project does."
								required
							/>
						</div>

						{/* Images & Paths */}
						<div className="flex gap-4 flex-wrap">
							<div className="form-group flex-1" style={{ minWidth: 240 }}>
								<label htmlFor="project-img" className="form-label">
									Logo / Thumbnail URL
								</label>
								<input
									id="project-img"
									value={formData.githubImg}
									onChange={(e) => handleChange("githubImg", e.target.value)}
									placeholder="https://... or /logo.png"
									required
								/>
							</div>

							<div className="form-group flex-1" style={{ minWidth: 240 }}>
								<label htmlFor="project-readme" className="form-label">
									Pinned README URL
								</label>
								<input
									id="project-readme"
									value={formData.githubContentPath}
									onChange={(e) =>
										handleChange("githubContentPath", e.target.value)
									}
									placeholder="https://raw.githubusercontent.com/.../main/README.md"
									required
								/>
							</div>
						</div>

						{/* Optional Extension IDs */}
						<div className="flex gap-4 flex-wrap">
							<div className="form-group flex-1" style={{ minWidth: 240 }}>
								<label htmlFor="project-addon-id" className="form-label">
									Firefox Add-on Slug (Optional)
								</label>
								<input
									id="project-addon-id"
									value={formData.addonId}
									onChange={(e) => handleChange("addonId", e.target.value)}
									placeholder="e.g. lean-dark-reader"
								/>
							</div>

							<div className="form-group flex-1" style={{ minWidth: 240 }}>
								<label htmlFor="project-chromestats-id" className="form-label">
									ChromeStats ID (Optional)
								</label>
								<input
									id="project-chromestats-id"
									value={formData.chromeStatsId}
									onChange={(e) =>
										handleChange("chromeStatsId", e.target.value)
									}
									placeholder="Extension ID or slug"
								/>
							</div>
						</div>
					</div>

					<div className="dialog-footer">
						<button
							type="button"
							onClick={onClose}
							className="btn btn-ghost btn-sm"
						>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary btn-sm">
							{isEdit ? "Update Ledger Entry" : "Add to Ledger"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

ProjectEditModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	project: PropTypes.shape({
		githubName: PropTypes.string,
		tagline: PropTypes.string,
		category: PropTypes.string,
		githubImg: PropTypes.string,
		githubContentPath: PropTypes.string,
		featured: PropTypes.bool,
		addonId: PropTypes.string,
		chromeStatsId: PropTypes.string,
	}),
	githubToken: PropTypes.string,
};
