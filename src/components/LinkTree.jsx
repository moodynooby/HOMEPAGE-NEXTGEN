import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";

import ButtonAppBar from "@/components/Header";
import socialLinks from "@/content/socialLinks.json";
import { socialIcons } from "@/utils/socialIcons";

function LinkRow({ link, alt }) {
	const IconComponent = socialIcons[alt];

	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={`Open ${alt} in a new tab`}
			style={{
				display: "flex",
				alignItems: "center",
				gap: "1.5rem",
				padding: "1.5rem 0",
				borderTop: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
				textDecoration: "none",
				color: "var(--color-text-primary, #38392e)",
				transition: "background-color 0.2s ease",
			}}
			className="link-tree-row"
		>
			<span
				style={{
					display: "flex",
					color: "var(--color-text-secondary, #7d5d53)",
				}}
			>
				{IconComponent && <IconComponent size={20} strokeWidth={1.5} />}
			</span>
			<span
				style={{
					flex: 1,
					fontFamily: "var(--font-family-heading, 'Newsreader', serif)",
					fontSize: "1.25rem",
					fontWeight: 600,
				}}
			>
				{alt}
			</span>
			<ArrowUpRight
				size={18}
				strokeWidth={1.5}
				className="directory-arrow"
				style={{
					color: "var(--color-text-secondary, #7d5d53)",
					opacity: 0.5,
					transition: "transform 0.2s ease, opacity 0.2s ease",
				}}
			/>
		</a>
	);
}

LinkRow.propTypes = {
	link: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default function LinkTree() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<div
			style={{
				minHeight: "100vh",
				background: "var(--color-background-body, #fdffda)",
				color: "var(--color-text-primary, #38392e)",
			}}
		>
			<ButtonAppBar />

			<motion.div
				initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
			>
				<main
					style={{
						maxWidth: "680px",
						margin: "0 auto",
						padding: "4rem 1.5rem 6rem",
					}}
				>
					<span
						style={{
							display: "block",
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.75rem",
							letterSpacing: "0.15em",
							textTransform: "uppercase",
							color: "var(--color-accent, #7d5d53)",
							marginBottom: "0.5rem",
						}}
					>
						Index · Directory
					</span>
					<h1
						style={{
							fontFamily:
								"var(--font-family-heading, 'Newsreader', Georgia, serif)",
							fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
							fontWeight: 700,
							margin: "0 0 1rem",
							lineHeight: 1.1,
						}}
					>
						Connected Profiles
					</h1>
					<p
						style={{
							fontFamily:
								"var(--font-family-body, 'Noto Serif', Georgia, serif)",
							color: "var(--color-text-secondary, #7d5d53)",
							fontSize: "1.05rem",
							marginBottom: "2.5rem",
							maxWidth: "46ch",
							lineHeight: 1.6,
						}}
					>
						A simple directory of places where my work, writing, and ongoing
						projects can be found.
					</p>

					<div>
						{socialLinks.map((social, index) => (
							<motion.div
								key={social.alt}
								initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={
									shouldReduceMotion
										? { duration: 0 }
										: { delay: index * 0.06, duration: 0.45 }
								}
							>
								<LinkRow link={social.link} alt={social.alt} />
							</motion.div>
						))}
						<div
							style={{
								borderTop:
									"1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
							}}
						/>
					</div>
				</main>
			</motion.div>
		</div>
	);
}
