import { motion } from "motion/react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { SITE_RESUME_URL } from "@/config/site";

export default function LandingHero({ shouldReduceMotion, ledgerEntries }) {
	return (
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
					Browser extensions, hardware-software experiments, and the occasional
					breakage it takes to learn something properly.
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
						href={SITE_RESUME_URL}
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
							borderTop: "1px solid var(--color-border)",
							borderBottom: "1px solid var(--color-border)",
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
										index > 0 ? "1px solid var(--color-border)" : "none",
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
	);
}

LandingHero.propTypes = {
	shouldReduceMotion: PropTypes.bool,
	ledgerEntries: PropTypes.array.isRequired,
};
