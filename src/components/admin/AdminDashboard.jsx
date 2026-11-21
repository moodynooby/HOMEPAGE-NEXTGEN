import {
	ArrowDown,
	ArrowUp,
	Check,
	Copy,
	Download,
	Edit2,
	LogOut,
	Plus,
	RotateCcw,
	Search,
	Star,
	Trash2,
} from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import Header from "@/components/Header";
import TechRadar from "@/components/TechRadar";
import TechRadarForm from "@/components/TechRadarForm";
import defaultProjects from "@/content/projects.json";
import useTechRadarData from "@/hooks/useTechRadarData";
import { isAuthenticated, logout } from "@/utils/authUtils";

const DRAFT_PROJECTS_KEY = "editorial_admin_draft_projects";
const CATEGORIES = [
	"Web App",
	"Browser Extension",
	"Game",
	"AI Tool",
	"Computer Vision",
];

export default function AdminDashboard({ showAppBar = true }) {
	const [authed, setAuthed] = useState(() => isAuthenticated());
	const [activeTab, setActiveTab] = useState("projects"); // "projects" | "radar"

	// --- Projects State ---
	const [projects, setProjects] = useState(() => {
		try {
			const saved = localStorage.getItem(DRAFT_PROJECTS_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) return parsed;
			}
		} catch (_e) {
			// ignore
		}
		return defaultProjects;
	});

	const [projectSearch, setProjectSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [editingProjectIndex, setEditingProjectIndex] = useState(null);
	const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
	const [projectFormData, setProjectFormData] = useState({
		githubName: "",
		githubContentPath: "",
		githubImg: "",
		tagline: "",
		category: "Web App",
		featured: false,
		addonId: "",
		chromeStatsId: "",
	});

	// --- Tech Radar State ---
	const {
		rings,
		quadrants,
		blips,
		availableLanguages,
		allProjects,
		addOrUpdateBlip,
		deleteBlip,
		resetToDefault: resetRadarToDefault,
	} = useTechRadarData();

	const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
	const [editingRadarBlip, setEditingRadarBlip] = useState(null);
	const [radarQuadrantFilter, setRadarQuadrantFilter] = useState("All");

	// --- Toast State ---
	const [toastMessage, setToastMessage] = useState("");

	useEffect(() => {
		try {
			localStorage.setItem(DRAFT_PROJECTS_KEY, JSON.stringify(projects));
		} catch (_e) {
			// ignore
		}
	}, [projects]);

	const showToast = (msg) => {
		setToastMessage(msg);
		setTimeout(() => setToastMessage(""), 3000);
	};

	const handleLogout = () => {
		logout();
		setAuthed(false);
	};

	// --- Project Actions ---
	const handleOpenAddProject = () => {
		setEditingProjectIndex(null);
		setProjectFormData({
			githubName: "",
			githubContentPath: "",
			githubImg: "",
			tagline: "",
			category: "Web App",
			featured: false,
			addonId: "",
			chromeStatsId: "",
		});
		setIsProjectModalOpen(true);
	};

	const handleOpenEditProject = (index) => {
		setEditingProjectIndex(index);
		const p = projects[index];
		setProjectFormData({
			githubName: p.githubName || "",
			githubContentPath: p.githubContentPath || "",
			githubImg: p.githubImg || "",
			tagline: p.tagline || "",
			category: p.category || "Web App",
			featured: Boolean(p.featured),
			addonId: p.addonId || "",
			chromeStatsId: p.chromeStatsId || "",
		});
		setIsProjectModalOpen(true);
	};

	const handleProjectFormSubmit = (e) => {
		e.preventDefault();
		const name = projectFormData.githubName.trim();
		if (!name) return;

		const normalized = {
			githubName: name,
			githubContentPath:
				projectFormData.githubContentPath.trim() ||
				`https://raw.githubusercontent.com/moodynooby/${name}/main/README.md`,
			githubImg: projectFormData.githubImg.trim(),
			tagline: projectFormData.tagline.trim(),
			category: projectFormData.category,
		};

		if (projectFormData.featured) normalized.featured = true;
		if (projectFormData.addonId?.trim())
			normalized.addonId = projectFormData.addonId.trim();
		if (projectFormData.chromeStatsId?.trim())
			normalized.chromeStatsId = projectFormData.chromeStatsId.trim();

		setProjects((prev) => {
			if (editingProjectIndex !== null && editingProjectIndex >= 0) {
				const next = [...prev];
				next[editingProjectIndex] = normalized;
				return next;
			}
			return [normalized, ...prev];
		});

		setIsProjectModalOpen(false);
		showToast(
			editingProjectIndex !== null ? "Project updated" : "Project added",
		);
	};

	const handleDeleteProject = (index) => {
		const target = projects[index];
		if (!window.confirm(`Delete ${target.githubName}?`)) return;
		setProjects((prev) => prev.filter((_, i) => i !== index));
		showToast("Project deleted");
	};

	const handleToggleFeatured = (index) => {
		setProjects((prev) => {
			const next = [...prev];
			next[index] = { ...next[index], featured: !next[index].featured };
			return next;
		});
	};

	const handleMoveProject = (index, direction) => {
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= projects.length) return;
		setProjects((prev) => {
			const next = [...prev];
			const [moved] = next.splice(index, 1);
			next.splice(newIndex, 0, moved);
			return next;
		});
	};

	const handleResetProjectsToDefault = () => {
		if (
			!window.confirm("Reset projects to original content from projects.json?")
		)
			return;
		setProjects(defaultProjects);
		try {
			localStorage.removeItem(DRAFT_PROJECTS_KEY);
		} catch (_e) {
			// ignore
		}
		showToast("Reset to default projects");
	};

	// --- Export / Copy Helpers ---
	const copyJsonToClipboard = (data, label) => {
		const formatted = JSON.stringify(data, null, 2);
		navigator.clipboard.writeText(formatted).then(() => {
			showToast(`${label} copied to clipboard!`);
		});
	};

	const downloadJson = (data, filename) => {
		const blob = new Blob([JSON.stringify(data, null, "\t")], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		showToast(`Downloaded ${filename}`);
	};

	const filteredProjects = useMemo(() => {
		const q = projectSearch.trim().toLowerCase();
		return projects.filter((p) => {
			const matchesCategory =
				categoryFilter === "All" || p.category === categoryFilter;
			if (!matchesCategory) return false;
			if (!q) return true;
			return (
				p.githubName.toLowerCase().includes(q) ||
				p.tagline.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q)
			);
		});
	}, [projects, projectSearch, categoryFilter]);

	const filteredBlips = useMemo(() => {
		if (radarQuadrantFilter === "All") return blips;
		return blips.filter((b) => b.quadrant === radarQuadrantFilter);
	}, [blips, radarQuadrantFilter]);

	if (!authed) {
		return <AdminLogin onAuthenticated={() => setAuthed(true)} />;
	}

	return (
		<div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
			{showAppBar && <Header />}

			<main
				id="main-content"
				className="editorial-container"
				style={{ paddingTop: "2.5rem" }}
			>
				{/* Masthead */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						flexWrap: "wrap",
						gap: "1rem",
						borderBottom: "1px solid var(--color-border)",
						paddingBottom: "1.5rem",
						marginBottom: "2rem",
					}}
				>
					<div>
						<p className="editorial-meta">Curator Console · Editorial Desk</p>
						<h1
							className="editorial-headline"
							style={{ fontSize: "2.5rem", margin: "0.25rem 0" }}
						>
							Portfolio Administration
						</h1>
						<p
							className="editorial-body text-secondary"
							style={{ maxWidth: "60ch", marginBottom: 0 }}
						>
							Directly manage the portfolio ledger (`projects.json`) and the
							technology stack radar (`techRadar.json`) with live draft sync and
							export.
						</p>
					</div>

					<div
						style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
					>
						<Link to="/" className="btn btn-outline btn-sm">
							View Portfolio
						</Link>
						<button
							type="button"
							onClick={handleLogout}
							className="btn btn-outline btn-sm flex items-center gap-1"
						>
							<LogOut size={14} />
							<span>Sign Out</span>
						</button>
					</div>
				</div>

				{/* Toast Banner */}
				{toastMessage && (
					<div
						style={{
							padding: "0.6rem 1rem",
							marginBottom: "1.5rem",
							border: "1px solid var(--color-text-primary)",
							backgroundColor: "var(--color-overlay-hover)",
							fontFamily: "var(--font-family-code)",
							fontSize: "0.8rem",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						<Check size={14} />
						<span>{toastMessage}</span>
					</div>
				)}

				{/* Tabs */}
				<div
					style={{
						display: "flex",
						gap: "0.5rem",
						borderBottom: "1px solid var(--color-border)",
						marginBottom: "2rem",
					}}
				>
					<button
						type="button"
						onClick={() => setActiveTab("projects")}
						className="btn btn-sm"
						style={{
							borderBottom:
								activeTab === "projects"
									? "2px solid var(--color-text-primary)"
									: "2px solid transparent",
							fontWeight: activeTab === "projects" ? 700 : 500,
							borderRadius: 0,
						}}
					>
						Projects Ledger ({projects.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("radar")}
						className="btn btn-sm"
						style={{
							borderBottom:
								activeTab === "radar"
									? "2px solid var(--color-text-primary)"
									: "2px solid transparent",
							fontWeight: activeTab === "radar" ? 700 : 500,
							borderRadius: 0,
						}}
					>
						Tech Stack Radar ({blips.length})
					</button>
				</div>

				{/* TAB 1: PROJECTS LEDGER */}
				{activeTab === "projects" && (
					<div>
						{/* Actions Bar */}
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
									gap: "0.5rem",
									flex: 1,
									maxWidth: "400px",
								}}
							>
								<div
									style={{
										position: "relative",
										width: "100%",
										display: "flex",
										alignItems: "center",
									}}
								>
									<Search
										size={16}
										style={{
											position: "absolute",
											left: "0.75rem",
											color: "var(--color-text-secondary)",
										}}
									/>
									<input
										type="text"
										value={projectSearch}
										onChange={(e) => setProjectSearch(e.target.value)}
										placeholder="Search projects by name, category, tagline..."
										style={{ paddingLeft: "2.25rem" }}
									/>
								</div>
							</div>

							<div
								style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
							>
								<button
									type="button"
									onClick={handleResetProjectsToDefault}
									className="btn btn-outline btn-sm flex items-center gap-1"
									title="Revert to original projects.json"
								>
									<RotateCcw size={13} />
									<span>Revert</span>
								</button>
								<button
									type="button"
									onClick={() => copyJsonToClipboard(projects, "projects.json")}
									className="btn btn-outline btn-sm flex items-center gap-1"
								>
									<Copy size={13} />
									<span>Copy JSON</span>
								</button>
								<button
									type="button"
									onClick={() => downloadJson(projects, "projects.json")}
									className="btn btn-outline btn-sm flex items-center gap-1"
								>
									<Download size={13} />
									<span>Export</span>
								</button>
								<button
									type="button"
									onClick={handleOpenAddProject}
									className="btn btn-primary btn-sm flex items-center gap-1"
								>
									<Plus size={14} />
									<span>Add Project</span>
								</button>
							</div>
						</div>

						{/* Category Pills */}
						<div
							style={{
								display: "flex",
								gap: "0.4rem",
								flexWrap: "wrap",
								marginBottom: "1.5rem",
							}}
						>
							{["All", ...CATEGORIES].map((cat) => (
								<button
									key={cat}
									type="button"
									onClick={() => setCategoryFilter(cat)}
									className="chip chip-sm"
									style={{
										borderColor:
											categoryFilter === cat
												? "var(--color-text-primary)"
												: "var(--color-border)",
										backgroundColor:
											categoryFilter === cat
												? "var(--color-overlay-hover)"
												: "transparent",
									}}
								>
									{cat}
								</button>
							))}
						</div>

						{/* Projects List Table */}
						<div
							style={{
								border: "1px solid var(--color-border)",
								background: "var(--color-background-surface)",
							}}
						>
							{filteredProjects.length === 0 ? (
								<div style={{ padding: "3rem", textAlign: "center" }}>
									<p className="caption text-secondary">
										No projects match your filter.
									</p>
								</div>
							) : (
								filteredProjects.map((p, idx) => {
									const originalIndex = projects.findIndex(
										(orig) => orig.githubName === p.githubName,
									);
									return (
										<div
											key={p.githubName}
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												gap: "1rem",
												padding: "1rem 1.25rem",
												borderBottom:
													idx === filteredProjects.length - 1
														? "none"
														: "1px solid var(--color-border)",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "1rem",
													flex: 1,
													minWidth: 0,
												}}
											>
												{p.githubImg ? (
													<img
														src={p.githubImg}
														alt=""
														style={{
															width: 36,
															height: 36,
															objectFit: "contain",
															borderRadius: 0,
															border: "1px solid var(--color-border)",
															flexShrink: 0,
														}}
													/>
												) : (
													<div
														style={{
															width: 36,
															height: 36,
															border: "1px solid var(--color-border)",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															fontSize: "0.75rem",
															flexShrink: 0,
														}}
													>
														#
													</div>
												)}

												<div style={{ minWidth: 0, flex: 1 }}>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "0.5rem",
														}}
													>
														<Link
															to={`/projects/${p.githubName}`}
															style={{
																fontWeight: 600,
																color: "var(--color-text-primary)",
																textDecoration: "none",
															}}
														>
															{p.githubName}
														</Link>
														<span className="badge">{p.category}</span>
														{p.featured && (
															<span
																className="chip chip-sm"
																style={{ color: "var(--color-chart-adopt)" }}
															>
																★ Featured
															</span>
														)}
													</div>
													<p
														className="caption text-secondary"
														style={{
															margin: 0,
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}
													>
														{p.tagline}
													</p>
												</div>
											</div>

											{/* Row Actions */}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "0.35rem",
													flexShrink: 0,
												}}
											>
												<button
													type="button"
													onClick={() => handleToggleFeatured(originalIndex)}
													className="btn btn-outline btn-sm p-1"
													title={
														p.featured ? "Remove featured" : "Mark featured"
													}
												>
													<Star
														size={14}
														fill={p.featured ? "currentColor" : "none"}
														style={{
															color: p.featured
																? "var(--color-chart-adopt)"
																: "inherit",
														}}
													/>
												</button>

												<button
													type="button"
													disabled={originalIndex === 0}
													onClick={() => handleMoveProject(originalIndex, -1)}
													className="btn btn-outline btn-sm p-1"
													title="Move up"
												>
													<ArrowUp size={14} />
												</button>

												<button
													type="button"
													disabled={originalIndex === projects.length - 1}
													onClick={() => handleMoveProject(originalIndex, 1)}
													className="btn btn-outline btn-sm p-1"
													title="Move down"
												>
													<ArrowDown size={14} />
												</button>

												<button
													type="button"
													onClick={() => handleOpenEditProject(originalIndex)}
													className="btn btn-outline btn-sm flex items-center gap-1"
												>
													<Edit2 size={13} />
													<span>Edit</span>
												</button>

												<button
													type="button"
													onClick={() => handleDeleteProject(originalIndex)}
													className="btn btn-outline btn-sm flex items-center gap-1"
													style={{ color: "var(--color-status-maintenance)" }}
												>
													<Trash2 size={13} />
												</button>
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
				)}

				{/* TAB 2: TECH STACK RADAR */}
				{activeTab === "radar" && (
					<div>
						{/* Live Interactive Editable Radar */}
						<div
							style={{
								marginBottom: "2.5rem",
								padding: "1.5rem",
								border: "1px solid var(--color-border)",
								background: "var(--color-background-surface)",
							}}
						>
							<TechRadar editable={true} />
						</div>

						{/* Actions Bar */}
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
							<div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
								<button
									type="button"
									onClick={() => setRadarQuadrantFilter("All")}
									className="chip chip-sm"
									style={{
										borderColor:
											radarQuadrantFilter === "All"
												? "var(--color-text-primary)"
												: "var(--color-border)",
										backgroundColor:
											radarQuadrantFilter === "All"
												? "var(--color-overlay-hover)"
												: "transparent",
									}}
								>
									All Quadrants
								</button>
								{quadrants.map((q) => (
									<button
										key={q}
										type="button"
										onClick={() => setRadarQuadrantFilter(q)}
										className="chip chip-sm"
										style={{
											borderColor:
												radarQuadrantFilter === q
													? "var(--color-text-primary)"
													: "var(--color-border)",
											backgroundColor:
												radarQuadrantFilter === q
													? "var(--color-overlay-hover)"
													: "transparent",
										}}
									>
										{q}
									</button>
								))}
							</div>

							<div
								style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
							>
								<button
									type="button"
									onClick={() => {
										resetRadarToDefault();
										showToast("Reset radar to defaults");
									}}
									className="btn btn-outline btn-sm flex items-center gap-1"
									title="Revert custom blips to default"
								>
									<RotateCcw size={13} />
									<span>Reset</span>
								</button>
								<button
									type="button"
									onClick={() => {
										const exported = {
											rings,
											quadrants,
											blips: blips.map((b, i) => ({
												id: i + 1,
												name: b.name,
												quadrant: b.quadrant,
												ring: b.ring,
												yoe: b.yoe,
												keyRepos: b.keyRepos || [],
												projects: b.projects || [],
											})),
										};
										copyJsonToClipboard(exported, "techRadar.json");
									}}
									className="btn btn-outline btn-sm flex items-center gap-1"
								>
									<Copy size={13} />
									<span>Copy JSON</span>
								</button>
								<button
									type="button"
									onClick={() => {
										const exported = {
											rings,
											quadrants,
											blips: blips.map((b, i) => ({
												id: i + 1,
												name: b.name,
												quadrant: b.quadrant,
												ring: b.ring,
												yoe: b.yoe,
												keyRepos: b.keyRepos || [],
												projects: b.projects || [],
											})),
										};
										downloadJson(exported, "techRadar.json");
									}}
									className="btn btn-outline btn-sm flex items-center gap-1"
								>
									<Download size={13} />
									<span>Export</span>
								</button>
								<button
									type="button"
									onClick={() => {
										setEditingRadarBlip(null);
										setIsRadarModalOpen(true);
									}}
									className="btn btn-primary btn-sm flex items-center gap-1"
								>
									<Plus size={14} />
									<span>Add Technology</span>
								</button>
							</div>
						</div>

						{/* Technologies Table */}
						<div
							style={{
								border: "1px solid var(--color-border)",
								background: "var(--color-background-surface)",
							}}
						>
							{filteredBlips.map((b, idx) => (
								<div
									key={b.id || b.name}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										gap: "1rem",
										padding: "1rem 1.25rem",
										borderBottom:
											idx === filteredBlips.length - 1
												? "none"
												: "1px solid var(--color-border)",
									}}
								>
									<div>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "0.5rem",
												marginBottom: "0.25rem",
											}}
										>
											<span style={{ fontWeight: 600 }}>{b.name}</span>
											<span className="badge">{b.ring}</span>
											<span className="editorial-meta text-accent">
												{b.quadrant}
											</span>
											{b.source === "github" && (
												<span className="chip chip-sm">GitHub Tag</span>
											)}
											{b.isCustom && (
												<span className="chip chip-sm">Custom</span>
											)}
										</div>
										<p className="caption text-secondary" style={{ margin: 0 }}>
											<strong>{b.yoe} YOE</strong> · Key Repos:{" "}
											{b.keyRepos?.length > 0
												? b.keyRepos.join(", ")
												: "None linked"}
										</p>
									</div>

									<div style={{ display: "flex", gap: "0.4rem" }}>
										<button
											type="button"
											onClick={() => {
												setEditingRadarBlip(b);
												setIsRadarModalOpen(true);
											}}
											className="btn btn-outline btn-sm flex items-center gap-1"
										>
											<Edit2 size={13} />
											<span>Edit</span>
										</button>
										<button
											type="button"
											onClick={() => {
												deleteBlip(b.id);
												showToast(`Deleted ${b.name}`);
											}}
											className="btn btn-outline btn-sm flex items-center gap-1"
											style={{ color: "var(--color-status-maintenance)" }}
										>
											<Trash2 size={13} />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</main>

			{/* Project Edit / Add Modal */}
			{isProjectModalOpen && (
				<div
					role="presentation"
					className="modal-backdrop"
					onClick={(e) => {
						if (e.target === e.currentTarget) setIsProjectModalOpen(false);
					}}
				>
					<aside
						role="dialog"
						aria-modal="true"
						aria-labelledby="project-modal-title"
						tabIndex={-1}
						style={{
							maxWidth: "560px",
							width: "100%",
							maxHeight: "90vh",
							overflowY: "auto",
							background: "var(--color-background-surface)",
							border: "1px solid var(--color-border)",
							padding: "2rem",
						}}
					>
						<h3 id="project-modal-title" className="editorial-headline mb-4">
							{editingProjectIndex !== null ? "Edit Project" : "Add Project"}
						</h3>

						<form
							onSubmit={handleProjectFormSubmit}
							className="flex flex-col gap-4"
						>
							<div>
								<label
									htmlFor="proj-name"
									className="editorial-meta"
									style={{ display: "block", marginBottom: "0.3rem" }}
								>
									GitHub Repo Name *
								</label>
								<input
									id="proj-name"
									type="text"
									required
									value={projectFormData.githubName}
									onChange={(e) =>
										setProjectFormData((prev) => ({
											...prev,
											githubName: e.target.value,
										}))
									}
									placeholder="e.g. Modern-TWP"
								/>
							</div>

							<div>
								<label
									htmlFor="proj-tagline"
									className="editorial-meta"
									style={{ display: "block", marginBottom: "0.3rem" }}
								>
									Tagline (Editorial Summary) *
								</label>
								<input
									id="proj-tagline"
									type="text"
									required
									maxLength={140}
									value={projectFormData.tagline}
									onChange={(e) =>
										setProjectFormData((prev) => ({
											...prev,
											tagline: e.target.value,
										}))
									}
									placeholder="One sentence describing what it does..."
								/>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "1rem",
								}}
							>
								<div>
									<label
										htmlFor="proj-category"
										className="editorial-meta"
										style={{ display: "block", marginBottom: "0.3rem" }}
									>
										Category
									</label>
									<select
										id="proj-category"
										value={projectFormData.category}
										onChange={(e) =>
											setProjectFormData((prev) => ({
												...prev,
												category: e.target.value,
											}))
										}
									>
										{CATEGORIES.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>

								<div style={{ display: "flex", alignItems: "flex-end" }}>
									<label
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.5rem",
											cursor: "pointer",
											marginBottom: "0.6rem",
										}}
									>
										<input
											type="checkbox"
											checked={projectFormData.featured}
											onChange={(e) =>
												setProjectFormData((prev) => ({
													...prev,
													featured: e.target.checked,
												}))
											}
											style={{ width: "auto" }}
										/>
										<span className="editorial-meta">Featured on Home</span>
									</label>
								</div>
							</div>

							<div>
								<label
									htmlFor="proj-img"
									className="editorial-meta"
									style={{ display: "block", marginBottom: "0.3rem" }}
								>
									Image / Logo URL
								</label>
								<input
									id="proj-img"
									type="url"
									value={projectFormData.githubImg}
									onChange={(e) =>
										setProjectFormData((prev) => ({
											...prev,
											githubImg: e.target.value,
										}))
									}
									placeholder="https://raw.githubusercontent.com/.../icon.png"
								/>
							</div>

							<div>
								<label
									htmlFor="proj-content-path"
									className="editorial-meta"
									style={{ display: "block", marginBottom: "0.3rem" }}
								>
									README Content Path (optional override)
								</label>
								<input
									id="proj-content-path"
									type="url"
									value={projectFormData.githubContentPath}
									onChange={(e) =>
										setProjectFormData((prev) => ({
											...prev,
											githubContentPath: e.target.value,
										}))
									}
									placeholder="https://raw.githubusercontent.com/.../README.md"
								/>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "1rem",
								}}
							>
								<div>
									<label
										htmlFor="proj-addon-id"
										className="editorial-meta"
										style={{ display: "block", marginBottom: "0.3rem" }}
									>
										Firefox Addon ID (optional)
									</label>
									<input
										id="proj-addon-id"
										type="text"
										value={projectFormData.addonId}
										onChange={(e) =>
											setProjectFormData((prev) => ({
												...prev,
												addonId: e.target.value,
											}))
										}
										placeholder="e.g. modern-boomslider"
									/>
								</div>

								<div>
									<label
										htmlFor="proj-chromestats-id"
										className="editorial-meta"
										style={{ display: "block", marginBottom: "0.3rem" }}
									>
										Chrome Stats ID (optional)
									</label>
									<input
										id="proj-chromestats-id"
										type="text"
										value={projectFormData.chromeStatsId}
										onChange={(e) =>
											setProjectFormData((prev) => ({
												...prev,
												chromeStatsId: e.target.value,
											}))
										}
										placeholder="e.g. modern-boomslider"
									/>
								</div>
							</div>

							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									gap: "0.75rem",
									marginTop: "1rem",
								}}
							>
								<button
									type="button"
									onClick={() => setIsProjectModalOpen(false)}
									className="btn btn-outline btn-sm"
								>
									Cancel
								</button>
								<button type="submit" className="btn btn-primary btn-sm">
									Save Project
								</button>
							</div>
						</form>
					</aside>
				</div>
			)}

			{/* Tech Radar Edit / Add Modal */}
			<TechRadarForm
				isOpen={isRadarModalOpen}
				onClose={() => setIsRadarModalOpen(false)}
				onSave={addOrUpdateBlip}
				onDelete={deleteBlip}
				initialBlip={editingRadarBlip}
				availableLanguages={availableLanguages}
				allProjects={allProjects}
				quadrants={quadrants}
				rings={rings}
			/>
		</div>
	);
}

AdminDashboard.propTypes = {
	showAppBar: PropTypes.bool,
};
