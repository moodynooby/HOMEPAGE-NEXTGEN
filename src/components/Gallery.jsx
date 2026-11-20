import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Header from "@/components/Header";
import { cld, fetchAllMediaByTag } from "@/utils/cloudinary";

export default function Gallery({ limit, showAppBar = true, tag = "gallery" }) {
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
		}
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
			<div
				className="flex justify-center items-center"
				style={{ minHeight: "40vh" }}
			>
				<span className="spinner" />
			</div>
		);
	}

	return (
		<>
			{showAppBar && <Header />}
			<div
				style={{
					paddingTop: showAppBar ? "5rem" : "1.5rem",
					paddingBottom: "3rem",
					position: "relative",
					minHeight: showAppBar ? "100vh" : "auto",
				}}
			>
				<div className="container">
					{showAppBar && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
							style={{ textAlign: "center", marginBottom: "3rem" }}
						>
							<h1 className="mb-2">The Visual Archive</h1>
							<p
								className="caption text-secondary"
								style={{ fontStyle: "italic" }}
							>
								Captured moments and kinetic studies, preserved for the record.
							</p>
						</motion.div>
					)}

					<div className="gallery-grid">
						{media.map((item, index) => {
							const isLarge = index % 7 === 0 || index % 11 === 0;
							const isTall = index % 5 === 0;
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
								<motion.div
									key={item.public_id}
									initial={{ opacity: 0, scale: 0.97 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.5,
										delay: Math.min(index, 8) * 0.04,
									}}
									onClick={() => handleMediaClick(index)}
									className={`gallery-item ${isLarge ? "large" : isTall ? "tall" : ""}`}
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

									<div className="gallery-caption">
										<span className="overline">
											{item.resource_type === "video" ? "Kinetic" : "Static"}
											{" · "}
											{new Date(item.created_at).getFullYear()}
										</span>
									</div>

									{item.resource_type === "video" && (
										<span
											className="badge"
											style={{
												position: "absolute",
												top: 12,
												right: 12,
												backgroundColor:
													"var(--color-background-surface, #fdffda)",
												padding: "2px 6px",
											}}
										>
											▶
										</span>
									)}
								</motion.div>
							);
						})}
					</div>
				</div>
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
			</div>
		</>
	);
}

Gallery.propTypes = {
	limit: PropTypes.number,
	showAppBar: PropTypes.bool,
	tag: PropTypes.string,
};
