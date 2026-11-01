import { AutoFixHigh, Close, Star, StarBorder } from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchGitHubRepoDetails } from "@/utils/githubPublisher";

const CATEGORIES = [
	"Web App",
	"Browser Extension",
	"CLI / Tool",
	"Library",
	"Service",
	"Design System",
	"Mobile App",
	"Other",
];

export default function ProjectEditModal({
	open,
	onClose,
	onSave,
	project,
	githubToken,
}) {
	const isEdit = Boolean(project?.githubName);

	const [formData, setFormData] = useState({
		githubName: "",
		tagline: "",
		category: "Web App",
		githubImg: "",
		githubContentPath: "",
		featured: false,
		addonId: "",
		chromeStatsId: "",
	});

	const [fetchingGithub, setFetchingGithub] = useState(false);
	const [fetchMessage, setFetchMessage] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		if (project) {
			setFormData({
				githubName: project.githubName || "",
				tagline: project.tagline || "",
				category: project.category || "Web App",
				githubImg: project.githubImg || "",
				githubContentPath: project.githubContentPath || "",
				featured: Boolean(project.featured),
				addonId: project.addonId || "",
				chromeStatsId: project.chromeStatsId || "",
			});
		} else {
			setFormData({
				githubName: "",
				tagline: "",
				category: "Web App",
				githubImg: "",
				githubContentPath: "",
				featured: false,
				addonId: "",
				chromeStatsId: "",
			});
		}
		setFetchMessage(null);
		setError("");
	}, [project]);

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAutoFetch = async () => {
		if (!formData.githubName.trim()) {
			setError("Enter a GitHub Repository Name first (e.g. NotebookForge).");
			return;
		}

		setFetchingGithub(true);
		setFetchMessage(null);
		setError("");

		try {
			const cleanName = formData.githubName
				.replace(/^moodynooby\//i, "")
				.trim();
			const details = await fetchGitHubRepoDetails(cleanName, githubToken);

			let inferredCategory = formData.category;
			const topics = details.topics || [];
			if (
				topics.includes("extension") ||
				topics.includes("chrome-extension") ||
				topics.includes("firefox-addon")
			) {
				inferredCategory = "Browser Extension";
			} else if (topics.includes("cli") || topics.includes("tool")) {
				inferredCategory = "CLI / Tool";
			} else if (topics.includes("library") || topics.includes("package")) {
				inferredCategory = "Library";
			}

			const defaultReadmeUrl = `https://raw.githubusercontent.com/moodynooby/${cleanName}/${details.defaultBranch}/README.md`;

			setFormData((prev) => ({
				...prev,
				githubName: cleanName,
				tagline: prev.tagline || details.description || "",
				category: inferredCategory,
				githubContentPath: prev.githubContentPath || defaultReadmeUrl,
			}));

			setFetchMessage({
				type: "success",
				text: `Fetched "${details.name}" (${details.stars}★, ${details.language || "Code"}). Tagline and content path auto-populated.`,
			});
		} catch (err) {
			setFetchMessage({
				type: "error",
				text: err.message || "Failed to fetch repository metadata.",
			});
		} finally {
			setFetchingGithub(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.githubName.trim()) {
			setError("GitHub Name is required.");
			return;
		}
		if (!formData.tagline.trim()) {
			setError("Tagline description is required.");
			return;
		}

		const cleanProject = {
			githubName: formData.githubName.trim(),
			tagline: formData.tagline.trim(),
			category: formData.category,
			githubContentPath:
				formData.githubContentPath.trim() ||
				`https://raw.githubusercontent.com/moodynooby/${formData.githubName.trim()}/main/README.md`,
			githubImg: formData.githubImg.trim(),
		};

		if (formData.featured) {
			cleanProject.featured = true;
		}
		if (formData.addonId.trim()) {
			cleanProject.addonId = formData.addonId.trim();
		}
		if (formData.chromeStatsId.trim()) {
			cleanProject.chromeStatsId = formData.chromeStatsId.trim();
		}

		onSave(cleanProject);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
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
						Ledger Monograph Entry
					</Typography>
					<Typography
						variant="h5"
						component="div"
						sx={{
							fontFamily: "Newsreader, serif",
							fontWeight: 700,
							color: "text.primary",
						}}
					>
						{isEdit
							? `Edit Entry: ${project.githubName}`
							: "New Project Monograph"}
					</Typography>
				</Box>
				<IconButton onClick={onClose} size="small" aria-label="Close">
					<Close />
				</IconButton>
			</DialogTitle>

			<Box component="form" onSubmit={handleSubmit} noValidate>
				<DialogContent sx={{ py: 3 }}>
					{error && (
						<Alert severity="error" sx={{ mb: 3 }}>
							{error}
						</Alert>
					)}

					{fetchMessage && (
						<Alert severity={fetchMessage.type} sx={{ mb: 3 }}>
							{fetchMessage.text}
						</Alert>
					)}

					<Box
						sx={{
							p: 2,
							mb: 3,
							border: 1,
							borderColor: "divider",
							backgroundColor: "background.default",
						}}
					>
						<Typography
							variant="subtitle2"
							sx={{
								fontFamily: "Work Sans, sans-serif",
								fontWeight: 600,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								mb: 1.5,
								color: "text.secondary",
							}}
						>
							GitHub Repository Sync
						</Typography>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} sm={8}>
								<TextField
									fullWidth
									size="small"
									label="GitHub Repository Name"
									placeholder="e.g. NotebookForge or moodynooby/diet-logs"
									value={formData.githubName}
									onChange={(e) => handleChange("githubName", e.target.value)}
									required
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Button
									fullWidth
									variant="outlined"
									onClick={handleAutoFetch}
									disabled={fetchingGithub || !formData.githubName.trim()}
									startIcon={
										fetchingGithub ? (
											<CircularProgress size={16} color="inherit" />
										) : (
											<AutoFixHigh />
										)
									}
									sx={{
										borderColor: "divider",
										color: "text.primary",
										textTransform: "none",
										"&:hover": { borderColor: "primary.main" },
									}}
								>
									{fetchingGithub ? "Fetching..." : "Auto-Fill Metadata"}
								</Button>
							</Grid>
						</Grid>
					</Box>

					<Grid container spacing={2.5}>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth size="small">
								<InputLabel id="category-select-label">Category</InputLabel>
								<Select
									labelId="category-select-label"
									value={formData.category}
									label="Category"
									onChange={(e) => handleChange("category", e.target.value)}
								>
									{CATEGORIES.map((cat) => (
										<MenuItem key={cat} value={cat}>
											{cat}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid
							item
							xs={12}
							sm={6}
							sx={{ display: "flex", alignItems: "center" }}
						>
							<FormControlLabel
								control={
									<Switch
										checked={formData.featured}
										onChange={(e) => handleChange("featured", e.target.checked)}
										color="primary"
									/>
								}
								label={
									<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
										{formData.featured ? (
											<Star fontSize="small" sx={{ color: "primary.main" }} />
										) : (
											<StarBorder
												fontSize="small"
												sx={{ color: "text.secondary" }}
											/>
										)}
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											Pin as Featured Monograph
										</Typography>
									</Box>
								}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={2}
								label="Tagline / Concise Editorial Description"
								value={formData.tagline}
								onChange={(e) => handleChange("tagline", e.target.value)}
								placeholder="One or two sentence summary in the editorial archive voice."
								required
								helperText="Displays in the main broadsheet ledger below the project title."
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								size="small"
								label="Image URL (Thumbnail or Logo)"
								value={formData.githubImg}
								onChange={(e) => handleChange("githubImg", e.target.value)}
								placeholder="https://raw.githubusercontent.com/.../logo.svg"
								helperText="SVG or PNG asset URL representing the project mark."
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								size="small"
								label="README Markdown Raw Content Path"
								value={formData.githubContentPath}
								onChange={(e) =>
									handleChange("githubContentPath", e.target.value)
								}
								placeholder="https://raw.githubusercontent.com/moodynooby/{repo}/main/README.md"
								helperText="Fetched dynamically on the Project Detail monograph reading view."
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								size="small"
								label="Firefox Addon ID (Optional)"
								value={formData.addonId}
								onChange={(e) => handleChange("addonId", e.target.value)}
								placeholder="e.g. modern-translate-web-pages"
								helperText="For Firefox extensions to fetch live install counts."
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								size="small"
								label="Chrome Stats ID (Optional)"
								value={formData.chromeStatsId}
								onChange={(e) => handleChange("chromeStatsId", e.target.value)}
								placeholder="e.g. modern-translate-web-pages"
							/>
						</Grid>
					</Grid>

					{/* Live Monograph Card Preview */}
					<Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
						<Typography
							variant="overline"
							sx={{
								color: "secondary.main",
								letterSpacing: "0.15em",
								fontWeight: 600,
								display: "block",
								mb: 1.5,
							}}
						>
							Live Monograph Preview
						</Typography>

						<Box
							sx={{
								border: 1,
								borderColor: "divider",
								backgroundColor: "background.paper",
								p: 2.5,
								display: "flex",
								alignItems: "flex-start",
								gap: 2,
							}}
						>
							{formData.githubImg ? (
								<Box
									component="img"
									src={formData.githubImg}
									alt="Thumbnail"
									sx={{
										width: 48,
										height: 48,
										objectFit: "contain",
										border: 1,
										borderColor: "divider",
										p: 0.5,
										backgroundColor: "background.default",
									}}
									onError={(e) => {
										e.target.style.display = "none";
									}}
								/>
							) : (
								<Box
									sx={{
										width: 48,
										height: 48,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										border: 1,
										borderColor: "divider",
										backgroundColor: "background.default",
										color: "text.secondary",
										fontFamily: "Newsreader, serif",
										fontWeight: 700,
									}}
								>
									{formData.githubName.slice(0, 2).toUpperCase() || "PR"}
								</Box>
							)}

							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										flexWrap: "wrap",
										mb: 0.5,
									}}
								>
									<Typography
										variant="h6"
										component="span"
										sx={{
											fontFamily: "Newsreader, serif",
											fontWeight: 700,
											color: "text.primary",
										}}
									>
										{formData.githubName || "Project Name"}
									</Typography>
									<Chip
										label={formData.category}
										size="small"
										variant="outlined"
										sx={{
											fontSize: "0.65rem",
											height: 20,
											borderColor: "divider",
											textTransform: "uppercase",
											letterSpacing: "0.08em",
										}}
									/>
									{formData.featured && (
										<Chip
											icon={<Star sx={{ fontSize: "0.8rem !important" }} />}
											label="Featured"
											size="small"
											sx={{
												fontSize: "0.65rem",
												height: 20,
												backgroundColor: "secondary.main",
												color: "#fff",
											}}
										/>
									)}
								</Box>
								<Typography
									variant="body2"
									sx={{
										color: "text.secondary",
										fontFamily: "Noto Serif, serif",
										fontSize: "0.85rem",
										lineHeight: 1.4,
									}}
								>
									{formData.tagline ||
										"Project tagline or editorial description..."}
								</Typography>
							</Box>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions
					sx={{
						px: 3,
						py: 2,
						borderTop: 1,
						borderColor: "divider",
						backgroundColor: "background.default",
					}}
				>
					<Button onClick={onClose} sx={{ color: "text.secondary" }}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						sx={{
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
						{isEdit ? "Update Project" : "Add to Ledger"}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
}

ProjectEditModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	project: PropTypes.object,
	githubToken: PropTypes.string,
};
