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
import { lazy, Suspense } from "react";

import ButtonAppBar from "@/components/Header";
import RouteLoader from "@/components/RouteLoader";

const Gallery = lazy(() => import("@/components/Gallery"));

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
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 6 }}>
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
										rel="noopener noreferrer"
									>
										VIEW RESUME
									</Button>
								</Box>

								{/* Automated GitHub Stats Card - Low Upkeep, High Impact */}
								<Box sx={{ mt: 4, opacity: 0.9 }}>
									<Box
										component="img"
										src="https://github-readme-stats.vercel.app/api?username=moodynooby&show_icons=true&theme=transparent&title_color=38392e&text_color=7d5d53&icon_color=7d5d53&border_color=38392e&hide_border=true&bg_color=00000000"
										alt="GitHub Stats"
										sx={{
											maxWidth: "100%",
											height: "auto",
											display: { xs: "none", sm: "block" },
											filter: "contrast(1.1)",
										}}
									/>
									<Box
										component="img"
										src="https://github-readme-stats.vercel.app/api/top-langs/?username=moodynooby&layout=compact&theme=transparent&title_color=38392e&text_color=7d5d53&border_color=38392e&hide_border=true&bg_color=00000000"
										alt="Top Languages"
										sx={{
											mt: 2,
											maxWidth: "100%",
											height: "auto",
											display: { xs: "none", sm: "block" },
											filter: "contrast(1.1)",
										}}
									/>
								</Box>
						</motion.div>
					</Grid>
				</Grid>

				<Divider
					sx={{ my: 10, borderColor: "text.primary", borderWidth: "2px" }}
				/>

				{/* <Box sx={{ mt: 16 }}>
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
					<Suspense fallback={<RouteLoader />}>
						<Gallery limit={4} showAppBar={false} />
					</Suspense>
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
