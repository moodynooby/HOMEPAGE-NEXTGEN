import {
	Add,
	ArrowDownward,
	ArrowForward,
	ArrowUpward,
	CloudUpload,
	Delete,
	Download,
	Edit,
	GitHub,
	Key,
	Logout,
	Refresh,
	Search,
	Star,
	StarBorder,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Card,
	Chip,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AdminLogin from "@/components/admin/AdminLogin";
import GitHubTokenModal from "@/components/admin/GitHubTokenModal";
import ProjectEditModal from "@/components/admin/ProjectEditModal";
import defaultProjects from "@/content/projects.json";
import { getGitHubToken, isAuthenticated, logout } from "@/utils/authUtils";
import {
	commitProjectsToGitHub,
	exportProjectsJson,
} from "@/utils/githubPublisher";

const DRAFT_STORAGE_KEY = "editorial_admin_draft_projects";

export default function AdminDashboard() {
	const [isAuthed, setIsAuthed] = useState(() => isAuthenticated());
	const [githubToken, setLocalGithubToken] = useState(() => getGitHubToken());
	const [projects, setProjects] = useState(() => {
		try {
			const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed;
				}
			}
		} catch {
			// Ignore parse error and fallback
		}
		return defaultProjects;
	});

	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All");

	// Modals
	const [tokenModalOpen, setTokenModalOpen] = useState(false);
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

	// Notification Snackbar
	const [toast, setToast] = useState({
		open: false,
		message: "",
		severity: "info",
	});

	// Save drafts to localStorage whenever projects change
	useEffect(() => {
		try {
			localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(projects));
		} catch {
			// Storage full or unavailable
		}
	}, [projects]);

	const handleLogout = () => {
		logout();
		setIsAuthed(false);
	};

	const showToast = (message, severity = "info") => {
		setToast({ open: true, message, severity });
	};

	// Categories list
	const categories = useMemo(() => {
		const cats = new Set(["All"]);
		for (const p of projects) {
			if (p.category) cats.add(p.category);
		}
		return Array.from(cats);
	}, [projects]);

	// Filtered view
	const filteredProjects = useMemo(() => {
		return projects
			.map((p, originalIndex) => ({ ...p, originalIndex }))
			.filter((p) => {
				const matchesCategory =
					categoryFilter === "All" || p.category === categoryFilter;
				const q = searchQuery.toLowerCase().trim();
				const matchesSearch =
					!q ||
					p.githubName.toLowerCase().includes(q) ||
					p.tagline?.toLowerCase().includes(q);
				return matchesCategory && matchesSearch;
			});
	}, [projects, categoryFilter, searchQuery]);

	// Reorder handlers
	const moveProject = (index, direction) => {
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= projects.length) return;

		setProjects((prev) => {
			const copy = [...prev];
			const [moved] = copy.splice(index, 1);
			copy.splice(newIndex, 0, moved);
			return copy;
		});
		showToast(
			`Moved "${projects[index].githubName}" ${direction > 0 ? "down" : "up"}.`,
		);
	};

	// Toggle Featured
	const toggleFeatured = (index) => {
		setProjects((prev) => {
			const copy = [...prev];
			copy[index] = { ...copy[index], featured: !copy[index].featured };
			return copy;
		});
		showToast(
			`Project "${projects[index].githubName}" ${
				!projects[index].featured ? "featured" : "unfeatured"
			}.`,
		);
	};

	// Save Project (Add / Edit)
	const handleSaveProject = (savedData) => {
		if (editModalState.index !== null) {
			// Update existing
			setProjects((prev) => {
				const copy = [...prev];
				copy[editModalState.index] = savedData;
				return copy;
			});
			showToast(`Updated "${savedData.githubName}".`, "success");
		} else {
			// Add new to top
			setProjects((prev) => [savedData, ...prev]);
			showToast(`Added "${savedData.githubName}" to ledger.`, "success");
		}
		setEditModalState({ open: false, project: null, index: null });
	};

	// Delete Project
	const confirmDelete = () => {
		if (deleteConfirmState.index !== null) {
			const name = projects[deleteConfirmState.index]?.githubName;
			setProjects((prev) =>
				prev.filter((_, i) => i !== deleteConfirmState.index),
			);
			showToast(`Deleted "${name}".`, "info");
		}
		setDeleteConfirmState({ open: false, index: null, project: null });
	};

	// Reset to original
	const handleResetToDefault = () => {
		if (
			window.confirm(
				"Reset all changes back to projects.json from repository source? Local uncommitted drafts will be discarded.",
			)
		) {
			localStorage.removeItem(DRAFT_STORAGE_KEY);
			setProjects(defaultProjects);
			showToast("Reset ledger to default repository data.", "info");
		}
	};

	// Publish to GitHub
	const handlePublish = async () => {
		if (!githubToken) {
			setPublishModalOpen(false);
			setTokenModalOpen(true);
			showToast(
				"A GitHub Personal Access Token is required to commit directly.",
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
		<Box
			sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 12 }}
		>
			{/* Masthead Header */}
			<Box
				sx={{
					borderBottom: 1,
					borderColor: "divider",
					backgroundColor: "background.paper",
					py: 3,
				}}
			>
				<Container maxWidth="lg">
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: 2,
						}}
					>
						<Box>
							<Typography
								variant="overline"
								sx={{
									color: "secondary.main",
									letterSpacing: "0.15em",
									fontWeight: 600,
									display: "block",
								}}
							>
								Curator Archive Ledger • Administration
							</Typography>
							<Typography
								variant="h4"
								component="h1"
								sx={{
									fontFamily: "Newsreader, serif",
									fontWeight: 700,
									color: "text.primary",
									letterSpacing: "-0.01em",
								}}
							>
								Monograph Curator Desk
							</Typography>
						</Box>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								flexWrap: "wrap",
							}}
						>
							<Button
								component={RouterLink}
								to="/projects"
								variant="outlined"
								size="small"
								sx={{
									borderColor: "divider",
									color: "text.primary",
									textTransform: "none",
								}}
							>
								View Public Ledger
							</Button>

							<Button
								variant="outlined"
								size="small"
								onClick={() => setTokenModalOpen(true)}
								startIcon={<Key fontSize="small" />}
								sx={{
									borderColor: githubToken ? "divider" : "warning.main",
									color: githubToken ? "text.primary" : "warning.main",
									textTransform: "none",
								}}
							>
								{githubToken ? "GitHub Token (Active)" : "Set GitHub Token"}
							</Button>

							<Button
								variant="outlined"
								size="small"
								onClick={() => exportProjectsJson(projects)}
								startIcon={<Download fontSize="small" />}
								sx={{
									borderColor: "divider",
									color: "text.primary",
									textTransform: "none",
								}}
							>
								Export JSON
							</Button>

							<IconButton
								onClick={handleLogout}
								size="small"
								aria-label="Logout"
								title="Lock Curator Console"
								sx={{
									border: 1,
									borderColor: "divider",
									borderRadius: 1,
									p: 0.75,
								}}
							>
								<Logout fontSize="small" />
							</IconButton>
						</Box>
					</Box>
				</Container>
			</Box>

			{/* Main Content Area */}
			<Container maxWidth="lg" sx={{ mt: 5 }}>
				{!githubToken && (
					<Alert
						severity="info"
						action={
							<Button
								color="inherit"
								size="small"
								onClick={() => setTokenModalOpen(true)}
							>
								Configure Token
							</Button>
						}
						sx={{ mb: 4, border: 1, borderColor: "divider" }}
					>
						GitHub Personal Access Token is currently unconfigured. You can
						modify projects and export JSON locally. To push changes directly to
						the live repository, configure your token.
					</Alert>
				)}

				{/* Action Toolbar */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: 2,
						mb: 3,
					}}
				>
					<Box
						sx={{
							display: "flex",
							gap: 1.5,
							alignItems: "center",
							flexWrap: "wrap",
						}}
					>
						<Button
							variant="contained"
							startIcon={<Add />}
							onClick={() =>
								setEditModalState({ open: true, project: null, index: null })
							}
							sx={{
								backgroundColor: "primary.main",
								color: "primary.contrastText",
								fontWeight: 600,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								"&:hover": { backgroundColor: "primary.dark" },
							}}
						>
							New Project
						</Button>

						<Button
							variant="contained"
							color="secondary"
							startIcon={<CloudUpload />}
							onClick={() => {
								setPublishResult(null);
								setPublishModalOpen(true);
							}}
							sx={{
								backgroundColor: "secondary.main",
								color: "#fff",
								fontWeight: 600,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								"&:hover": { opacity: 0.9 },
							}}
						>
							Publish to GitHub
						</Button>

						<Button
							variant="text"
							size="small"
							startIcon={<Refresh />}
							onClick={handleResetToDefault}
							sx={{ color: "text.secondary", textTransform: "none" }}
						>
							Reset Draft
						</Button>
					</Box>

					{/* Search and Category Filter */}
					<Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
						<TextField
							size="small"
							placeholder="Filter ledger..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search fontSize="small" sx={{ color: "text.secondary" }} />
									</InputAdornment>
								),
							}}
							sx={{ minWidth: 200 }}
						/>

						<FormControl size="small" sx={{ minWidth: 150 }}>
							<InputLabel id="admin-category-filter">Category</InputLabel>
							<Select
								labelId="admin-category-filter"
								value={categoryFilter}
								label="Category"
								onChange={(e) => setCategoryFilter(e.target.value)}
							>
								{categories.map((c) => (
									<MenuItem key={c} value={c}>
										{c}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Box>

				{/* Broadsheet Projects Table */}
				<Card
					elevation={0}
					sx={{
						border: 1,
						borderColor: "divider",
						backgroundColor: "background.paper",
					}}
				>
					<TableContainer>
						<Table aria-label="Projects Curator Ledger">
							<TableHead sx={{ backgroundColor: "background.default" }}>
								<TableRow>
									<TableCell
										sx={{
											width: 60,
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										#
									</TableCell>
									<TableCell
										sx={{
											width: 70,
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										Order
									</TableCell>
									<TableCell
										sx={{
											width: 60,
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										Mark
									</TableCell>
									<TableCell
										sx={{
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										Project & Tagline
									</TableCell>
									<TableCell
										sx={{
											width: 150,
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										Category
									</TableCell>
									<TableCell
										sx={{
											width: 90,
											textAlign: "center",
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										Featured
									</TableCell>
									<TableCell
										sx={{
											width: 120,
											textAlign: "right",
											fontWeight: 700,
											fontSize: "0.75rem",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									>
										Actions
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredProjects.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} sx={{ py: 6, textAlign: "center" }}>
											<Typography
												variant="body2"
												sx={{ color: "text.secondary" }}
											>
												No projects found matching the filter criteria.
											</Typography>
										</TableCell>
									</TableRow>
								) : (
									filteredProjects.map((p) => {
										const index = p.originalIndex;
										return (
											<TableRow
												key={p.githubName}
												hover
												sx={{
													"&:last-child td, &:last-child th": { border: 0 },
												}}
											>
												<TableCell
													sx={{
														color: "text.secondary",
														fontFamily: "Newsreader, serif",
														fontSize: "1rem",
													}}
												>
													{index + 1}
												</TableCell>

												<TableCell>
													<Box
														sx={{ display: "flex", flexDirection: "column" }}
													>
														<IconButton
															size="small"
															disabled={index === 0}
															onClick={() => moveProject(index, -1)}
															aria-label={`Move ${p.githubName} up`}
														>
															<ArrowUpward fontSize="inherit" />
														</IconButton>
														<IconButton
															size="small"
															disabled={index === projects.length - 1}
															onClick={() => moveProject(index, 1)}
															aria-label={`Move ${p.githubName} down`}
														>
															<ArrowDownward fontSize="inherit" />
														</IconButton>
													</Box>
												</TableCell>

												<TableCell>
													{p.githubImg ? (
														<Box
															component="img"
															src={p.githubImg}
															alt={p.githubName}
															sx={{
																width: 36,
																height: 36,
																objectFit: "contain",
																p: 0.25,
																border: 1,
																borderColor: "divider",
																backgroundColor: "background.default",
															}}
															onError={(e) => {
																e.target.style.display = "none";
															}}
														/>
													) : (
														<Box
															sx={{
																width: 36,
																height: 36,
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																border: 1,
																borderColor: "divider",
																fontSize: "0.75rem",
																fontWeight: 700,
															}}
														>
															{p.githubName.slice(0, 2).toUpperCase()}
														</Box>
													)}
												</TableCell>

												<TableCell>
													<Typography
														variant="subtitle1"
														component="div"
														sx={{
															fontFamily: "Newsreader, serif",
															fontWeight: 700,
															color: "text.primary",
															lineHeight: 1.2,
														}}
													>
														{p.githubName}
													</Typography>
													<Typography
														variant="body2"
														sx={{
															color: "text.secondary",
															fontFamily: "Noto Serif, serif",
															fontSize: "0.85rem",
															mt: 0.5,
															maxWidth: 550,
														}}
													>
														{p.tagline}
													</Typography>
												</TableCell>

												<TableCell>
													<Chip
														label={p.category}
														size="small"
														variant="outlined"
														sx={{
															fontSize: "0.68rem",
															height: 22,
															borderColor: "divider",
															textTransform: "uppercase",
															letterSpacing: "0.06em",
														}}
													/>
												</TableCell>

												<TableCell sx={{ textAlign: "center" }}>
													<IconButton
														size="small"
														onClick={() => toggleFeatured(index)}
														aria-label={
															p.featured ? "Unmark featured" : "Mark featured"
														}
													>
														{p.featured ? (
															<Star
																fontSize="small"
																sx={{ color: "secondary.main" }}
															/>
														) : (
															<StarBorder
																fontSize="small"
																sx={{ color: "text.secondary" }}
															/>
														)}
													</IconButton>
												</TableCell>

												<TableCell sx={{ textAlign: "right" }}>
													<Tooltip title="Edit project details">
														<IconButton
															size="small"
															onClick={() =>
																setEditModalState({
																	open: true,
																	project: p,
																	index,
																})
															}
															aria-label={`Edit ${p.githubName}`}
														>
															<Edit fontSize="small" />
														</IconButton>
													</Tooltip>

													<Tooltip title="Remove from ledger">
														<IconButton
															size="small"
															color="error"
															onClick={() =>
																setDeleteConfirmState({
																	open: true,
																	index,
																	project: p,
																})
															}
															aria-label={`Delete ${p.githubName}`}
														>
															<Delete fontSize="small" />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</TableContainer>

					<Box
						sx={{
							p: 2,
							borderTop: 1,
							borderColor: "divider",
							backgroundColor: "background.default",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Typography
							variant="caption"
							sx={{ color: "text.secondary", letterSpacing: "0.05em" }}
						>
							LEDGER CATALOG: {projects.length} MONOGRAPHS (
							{projects.filter((p) => p.featured).length} FEATURED)
						</Typography>
						<Typography
							variant="caption"
							sx={{ color: "text.secondary", letterSpacing: "0.05em" }}
						>
							DRAFT AUTO-SAVED TO LOCAL STORAGE
						</Typography>
					</Box>
				</Card>
			</Container>

			{/* Project Edit / Create Modal */}
			<ProjectEditModal
				open={editModalState.open}
				project={editModalState.project}
				githubToken={githubToken}
				onClose={() =>
					setEditModalState({ open: false, project: null, index: null })
				}
				onSave={handleSaveProject}
			/>

			{/* GitHub Token Config Modal */}
			<GitHubTokenModal
				open={tokenModalOpen}
				onClose={() => setTokenModalOpen(false)}
				onTokenUpdated={(newToken) => {
					setLocalGithubToken(newToken);
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteConfirmState.open}
				onClose={() =>
					setDeleteConfirmState({ open: false, index: null, project: null })
				}
				PaperProps={{
					sx: {
						backgroundColor: "background.paper",
						border: 1,
						borderColor: "divider",
					},
				}}
			>
				<DialogTitle sx={{ fontFamily: "Newsreader, serif", fontWeight: 700 }}>
					Confirm Removal
				</DialogTitle>
				<DialogContent>
					<Typography variant="body2">
						Are you sure you want to remove{" "}
						<strong>{deleteConfirmState.project?.githubName}</strong> from the
						monograph ledger?
					</Typography>
				</DialogContent>
				<DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
					<Button
						onClick={() =>
							setDeleteConfirmState({
								open: false,
								index: null,
								project: null,
							})
						}
					>
						Cancel
					</Button>
					<Button onClick={confirmDelete} color="error" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Publish to GitHub Modal */}
			<Dialog
				open={publishModalOpen}
				onClose={() => {
					if (!publishing) setPublishModalOpen(false);
				}}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						backgroundColor: "background.paper",
						border: 1,
						borderColor: "divider",
					},
				}}
			>
				<DialogTitle
					sx={{
						borderBottom: 1,
						borderColor: "divider",
						py: 2,
						fontFamily: "Newsreader, serif",
						fontWeight: 700,
					}}
				>
					Publish Ledger to GitHub
				</DialogTitle>
				<DialogContent sx={{ py: 3 }}>
					{publishResult ? (
						publishResult.success ? (
							<Box sx={{ textAlign: "center", py: 2 }}>
								<Alert severity="success" sx={{ mb: 2 }}>
									Publication successfully committed to <code>main</code>!
								</Alert>
								<Typography variant="body2" sx={{ mb: 2 }}>
									Commit SHA: <code>{publishResult.commitSha.slice(0, 7)}</code>
								</Typography>
								{publishResult.commitUrl && (
									<Button
										href={publishResult.commitUrl}
										target="_blank"
										rel="noopener noreferrer"
										variant="outlined"
										size="small"
										endIcon={<ArrowForward />}
									>
										View Commit on GitHub
									</Button>
								)}
								<Typography
									variant="caption"
									sx={{ display: "block", color: "text.secondary", mt: 3 }}
								>
									GitHub Pages / Actions will build and deploy the update
									automatically.
								</Typography>
							</Box>
						) : (
							<Alert severity="error" sx={{ mb: 2 }}>
								{publishResult.error}
							</Alert>
						)
					) : (
						<Box>
							<Typography
								variant="body2"
								sx={{ mb: 2, color: "text.secondary" }}
							>
								You are about to commit {projects.length} project monographs to{" "}
								<strong>src/content/projects.json</strong> on branch{" "}
								<strong>main</strong>.
							</Typography>

							<TextField
								fullWidth
								label="Commit Message"
								value={commitMessage}
								onChange={(e) => setCommitMessage(e.target.value)}
								size="small"
								margin="normal"
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
					<Button
						onClick={() => setPublishModalOpen(false)}
						disabled={publishing}
					>
						{publishResult?.success ? "Close" : "Cancel"}
					</Button>
					{!publishResult?.success && (
						<Button
							variant="contained"
							onClick={handlePublish}
							disabled={publishing}
							startIcon={
								publishing ? (
									<CircularProgress size={16} color="inherit" />
								) : (
									<GitHub />
								)
							}
							sx={{
								backgroundColor: "primary.main",
								color: "primary.contrastText",
								"&:hover": { backgroundColor: "primary.dark" },
							}}
						>
							{publishing ? "Committing..." : "Commit to GitHub"}
						</Button>
					)}
				</DialogActions>
			</Dialog>

			{/* Toast Notifications */}
			<Snackbar
				open={toast.open}
				autoHideDuration={4000}
				onClose={() => setToast((prev) => ({ ...prev, open: false }))}
				message={toast.message}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			/>
		</Box>
	);
}
