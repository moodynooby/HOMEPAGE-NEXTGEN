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
import { format, quality, dpr } from "@cloudinary/url-gen/actions/delivery";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { cld, fetchAllMediaByTag } from "@/utils/cloudinary";
import ButtonAppBar from "@/components/Header";

const MotionBox = motion.create(Box);

const LazyImage = ({ children, ...props }) => (
	<MotionBox
		initial={{ opacity: 0 }}
		whileInView={{ opacity: 1 }}
		viewport={{ once: true, amount: 0.1 }}
		{...props}
	>
		{children}
	</MotionBox>
);

const SUBTLE_CONTAINER_COLORS = [
	"rgba(253, 255, 218, 0.3)",
	"rgba(187, 186, 172, 0.2)",
	"rgba(200, 220, 240, 0.3)",
	"rgba(220, 200, 240, 0.3)",
	"rgba(200, 240, 200, 0.3)",
];

export default function Gallery({ limit, showAppBar = true, tag = "gallery" }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const slides = media.map((item) => {
		if (item.resource_type === "image") {
			return {
				src: cld
					.image(item.public_id)
					.resize(fill().width(1920).height(1080))
					.delivery(format("auto"))
					.delivery(quality("auto"))
					.toURL(),
			};
		} else {
			return {
				type: "video",
				sources: [
					{
						src: cld.video(item.public_id).delivery(format("mp4")).toURL(),
						type: "video/mp4",
					},
				],
				poster: cld
					.image(`${item.public_id}.jpg`)
					.resize(fill().width(1920).height(1080))
					.delivery(format("auto"))
					.delivery(quality("auto"))
					.toURL(),
			};
		}
	});

	const handleMediaClick = (index) => {
		setLightboxIndex(index);
		setLightboxOpen(true);
	};

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
							const _containerColor =
								SUBTLE_CONTAINER_COLORS[index % SUBTLE_CONTAINER_COLORS.length];

							const imageWidth = isLarge ? 800 : 400;
							const imageHeight = isTall ? 800 : isLarge ? 600 : 400;

							const cldMedia = cld
								.image(item.public_id)
								.resize(
									fill()
										.width(imageWidth)
										.height(imageHeight)
										.gravity(autoGravity()),
								)
								.delivery(format("auto"))
								.delivery(quality("auto:good"))
								.delivery(dpr("auto"));

							return (
								<LazyImage
									key={item.public_id}
									initial={{ opacity: 0, scale: 0.95 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.05 }}
									onClick={() => handleMediaClick(index)}
									sx={{
										gridColumn: isLarge ? "span 2" : "span 1",
										gridRow: isTall ? "span 2" : "span 1",
										position: "relative",
										overflow: "hidden",
										bgcolor: "surface.container",
										border: "1px solid",
										borderColor: "rgba(187, 186, 172, 0.15)",
										aspectRatio: isLarge ? "16/9" : isTall ? "3/4" : "1/1",
										cursor: "pointer",
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
												objectFit: "contain",
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
												objectFit: "contain",
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
								</LazyImage>
							);
						})}
					</Box>
				</Container>
				<Lightbox
					open={lightboxOpen}
					close={() => setLightboxOpen(false)}
					index={lightboxIndex}
					slides={slides}
					plugins={[Video, Thumbnails]}
					thumbnails={{ position: "bottom", width: 120, height: 80 }}
					video={{
						controls: true,
						autoPlay: false,
						loop: false,
						muted: false,
						playsInline: true,
					}}
				/>
			</Box>
		</>
	);
}

Gallery.propTypes = {
	limit: PropTypes.number,
	showAppBar: PropTypes.bool,
	tag: PropTypes.string,
};
