import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebIcon from "@mui/icons-material/Web";
import { Box, Container, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";

import ButtonAppBar from "@/components/Header";
import socialLinks from "@/content/socialLinks.json";

const iconMap = {
	LinkedIn: LinkedInIcon,
	GitHub: GitHubIcon,
	Email: EmailIcon,
	Instagram: InstagramIcon,
	"Addons Profile": WebIcon,
};

function LinkRow({ link, alt }) {
	const IconComponent = iconMap[alt];

	return (
		<Box
			component="a"
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={`Open ${alt} in a new tab`}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 3,
				py: 3,
				borderTop: "1px solid",
				borderColor: "divider",
				textDecoration: "none",
				color: "text.primary",
				transition: "background-color 0.3s ease",
				"&:hover": { bgcolor: "action.hover" },
				"&:hover .directory-arrow": {
					transform: "translate(4px, -4px)",
					opacity: 1,
					color: "secondary.main",
				},
			}}
		>
			<Box sx={{ display: "flex", color: "text.secondary" }}>
				{IconComponent && <IconComponent fontSize="small" />}
			</Box>
			<Typography variant="h6" component="span" sx={{ flex: 1 }}>
				{alt}
			</Typography>
			<ArrowOutwardIcon
				className="directory-arrow"
				sx={{
					fontSize: "1rem",
					color: "text.secondary",
					opacity: 0.4,
					transition: "transform 0.3s ease, opacity 0.3s ease, color 0.3s ease",
				}}
			/>
		</Box>
	);
}

LinkRow.propTypes = {
	link: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default function LinkTree() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<Box sx={{ minHeight: "100vh" }}>
			<ButtonAppBar />

			<motion.div
				initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
			>
				<Container maxWidth="sm" sx={{ pt: { xs: 7, md: 10 }, pb: 12 }}>
					<Box
						sx={{
							width: 96,
							height: 96,
							mb: 4,
							border: "1px solid",
							borderColor: "divider",
							bgcolor: "background.paper",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Typography
							variant="h3"
							component="p"
							sx={{ fontStyle: "italic", fontWeight: 400 }}
						>
							MD
						</Typography>
					</Box>

					<Typography variant="overline" color="secondary.main">
						The Directory
					</Typography>
					<Typography
						variant="h1"
						component="h1"
						sx={{ mt: 1, mb: 2, fontSize: { xs: "2.4rem", md: "3rem" } }}
					>
						Manas Doshi
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						sx={{ fontStyle: "italic", mb: 5 }}
					>
						Where else to find me.
					</Typography>

					<Box>
						{socialLinks.map((social) => (
							<LinkRow key={social.alt} link={social.link} alt={social.alt} />
						))}
						<Box
							sx={{
								borderTop: "1px solid",
								borderColor: "divider",
							}}
						/>
					</Box>
				</Container>
			</motion.div>
		</Box>
	);
}
