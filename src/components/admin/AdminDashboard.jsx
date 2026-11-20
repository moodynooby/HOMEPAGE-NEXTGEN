import {
	Plus as Add,
	ArrowDown as ArrowDownward,
	ArrowRight as ArrowForward,
	ArrowUp as ArrowUpward,
	CloudUpload,
	Trash2 as Delete,
	Download,
	Edit,
	LogOut as Logout,
	RefreshCw as Refresh,
	Search,
	Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import ProjectEditModal from "@/components/admin/ProjectEditModal";
import defaultProjects from "@/content/projects.json";
import { getGitHubToken, isAuthenticated, logout } from "@/utils/authUtils";
import {
	commitProjectsToGitHub,
	exportProjectsJson,
} from "@/utils/githubUtils";
import { orderCategories } from "@/utils/projectCategories";
import { socialIcons } from "@/utils/socialIcons";

const GitHub = socialIcons.GitHub;

const DRAFT_STORAGE_KEY = "editorial_admin_draft_projects";

export default function AdminDashboard() {
	const [isAuthed, setIsAuthed] = useState(() => isAuthenticated());
	// GitHub token is read from VITE_GITHUB_TOKEN env var — never from localStorage.
	const githubToken = getGitHubToken();
	const [projects, setProjects] = useState(() => {
		try {
			const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed;
				}
			}
		} catch {}
		return defaultProjects;
	});

	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All");

	const [editModalState, setEditModalState] = useState({
		open: false,
		project: null,
		index: null,
	});
	const [deleteConfirmState, setDeleteConfirmState] = useState({
		open: false,
		index: null,
		project: null,
	});
	const [publishModalOpen, setPublishModalOpen] = useState(false);
	const [commitMessage, setCommitMessage] = useState(
		"chore(content): update projects ledger via Curator Admin",
	);
	const [publishing, setPublishing] = useState(false);
	const [publishResult, setPublishResult] = useState(null);

	const [toast, setToast] = useState({
		open: false,
		message: "",
		severity: "info",
	});

	useEffect(() => {
		try {
			localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(projects));
		} catch {}
	}, [projects]);

	const categories = useMemo(() => {
		const raw = [...new Set(projects.map((p) => p.category).filter(Boolean))];
		return ["All", ...orderCategories(raw)];
	}, [projects]);

	const filteredProjects = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return projects
			.map((project, originalIndex) => ({ project, originalIndex }))
			.filter(({ project }) => {
				const matchesCategory =
					categoryFilter === "All" || project.category === categoryFilter;
				if (!matchesCategory) return false;

				if (!query) return true;
				return (
					project.githubName?.toLowerCase().includes(query) ||
					project.tagline?.toLowerCase().includes(query) ||
					project.category?.toLowerCase().includes(query)
				);
			});
	}, [projects, searchQuery, categoryFilter]);

	const showToast = (message, severity = "info") => {
		setToast({ open: true, message, severity });
		setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 4000);
	};

	const handleLogout = () => {
		logout();
		setIsAuthed(false);
	};

	const handleSaveProject = (savedProject) => {
		setProjects((prev) => {
			if (editModalState.index !== null && editModalState.index >= 0) {
				const next = [...prev];
				next[editModalState.index] = savedProject;
				return next;
			}
			return [savedProject, ...prev];
		});

		showToast(
			editModalState.index !== null
				? `Updated monograph "${savedProject.githubName}".`
				: `Created monograph "${savedProject.githubName}".`,
			"success",
		);
	};

	const confirmDelete = () => {
		const { index, project } = deleteConfirmState;
		if (index !== null) {
			setProjects((prev) => prev.filter((_, i) => i !== index));
			showToast(`Removed "${project?.githubName}" from the ledger.`, "info");
		}
		setDeleteConfirmState({ open: false, index: null, project: null });
	};

	const handleMove = (fromIndex, toIndex) => {
		if (toIndex < 0 || toIndex >= projects.length) return;
		setProjects((prev) => {
			const next = [...prev];
			const [item] = next.splice(fromIndex, 1);
			next.splice(toIndex, 0, item);
			return next;
		});
	};

	const handleToggleFeatured = (index) => {
		setProjects((prev) => {
			const next = [...prev];
			next[index] = { ...next[index], featured: !next[index].featured };
			return next;
		});
	};

	const handleResetToDefault = () => {
		if (
			window.confirm(
				"Reset all changes and restore original repository projects data?",
			)
		) {
			localStorage.removeItem(DRAFT_STORAGE_KEY);
			setProjects(defaultProjects);
			showToast("Reset ledger to default repository data.", "info");
		}
	};

	const handlePublish = async () => {
		if (!githubToken) {
			setPublishModalOpen(false);
			showToast(
				"VITE_GITHUB_TOKEN is not set in your .env file. Add it to enable direct publishing.",
				"warning",
			);
			return;
		}

		setPublishing(true);
		setPublishResult(null);

		try {
			const result = await commitProjectsToGitHub({
				token: githubToken,
				projects,
				commitMessage: commitMessage.trim(),
			});

			setPublishResult({
				success: true,
				commitSha: result.commitSha,
				commitUrl: result.commitUrl,
			});
			showToast("Successfully committed changes to GitHub!", "success");
		} catch (err) {
			setPublishResult({
				success: false,
				error: err.message || "Failed to commit changes to GitHub.",
			});
		} finally {
			setPublishing(false);
		}
	};

	if (!isAuthed) {
		return <AdminLogin onAuthenticated={() => setIsAuthed(true)} />;
	}

	return (
		<div style={{ minHeight: "100vh", paddingBottom: "5rem" }}>
			<div
				style={{
					borderBottom: "1px solid var(--color-border, var(--hairline-rule))",
					background: "var(--color-background-surface, #fdffda)",
					padding: "1.5rem 0",
				}}
			>
				<div className="editorial-container">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: "1rem",
						}}
					>
						<div>
							<span
								className="editorial-meta"
								style={{
									color: "var(--color-accent, #7d5d53)",
									display: "block",
									marginBottom: "0.25rem",
								}}
							>
								Curator Archive Ledger • Administration
							</span>
							<h1
								className="editorial-headline"
								style={{ margin: 0, fontSize: "2rem" }}
							>
								Monograph Curator Desk
							</h1>
						</div>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.75rem",
								flexWrap: "wrap",
							}}
						>
							<RouterLink to="/projects" className="btn btn-outlined btn-sm">
								View Public Ledger
							</RouterLink>

							<span
								className="editorial-meta"
								title={
									githubToken
										? "VITE_GITHUB_TOKEN is set — publishing enabled"
										: "Set VITE_GITHUB_TOKEN in .env to enable direct publishing"
								}
								style={{ opacity: githubToken ? 1 : 0.5 }}
							>
								{githubToken ? "GH TOKEN ✓" : "GH TOKEN —"}
							</span>

							<button
								type="button"
								className="btn btn-outlined btn-sm"
								onClick={() => exportProjectsJson(projects)}
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "4px",
								}}
							>
								<Download size={14} />
								<span>Export JSON</span>
							</button>

							<button
								type="button"
								onClick={handleLogout}
								aria-label="Logout"
								title="Lock Curator Console"
								className="icon-btn"
							>
								<Logout size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="editorial-container" style={{ marginTop: "2.5rem" }}>
				{!githubToken && (
					<div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
						<code>VITE_GITHUB_TOKEN</code> is not set in your <code>.env</code>{" "}
						file. You can still edit projects and export JSON locally. To push
						directly to the live repository, add the token to your{" "}
						<code>.env</code> and restart the dev server.
					</div>
				)}

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<div
						style={{
							display: "flex",
							gap: "0.75rem",
							alignItems: "center",
							flexWrap: "wrap",
						}}
					>
						<button
							type="button"
							className="btn btn-contained btn-sm"
							onClick={() =>
								setEditModalState({ open: true, project: null, index: null })
							}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<Add size={16} />
							<span>New Project</span>
						</button>

						<button
							type="button"
							className="btn btn-contained btn-sm"
							onClick={() => {
								setPublishResult(null);
								setPublishModalOpen(true);
							}}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
								background: "var(--color-accent, #7d5d53)",
							}}
						>
							<CloudUpload size={16} />
							<span>Publish to GitHub</span>
						</button>

						<button
							type="button"
							className="btn btn-outlined btn-sm"
							onClick={handleResetToDefault}
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
							}}
						>
							<Refresh size={14} />
							<span>Reset Draft</span>
						</button>
					</div>

					<div
						style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
					>
						<div style={{ position: "relative", minWidth: "200px" }}>
							<Search
								size={14}
								style={{
									position: "absolute",
									left: "10px",
									top: "50%",
									transform: "translateY(-50%)",
									color: "var(--color-text-secondary, #7d5d53)",
									pointerEvents: "none",
								}}
							/>
							<input
								type="search"
								placeholder="Filter ledger..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="input"
								style={{ paddingLeft: "32px", width: "100%" }}
							/>
						</div>

						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className="select"
							style={{ minWidth: "150px" }}
						>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="table-container">
					<table className="table" aria-label="Projects Curator Ledger">
						<thead>
							<tr>
								<th style={{ width: 60 }}>#</th>
								<th style={{ width: 70 }}>Order</th>
								<th style={{ width: 60 }}>Mark</th>
								<th>Project &amp; Tagline</th>
								<th style={{ width: 150 }}>Category</th>
								<th style={{ width: 90 }}>Addon ID</th>
								<th style={{ width: 100, textAlign: "right" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredProjects.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										style={{ textAlign: "center", padding: "3rem" }}
									>
										No monographs match current filters.
									</td>
								</tr>
							) : (
								filteredProjects.map(({ project: p, originalIndex: index }) => {
									const isFirst = index === 0;
									const isLast = index === projects.length - 1;

									return (
										<tr key={p.githubName}>
											<td
												style={{
													fontFamily: "monospace",
													fontSize: "0.78rem",
												}}
											>
												{String(index + 1).padStart(2, "0")}
											</td>
											<td>
												<div style={{ display: "flex", gap: "2px" }}>
													<button
														type="button"
														disabled={isFirst}
														onClick={() => handleMove(index, index - 1)}
														aria-label={`Move ${p.githubName} up`}
														className="icon-btn"
														style={{
															opacity: isFirst ? 0.3 : 1,
															cursor: isFirst ? "default" : "pointer",
														}}
													>
														<ArrowUpward size={14} />
													</button>
													<button
														type="button"
														disabled={isLast}
														onClick={() => handleMove(index, index + 1)}
														aria-label={`Move ${p.githubName} down`}
														className="icon-btn"
														style={{
															opacity: isLast ? 0.3 : 1,
															cursor: isLast ? "default" : "pointer",
														}}
													>
														<ArrowDownward size={14} />
													</button>
												</div>
											</td>
											<td>
												<button
													type="button"
													onClick={() => handleToggleFeatured(index)}
													aria-label={
														p.featured
															? `Unmark ${p.githubName} as featured`
															: `Mark ${p.githubName} as featured`
													}
													className="icon-btn"
												>
													{p.featured ? (
														<Star
															size={16}
															fill="var(--color-accent, #7d5d53)"
														/>
													) : (
														<StarBorder size={16} />
													)}
												</button>
											</td>
											<td>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "0.75rem",
													}}
												>
													<div
														style={{
															width: 32,
															height: 32,
															flexShrink: 0,
															border:
																"1px solid var(--color-border, var(--hairline-rule))",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															padding: 2,
															background:
																"var(--color-background-surface, #fdffda)",
														}}
													>
														<img
															src={p.githubImg}
															alt=""
															style={{
																maxWidth: "100%",
																maxHeight: "100%",
																objectFit: "contain",
															}}
														/>
													</div>
													<div>
														<div
															style={{
																fontWeight: 600,
																fontFamily:
																	"var(--font-family-heading, 'Newsreader', serif)",
																fontSize: "1rem",
															}}
														>
															{p.githubName}
														</div>
														<div
															style={{
																fontSize: "0.78rem",
																color: "var(--color-text-secondary, #7d5d53)",
																maxWidth: "400px",
																overflow: "hidden",
																textOverflow: "ellipsis",
																whiteSpace: "nowrap",
															}}
														>
															{p.tagline}
														</div>
													</div>
												</div>
											</td>
											<td>
												<span className="chip chip-sm">{p.category}</span>
											</td>
											<td>
												{p.addonId ? (
													<span
														style={{
															fontSize: "0.75rem",
															fontFamily: "monospace",
														}}
													>
														{p.addonId}
													</span>
												) : (
													<span style={{ opacity: 0.4 }}>—</span>
												)}
											</td>
											<td style={{ textAlign: "right" }}>
												<div
													style={{
														display: "flex",
														justifyContent: "flex-end",
														gap: "4px",
													}}
												>
													<button
														type="button"
														onClick={() =>
															setEditModalState({
																open: true,
																project: p,
																index,
															})
														}
														aria-label={`Edit ${p.githubName}`}
														className="icon-btn"
													>
														<Edit size={14} />
													</button>
													<button
														type="button"
														onClick={() =>
															setDeleteConfirmState({
																open: true,
																index,
																project: p,
															})
														}
														aria-label={`Delete ${p.githubName}`}
														className="icon-btn"
														style={{ color: "#ef4444" }}
													>
														<Delete size={14} />
													</button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>

					<div
						style={{
							padding: "0.75rem 1rem",
							borderTop: "1px solid var(--color-border, var(--hairline-rule))",
							background: "var(--color-background-surface, #fdffda)",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<span className="editorial-meta">
							LEDGER CATALOG: {projects.length} MONOGRAPHS (
							{projects.filter((p) => p.featured).length} FEATURED)
						</span>
						<span className="editorial-meta">
							DRAFT AUTO-SAVED TO LOCAL STORAGE
						</span>
					</div>
				</div>
			</div>

			<ProjectEditModal
				open={editModalState.open}
				project={editModalState.project}
				githubToken={githubToken}
				onClose={() =>
					setEditModalState({ open: false, project: null, index: null })
				}
				onSave={handleSaveProject}
			/>

			{/* Delete Confirm Modal */}
			{deleteConfirmState.open && (
				<div
					className="modal-backdrop"
					role="presentation"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setDeleteConfirmState({
								open: false,
								index: null,
								project: null,
							});
						}
					}}
				>
					<div
						className="modal-panel"
						role="dialog"
						aria-modal="true"
						tabIndex={-1}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								setDeleteConfirmState({
									open: false,
									index: null,
									project: null,
								});
							}
						}}
						style={{ maxWidth: "440px" }}
					>
						<div className="dialog-header">
							<h3 className="editorial-card-title" style={{ margin: 0 }}>
								Confirm Removal
							</h3>
						</div>
						<p className="editorial-body" style={{ margin: "1rem 0" }}>
							Are you sure you want to remove{" "}
							<strong>{deleteConfirmState.project?.githubName}</strong> from the
							monograph ledger?
						</p>
						<div className="dialog-footer">
							<button
								type="button"
								className="btn btn-outlined btn-sm"
								onClick={() =>
									setDeleteConfirmState({
										open: false,
										index: null,
										project: null,
									})
								}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-contained btn-sm"
								onClick={confirmDelete}
								style={{ background: "#ef4444" }}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Publish Modal */}
			{publishModalOpen && (
				<div
					className="modal-backdrop"
					role="presentation"
					onClick={(e) => {
						if (!publishing && e.target === e.currentTarget) {
							setPublishModalOpen(false);
						}
					}}
				>
					<div
						className="modal-panel"
						role="dialog"
						aria-modal="true"
						tabIndex={-1}
						onKeyDown={(e) => {
							if (!publishing && e.key === "Escape") setPublishModalOpen(false);
						}}
						style={{ maxWidth: "520px" }}
					>
						<div className="dialog-header">
							<h3 className="editorial-card-title" style={{ margin: 0 }}>
								Publish Ledger to GitHub
							</h3>
						</div>

						<div style={{ padding: "1rem 0" }}>
							{publishResult ? (
								publishResult.success ? (
									<div style={{ textAlign: "center" }}>
										<div
											className="alert alert-success"
											style={{ marginBottom: "1rem" }}
										>
											Publication successfully committed to <code>main</code>!
										</div>
										<p
											className="editorial-body"
											style={{ marginBottom: "1rem" }}
										>
											Commit SHA:{" "}
											<code>{publishResult.commitSha.slice(0, 7)}</code>
										</p>
										{publishResult.commitUrl && (
											<a
												href={publishResult.commitUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="btn btn-outlined btn-sm"
												style={{
													display: "inline-flex",
													alignItems: "center",
													gap: "4px",
												}}
											>
												<span>View Commit on GitHub</span>
												<ArrowForward size={14} />
											</a>
										)}
										<p
											className="editorial-meta"
											style={{ marginTop: "1.5rem" }}
										>
											GitHub Pages / Actions will build and deploy the update
											automatically.
										</p>
									</div>
								) : (
									<div className="alert alert-error">{publishResult.error}</div>
								)
							) : (
								<div>
									<p
										className="editorial-body"
										style={{
											marginBottom: "1rem",
											color: "var(--color-text-secondary, #7d5d53)",
										}}
									>
										You are about to commit {projects.length} project monographs
										to <strong>src/content/projects.json</strong> on branch{" "}
										<strong>main</strong>.
									</p>

									<label
										htmlFor="commit-msg-input"
										className="editorial-meta"
										style={{ display: "block", marginBottom: "0.25rem" }}
									>
										Commit Message
									</label>
									<input
										id="commit-msg-input"
										type="text"
										className="input"
										value={commitMessage}
										onChange={(e) => setCommitMessage(e.target.value)}
										style={{ width: "100%" }}
									/>
								</div>
							)}
						</div>

						<div className="dialog-footer">
							<button
								type="button"
								className="btn btn-outlined btn-sm"
								onClick={() => setPublishModalOpen(false)}
								disabled={publishing}
							>
								{publishResult?.success ? "Close" : "Cancel"}
							</button>

							{!publishResult?.success && (
								<button
									type="button"
									className="btn btn-contained btn-sm"
									onClick={handlePublish}
									disabled={publishing}
									style={{
										display: "inline-flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									{publishing && (
										<div
											className="spinner"
											style={{ width: 14, height: 14 }}
										/>
									)}
									{!publishing && GitHub && <GitHub size={14} />}
									<span>
										{publishing ? "Committing..." : "Commit to GitHub"}
									</span>
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Toast notification */}
			{toast.open && (
				<div
					style={{
						position: "fixed",
						bottom: "24px",
						right: "24px",
						background: "var(--color-primary, #38392e)",
						color: "var(--color-background-body, #fdffda)",
						padding: "10px 16px",
						fontSize: "0.85rem",
						fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
						letterSpacing: "0.05em",
						zIndex: 9999,
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					}}
				>
					{toast.message}
				</div>
			)}
		</div>
	);
}
