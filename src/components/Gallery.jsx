import {
	Box,
	Container,
	Typography,
	useMediaQuery,
	useTheme,
	CircularProgress,
} from "@mui/material";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { cld, fetchAllMediaByTag } from "@/utils/cloudinary";
import ButtonAppBar from "@/components/Header";

const MotionBox = motion.create(Box);

export default function Gallery({ limit, showAppBar = true, tag = "gallery" }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadMedia() {
			const data = await fetchAllMediaByTag(tag);
			setMedia(limit ? data.slice(0, limit) : data);
			setLoading(false);
		}
		loadMedia();
	}, [tag, limit]);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "40vh",
				}}
			>
				<CircularProgress color="secondary" />
			</Box>
		);
	}

	return (
		<>
			{showAppBar && <ButtonAppBar />}
			<Box
				sx={{
					pt: showAppBar ? { xs: 10, md: 14 } : 4,
					pb: 8,
					position: "relative",
					minHeight: showAppBar ? "100vh" : "auto",
				}}
			>
				<Container maxWidth="xl">
					{showAppBar && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<Typography
								variant="h2"
								sx={{
									textAlign: "center",
									mb: 8,
									fontFamily: '"Newsreader", serif',
									fontWeight: 800,
									textTransform: "uppercase",
									letterSpacing: "-0.02em",
								}}
							>
								The Visual Archive
							</Typography>
							<Typography
								variant="body1"
								sx={{
									textAlign: "center",
									mb: 12,
									fontFamily: '"Noto Serif", serif',
									fontStyle: "italic",
									opacity: 0.7,
									maxWidth: 600,
									mx: "auto",
								}}
							>
								A curated collection of captured moments and kinetic studies,
								preserved for the record.
							</Typography>
						</motion.div>
					)}

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								md: "repeat(3, 1fr)",
								lg: "repeat(4, 1fr)",
							},
							gap: 4,
							gridAutoFlow: "dense",
						}}
					>
						{media.map((item, index) => {
							const isLarge =
								!isMobile && (index % 7 === 0 || index % 11 === 0);
							const isTall = !isMobile && index % 5 === 0;

							const cldMedia = cld
								.image(item.public_id)
								.resize(
									fill()
										.width(isLarge ? 800 : 400)
										.height(isTall ? 800 : isLarge ? 600 : 400)
										.gravity(autoGravity()),
								)
								.delivery(format("auto"))
								.delivery(quality("auto"));

							return (
								<MotionBox
									key={item.public_id}
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.05 }}
									sx={{
										gridColumn: isLarge ? "span 2" : "span 1",
										gridRow: isTall ? "span 2" : "span 1",
										position: "relative",
										overflow: "hidden",
										bgcolor: "surface.container",
										border: "1px solid",
										borderColor: "rgba(187, 186, 172, 0.15)",
										aspectRatio: isLarge ? "16/9" : isTall ? "3/4" : "1/1",
										"&:hover img, &:hover video": {
											filter: "grayscale(0%) contrast(100%)",
											transform: "scale(1.03)",
										},
									}}
								>
									{item.resource_type === "image" ? (
										<AdvancedImage
											cldImg={cldMedia}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												filter: "grayscale(100%) contrast(110%)",
												transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
											}}
										/>
									) : (
										<AdvancedVideo
											cldVid={cld.video(item.public_id)}
											autoPlay
											loop
											muted
											playsInline
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												filter: "grayscale(100%) contrast(110%)",
												transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
											}}
										/>
									)}

									<Box
										sx={{
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											p: 2,
											background:
												"linear-gradient(transparent, rgba(56, 57, 46, 0.6))",
											opacity: 0,
											transition: "opacity 0.4s ease",
											".motion-box:hover &": { opacity: 1 },
										}}
									>
										<Typography
											variant="label-sm"
											sx={{
												color: "#fdffda",
												fontFamily: '"Work Sans", sans-serif',
												textTransform: "uppercase",
												letterSpacing: "0.1em",
											}}
										>
											{item.resource_type === "video" ? "Kinetic" : "Static"} —{" "}
											{new Date(item.created_at).getFullYear()}
										</Typography>
									</Box>

									{item.resource_type === "video" && (
										<Box
											sx={{
												position: "absolute",
												top: 16,
												right: 16,
												width: 32,
												height: 32,
												borderRadius: "50%",
												bgcolor: "rgba(56, 57, 46, 0.4)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												backdropFilter: "blur(4px)",
												border: "1px solid rgba(253, 255, 218, 0.2)",
											}}
										>
											<Box
												sx={{
													width: 0,
													height: 0,
													borderTop: "6px solid transparent",
													borderBottom: "6px solid transparent",
													borderLeft: "10px solid #fdffda",
													ml: "2px",
												}}
											/>
										</Box>
									)}
								</MotionBox>
							);
						})}
					</Box>
				</Container>
			</Box>
		</>
	);
}

Gallery.propTypes = {
	limit: PropTypes.number,
	showAppBar: PropTypes.bool,
	tag: PropTypes.string,
};
