import {
	Box,
	Button,
	Container,
	Divider,
	Grid,
	Typography,
} from "@mui/material";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import ButtonAppBar from "@/components/Header";
import Gallery from "@/components/Gallery";

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
									fontSize: { xs: "2.5rem", md: "4rem" },
									lineHeight: 1.1,
									mb: 4,
									fontWeight: 800,
								}}
							>
								STUDENT. ENGINEER.
							</Typography>
							<Typography
								variant="body1"
								sx={{ mb: 4, maxWidth: "600px", fontSize: "1.25rem" }}
							>
								Hi, I'm Manas. I build browser extensions, tinker with
								hardware-software integration, and occasionally break things
								trying to learn.
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
				</Grid>

				<Divider
					sx={{ my: 10, borderColor: "text.primary", borderWidth: "2px" }}
				/>

				<Box sx={{ mt: 16 }}>
					<Typography
						variant="h3"
						sx={{
							fontFamily: '"Newsreader", serif',
							fontWeight: 800,
							textAlign: "center",
							mb: 6,
							textTransform: "uppercase",
						}}
					>
						The Visual Dispatch
					</Typography>
					<Gallery limit={4} showAppBar={false} tag="gallery" />
					<Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
						<Button
							variant="outlined"
							color="primary"
							component={Link}
							to="/gallery"
							sx={{
								fontFamily: '"Newsreader", serif',
								fontStyle: "italic",
								px: 4,
							}}
						>
							VIEW THE FULL ARCHIVE →
						</Button>
					</Box>
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
