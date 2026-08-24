import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import {
	Box,
	CircularProgress,
	Container,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ButtonAppBar from "@/components/Header";
import { cld, fetchAllMediaByTag } from "@/utils/cloudinary";

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
							transition={{ duration: 0.7 }}
						>
							<Typography
								variant="h2"
								component="h1"
								sx={{
									textAlign: "center",
									mb: 1,
									fontSize: { xs: "2rem", sm: "2.6rem", md: "3.25rem" },
								}}
							>
								The Visual Archive
							</Typography>
							<Typography
								variant="body2"
								component="p"
								sx={{
									textAlign: "center",
									fontStyle: "italic",
									color: "text.secondary",
									mb: { xs: 6, md: 10 },
								}}
							>
								Captured moments and kinetic studies, preserved for the record.
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
									initial={{ opacity: 0, scale: 0.97 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.5,
										delay: Math.min(index, 8) * 0.04,
									}}
									onClick={() => handleMediaClick(index)}
									sx={{
										gridColumn: isLarge ? "span 2" : "span 1",
										gridRow: isTall ? "span 2" : "span 1",
										position: "relative",
										overflow: "hidden",
										bgcolor: "background.paper",
										border: "1px solid",
										borderColor: "divider",
										aspectRatio: isLarge ? "16/9" : isTall ? "3/4" : "1/1",
										cursor: "pointer",
										"&:hover img, &:hover video": {
											filter: "grayscale(0%) contrast(100%)",
											transform: "scale(1.02)",
										},
										"&:hover .gallery-caption": { opacity: 1 },
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
												transition: "filter 0.6s ease, transform 0.6s ease",
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
												transition: "filter 0.6s ease, transform 0.6s ease",
											}}
										/>
									)}

									<Box
										className="gallery-caption"
										sx={{
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											py: 1,
											px: 2,
											bgcolor: (th) =>
												alpha(th.palette.background.default, 0.82),
											borderTop: "1px solid",
											borderColor: "divider",
											backdropFilter: "blur(6px)",
											opacity: 0,
											transition: "opacity 0.4s ease",
										}}
									>
										<Typography variant="overline" color="text.primary">
											{item.resource_type === "video" ? "Kinetic" : "Static"}
											{" · "}
											{new Date(item.created_at).getFullYear()}
										</Typography>
									</Box>

									{item.resource_type === "video" && (
										<Box
											sx={{
												position: "absolute",
												top: 12,
												right: 12,
												width: 28,
												height: 28,
												bgcolor: (th) =>
													alpha(th.palette.background.default, 0.7),
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												backdropFilter: "blur(4px)",
												border: "1px solid",
												borderColor: "divider",
											}}
										>
											<Box
												sx={{
													width: 0,
													height: 0,
													borderTop: "5px solid transparent",
													borderBottom: "5px solid transparent",
													borderLeft: `8px solid ${theme.palette.text.primary}`,
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
