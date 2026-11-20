import { motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ProjectTimeline from "@/components/ProjectTimeline";
import projectsData from "@/content/projects.json";
import {
	fetchAddonMetadata,
	fetchRepoMetadata,
	fetchUserStats,
} from "@/utils/githubUtils";

const Gallery = lazy(() => import("@/components/Gallery"));
const TechRadar = lazy(() => import("@/components/TechRadar"));

const addonIds = projectsData
	.filter((project) => project.addonId)
	.map((project) => project.addonId);

const featuredProjects = projectsData.filter((project) => project.featured);

export default function LandingPage() {
	const [githubStats, setGithubStats] = useState(null);
	const [addonStats, setAddonStats] = useState({
		totalUsers: 0,
		totalDownloads: 0,
		addonCount: 0,
	});
	const [featuredMeta, setFeaturedMeta] = useState({});
	const [activeRadarProjects, setActiveRadarProjects] = useState([]);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		let mounted = true;

		Promise.all([
			fetchUserStats("moodynooby"),
			...addonIds.map((addonId) => fetchAddonMetadata(addonId)),
			...featuredProjects.map((project) =>
				fetchRepoMetadata(project.githubName),
			),
		]).then(([stats, ...rest]) => {
			if (!mounted) return;
			setGithubStats(stats);

			const addons = rest.slice(0, addonIds.length);
			const repos = rest.slice(addonIds.length);

			const addonById = new Map(
				addonIds.map((addonId, index) => [addonId, addons[index]]),
			);
			const resolvedAddons = addons.filter(Boolean);

			const totalUsers = resolvedAddons.reduce(
				(total, addon) => total + (addon.averageDailyUsers || 0),
				0,
			);
			const totalDownloads = resolvedAddons.reduce(
				(total, addon) => total + (addon.weeklyDownloads || 0),
				0,
			);
			setAddonStats({
				totalUsers,
				totalDownloads,
				addonCount: resolvedAddons.length,
			});

			setFeaturedMeta(
				featuredProjects.reduce((acc, project, index) => {
					acc[project.githubName] = repos[index] || {};
					if (project.addonId) {
						acc[project.githubName].addon =
							addonById.get(project.addonId) || null;
					}
					return acc;
				}, {}),
			);
		});

		return () => {
			mounted = false;
		};
	}, []);

	const formatCompact = (value) =>
		new Intl.NumberFormat("en", {
			notation: "compact",
			maximumFractionDigits: 1,
		}).format(value || 0);

	const formatNumber = (value) =>
		new Intl.NumberFormat("en").format(value || 0);

	const ledgerEntries = [
		githubStats && {
			label: "Repositories",
			value: formatNumber(githubStats.publicRepos),
		},
		githubStats &&
			githubStats.totalStars > 0 && {
				label: "Stars earned",
				value: formatNumber(githubStats.totalStars),
			},
		addonStats.totalUsers > 0 && {
			label: "Firefox users",
			value: formatCompact(addonStats.totalUsers),
		},
		addonStats.totalDownloads > 0 && {
			label: "Weekly downloads",
			value: formatCompact(addonStats.totalDownloads),
		},
	].filter(Boolean);

	return (
		<div style={{ minHeight: "100vh", paddingBottom: "2rem" }}>
			<Header />

			<div
				className="editorial-container"
				id="about-section"
				style={{ marginTop: "3rem" }}
			>
				<motion.div
					initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7 }}
				>
					<p className="editorial-meta">Manas Doshi · Student · Engineer</p>
					<h1
						className="editorial-headline"
						style={{
							fontSize: "clamp(2.6rem, 5vw, 4rem)",
							lineHeight: 1.08,
							marginTop: "0.5rem",
							marginBottom: "1.25rem",
							maxWidth: "17ch",
						}}
					>
						I see something I like — then build{" "}
						<em style={{ fontStyle: "italic", fontWeight: 400 }}>
							my own version.
						</em>
					</h1>
					<p
						className="editorial-body"
						style={{ marginBottom: "1.5rem", maxWidth: "58ch" }}
					>
						Browser extensions, hardware-software experiments, and the
						occasional breakage it takes to learn something properly.
					</p>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "0.75rem",
							marginBottom: "3rem",
						}}
					>
						<Link
							to="/projects"
							className="btn btn-contained"
							aria-label="View Manas Doshi's projects"
						>
							View Projects
						</Link>
						<a
							href="#timeline-section"
							className="btn btn-outlined"
							aria-label="View interactive project timeline and release milestones"
						>
							Timeline
						</a>
						<a
							href="https://flowcv.com/resume/woofkdsq4sse"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-outlined"
							aria-label="Open Manas Doshi's resume in a new tab"
						>
							View Résumé
						</a>
					</div>

					{ledgerEntries.length > 0 && (
						<div
							style={{
								borderTop:
									"1px solid var(--color-border, var(--hairline-rule))",
								borderBottom:
									"1px solid var(--color-border, var(--hairline-rule))",
								padding: "1.25rem 0",
								display: "flex",
								flexWrap: "wrap",
							}}
						>
							{ledgerEntries.map((entry, index) => (
								<div
									key={entry.label}
									style={{
										flex: "1 1 auto",
										minWidth: "120px",
										padding: "0.5rem 1.5rem",
										borderLeft:
											index > 0
												? "1px solid var(--color-border, var(--hairline-rule))"
												: "none",
									}}
								>
									<p className="editorial-stat-value">{entry.value}</p>
									<p className="editorial-meta">{entry.label}</p>
								</div>
							))}
						</div>
					)}
				</motion.div>
			</div>

			<section
				className="editorial-container"
				id="projects-section"
				style={{ marginTop: "4rem" }}
			>
				<div
					style={{
						display: "flex",
						alignItems: "baseline",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: "0.5rem",
						borderTop: "1px solid var(--color-border, var(--hairline-rule))",
						paddingTop: "1.25rem",
						marginBottom: "1.5rem",
					}}
				>
					<h2 className="editorial-subheading">Featured Work</h2>
					<p className="editorial-meta">
						{featuredProjects.length} of {projectsData.length} entries
					</p>
				</div>
				<div className="featured-grid">
					{featuredProjects.map((project) => {
						const meta = featuredMeta[project.githubName] || {};
						const isHighlighted = activeRadarProjects.includes(
							project.githubName,
						);
						return (
							<Link
								key={project.githubName}
								to={`/projects/${project.githubName}`}
								className="featured-card"
								style={{
									outline: isHighlighted ? "2px solid #93c47d" : "none",
									outlineOffset: "4px",
								}}
							>
								<div className="featured-thumb">
									<img src={project.githubImg} alt="" loading="lazy" />
								</div>
								<h3 className="editorial-card-title">{project.githubName}</h3>
								<p
									className="editorial-body"
									style={{
										fontSize: "0.875rem",
										lineHeight: 1.5,
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
										marginBottom: 0,
									}}
								>
									{project.tagline}
								</p>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										alignItems: "center",
										gap: "0.75rem",
										marginTop: "auto",
										paddingTop: "0.5rem",
										fontFamily:
											"var(--font-family-code, 'Work Sans', sans-serif)",
										fontSize: "0.7rem",
										letterSpacing: "0.1em",
										textTransform: "uppercase",
									}}
								>
									<span style={{ color: "var(--color-accent, #7d5d53)" }}>
										{project.category}
									</span>
									{meta.stars > 0 && (
										<span style={{ color: "var(--color-text-secondary)" }}>
											{formatNumber(meta.stars)} stars
										</span>
									)}
									{meta.addon?.averageDailyUsers > 0 && (
										<span style={{ color: "var(--color-text-secondary)" }}>
											{formatNumber(meta.addon.averageDailyUsers)} users
										</span>
									)}
								</div>
							</Link>
						);
					})}
				</div>
			</section>

			<section
				className="editorial-container"
				id="tech-radar-section"
				style={{ marginTop: "4.5rem" }}
			>
				<h2
					className="editorial-section-title"
					style={{ textAlign: "center", marginBottom: "0.5rem" }}
				>
					Tech Stack Radar
				</h2>
				<p
					className="editorial-body"
					style={{
						textAlign: "center",
						fontStyle: "italic",
						color: "var(--color-text-secondary, #7d5d53)",
						marginBottom: "2.5rem",
					}}
				>
					An interactive overview of technologies I adopt, trial, assess, or
					hold.
				</p>
				<Suspense
					fallback={
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								padding: "2rem",
							}}
						>
							<div className="spinner" />
						</div>
					}
				>
					<TechRadar
						onActiveBlipChange={(blip) =>
							setActiveRadarProjects(blip ? blip.projects : [])
						}
					/>
				</Suspense>
			</section>

			<section
				className="editorial-container"
				id="timeline-section"
				style={{ marginTop: "4.5rem" }}
			>
				<h2
					className="editorial-section-title"
					style={{ textAlign: "center", marginBottom: "0.5rem" }}
				>
					Project Timeline
				</h2>
				<p
					className="editorial-body"
					style={{
						textAlign: "center",
						fontStyle: "italic",
						color: "var(--color-text-secondary, #7d5d53)",
						marginBottom: "2.5rem",
					}}
				>
					Chronological evolution and release milestone changelogs across the
					ecosystem.
				</p>
				<ProjectTimeline limit={5} />
			</section>

			<section
				className="editorial-container"
				id="experience-section"
				style={{ marginTop: "4.5rem" }}
			>
				<h2
					className="editorial-section-title"
					style={{ textAlign: "center", marginBottom: "0.5rem" }}
				>
					The Visual Archive
				</h2>
				<p
					className="editorial-body"
					style={{
						textAlign: "center",
						fontStyle: "italic",
						color: "var(--color-text-secondary, #7d5d53)",
						marginBottom: "2.5rem",
					}}
				>
					Photographs and kinetic studies, preserved for the record.
				</p>
				<Suspense
					fallback={
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								padding: "4rem 0",
							}}
							role="status"
							aria-label="Loading gallery"
						>
							<div className="spinner" />
						</div>
					}
				>
					<Gallery limit={4} showAppBar={false} />
				</Suspense>
			</section>

			<footer
				style={{
					borderTop: "1px solid var(--color-border, var(--hairline-rule))",
					padding: "1.5rem 0",
					marginTop: "3rem",
				}}
			>
				<div
					className="editorial-container"
					style={{
						display: "flex",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: "0.5rem",
					}}
				>
					<p className="editorial-meta">
						© {new Date().getFullYear()} Manas Doshi
					</p>
					<p className="editorial-meta">Set in Newsreader &amp; Noto Serif</p>
				</div>
			</footer>
		</div>
	);
}
