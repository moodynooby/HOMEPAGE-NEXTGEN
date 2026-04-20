import {
	Box,
	Button,
	Container,
	Divider,
	Grid,
	Typography,
} from "@mui/material";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import ButtonAppBar from "@/components/Header";

const recentDispatchItems = [
	{
		id: "modern-boomslider",
		title: "MODERN BOOMSLIDER",
		category: "UX/UI",
		desc: "A re-imagining of the volume control interface.",
	},
	{
		id: "gimme-that",
		title: "GIMME THAT",
		category: "DEV TOOLS",
		desc: "Streamlining asset acquisition for developers.",
	},
	{
		id: "paceplay",
		title: "PACEPLAY",
		category: "EMBEDDED",
		desc: "Hardware-level control for modern gaming.",
	},
];

function PullQuote({ children }) {
	return (
		<Box
			className="pull-quote"
			sx={{
				maxWidth: "800px",
				mx: "auto",
				my: 8,
				textAlign: "center",
				borderLeft: "none",
				position: "relative",
				"&::before, &::after": {
					content: '""',
					display: "block",
					width: "60px",
					height: "2px",
					bgcolor: "secondary.main",
					mx: "auto",
					my: 2,
				},
			}}
		>
			<Typography variant="h2" sx={{ fontStyle: "italic" }}>
				{children}
			</Typography>
		</Box>
	);
}

function EditorialSection({ title, children, sideContent }) {
	return (
		<Box sx={{ my: 8 }}>
			<Typography
				variant="h3"
				sx={{ mb: 2, borderBottom: "2px solid black", display: "inline-block" }}
			>
				{title.toUpperCase()}
			</Typography>
			<Grid container spacing={6}>
				<Grid size={{ xs: 12, md: 8 }}>
					<Box
						sx={{
							columnCount: { xs: 1, md: 2 },
							columnGap: "2rem",
							textAlign: "justify",
							"& p": { mb: 2 },
						}}
					>
						{children}
					</Box>
				</Grid>
				<Grid size={{ xs: 12, md: 4 }}>
					<Box
						sx={{
							p: 3,
							bgcolor: "background.paper",
							border: "1px solid black",
							height: "100%",
						}}
					>
						{sideContent}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

PullQuote.propTypes = {
	children: PropTypes.node.isRequired,
};

EditorialSection.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	sideContent: PropTypes.node,
};

export default function LandingPage() {
	return (
		<Box sx={{ minHeight: "100vh", pb: 8 }}>
			<ButtonAppBar />

			<Container maxWidth="lg" sx={{ mt: 6 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 7 }}>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Typography
								variant="h2"
								sx={{
									fontSize: { xs: "2.5rem", md: "4rem" },
									lineHeight: 1.1,
									mb: 4,
									fontWeight: 800,
								}}
							>
								BUILDER OF DIGITAL EXPERIENCES.
							</Typography>
							<Typography
								variant="body1"
								sx={{ mb: 4, maxWidth: "600px", fontSize: "1.25rem" }}
							>
								Hi, I'm Manas. I build web apps, explore machine learning, and
								tinker with hardware specially the interation of hardware and software. Here's some of my recent work.
							</Typography>
							<Box sx={{ display: "flex", gap: 2 }}>
								<Button
									variant="contained"
									color="primary"
									component={Link}
									to="/projects"
								>
									VIEW PROJECTS
								</Button>
								<Button
									variant="outlined"
									color="primary"
									href="https://flowcv.com/resume/woofkdsq4sse"
									target="_blank"
								>
									VIEW RESUME
								</Button>
							</Box>
						</motion.div>
					</Grid>
					<Grid size={{ xs: 12, md: 5 }}>
						<Box
							sx={{
								border: "1px solid black",
								p: 1,
								bgcolor: "white",
								transform: { md: "rotate(2deg)" },
								boxShadow: "10px 10px 0px rgba(0,0,0,0.1)",
							}}
						>
							<Box
								component="img"
								src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800"
								loading="lazy"
								sx={{
									width: "100%",
									filter: "sepia(0.5) contrast(1.2) grayscale(1)",
								}}
							/>
							<Typography
								variant="caption"
								sx={{ mt: 1, display: "block", textAlign: "center" }}
							>
								MY WORK IN BRIEF
							</Typography>
						</Box>
					</Grid>
				</Grid>

				<Divider
					sx={{ my: 10, borderColor: "text.primary", borderWidth: "2px" }}
				/>

				<EditorialSection
					title="About Me"
					sideContent={
						<>
							<Typography variant="h6" sx={{ mb: 2 }}>
								QUICK FACTS
							</Typography>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>ROLE:</strong> FULL-STACK DEVELOPER
							</Typography>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>FOCUS:</strong> WEB APPS, ML, HARDWARE
							</Typography>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>YEAR:</strong> 2024
							</Typography>
							<Divider sx={{ my: 2 }} />
							<Typography variant="body2" sx={{ fontStyle: "italic" }}>
								I believe good software should be clear, reliable, and
								actually useful to people.
							</Typography>
						</>
					}
				>
					<p>
						I build web applications and explore different areas of technology—
						from machine learning to embedded systems. My focus is on creating
						software that works well and feels intuitive to use.
					</p>
					<p>
						Each project here represents something I've learned or built along
						the way. I enjoy tackling technical problems and turning ideas into
						working products.
					</p>
					<p>
						I care about writing clean code and building things that last. This
						site showcases my recent work and experiments.
					</p>
				</EditorialSection>

				<PullQuote>
					GOOD DESIGN IS WHEN EVERYTHING JUST FEELS RIGHT.
				</PullQuote>

				<Box sx={{ mb: 12 }}>
					<Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
						RECENT PROJECTS
					</Typography>
					<Grid container spacing={4}>
						{recentDispatchItems.map((item) => (
							<Grid size={{ xs: 12, md: 4 }} key={item.id}>
								<Box sx={{ borderTop: "4px solid black", pt: 2 }}>
									<Typography variant="caption" color="secondary">
										{item.category}
									</Typography>
									<Typography variant="h5" sx={{ my: 1 }}>
										{item.title}
									</Typography>
									<Typography variant="body2" sx={{ mb: 2 }}>
										{item.desc}
									</Typography>
									<Button
										variant="text"
										size="small"
										component={Link}
										to="/projects"
									>
										MORE →
									</Button>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			</Container>

			<Box
				sx={{
					borderTop: "1px solid black",
					py: 6,
					textAlign: "center",
					mt: 10,
				}}
			>
				<Typography variant="overline" sx={{ fontWeight: 800 }}>
					© {new Date().getFullYear()} MANAS DOSHI — ALL RIGHTS RESERVED
				</Typography>
			</Box>
		</Box>
	);
}
