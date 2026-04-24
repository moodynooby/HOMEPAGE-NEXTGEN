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
		category: "BROWSER EXT",
		desc: "Volume slider that doesn't suck.",
	},
	{
		id: "gimme-that",
		title: "GIMME THAT",
		category: "DEV TOOLS",
		desc: "Grab any npm package as a file.",
	},
	{
		id: "paceplay",
		title: "PACEPLAY",
		category: "EMBEDDED",
		desc: "Gamepad input library for embedded systems.",
	},
];

// EditorialSection.propTypes = {
// 	title: PropTypes.string.isRequired,
// 	children: PropTypes.node.isRequired,
// 	sideContent: PropTypes.node,
// };	

export default function LandingPage() {
	return (
		<Box sx={{ minHeight: "100vh", pb: 8 }}>
			<ButtonAppBar />

			<Container maxWidth="lg" sx={{ mt: 6 }}>
				<Grid container spacing={4} alignItems="center">
					<Grid size={{ xs: 12, md: 10, mdOffset: 1 }}>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Typography
								variant="h2"
								sx={{
									fontSize: { xs: '2.5rem', md: '4rem' },
									lineHeight: 1.1,
									mb: 4,
									fontWeight: 800,
								}}
							>
								STUDENT. ENGINEER.
							</Typography>
							<Typography
								variant="body1"
								sx={{ mb: 4, maxWidth: '600px', fontSize: '1.25rem' }}
							>
								Hi, I'm Manas. I build browser extensions, tinker with
								hardware-software integration, and occasionally break things
								trying to learn.
							</Typography>
							<Box sx={{ display: 'flex', gap: 2 }}>
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
				</Grid>

				<Divider
					sx={{ my: 10, borderColor: "text.primary", borderWidth: "2px" }}
				/>

				{/* <EditorialSection
					title="About Me"
					sideContent={
						<>
							<Typography variant="h6" sx={{ mb: 2 }}>
								STUFF
							</Typography>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>BUILDING:</strong> BROWSER EXTENSIONS, HARDWARE PROJECTS
							</Typography>
							<Typography variant="body2" sx={{ mb: 1 }}>
								<strong>YEAR:</strong> 2024
							</Typography>
							<Divider sx={{ my: 2 }} />
							<Typography variant="body2" sx={{ fontStyle: "italic" }}>
								Currently working on embedded systems and browser tooling.
							</Typography>
						</>
					}
				>
					<p>
						I build things that solve problems I actually have. Most of my
						projects are browser extensions or hardware-related — that's where I
						find the most interesting challenges.
					</p>
					<p>
						Currently in my final year, trying to ship useful things before
						graduation. Everything here is something I built because I needed it
						or wanted to understand how it works.
					</p>
					<p>
						I write most of my code in Rust and JavaScript. Currently figuring
						out USB HID drivers for gamepads.
					</p>
				</EditorialSection> */}

				{/* <Box sx={{ mb: 12 }}>
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
				</Box> */}
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
