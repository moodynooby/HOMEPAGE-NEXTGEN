import PropTypes from "prop-types";
import { Suspense } from "react";

/** The shared editorial section frame used by the radar, timeline and gallery. */
export default function LandingSection({
	id,
	title,
	description,
	loadingLabel,
	fallbackPadding = "2rem",
	children,
}) {
	return (
		<section
			className="editorial-container"
			id={id}
			style={{ marginTop: "4.5rem" }}
		>
			<h2 className="editorial-section-title text-center mb-2">{title}</h2>
			<p
				className="editorial-body"
				style={{
					textAlign: "center",
					fontStyle: "italic",
					color: "var(--color-text-secondary)",
					marginBottom: "2.5rem",
				}}
			>
				{description}
			</p>
			<Suspense
				fallback={
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							padding: fallbackPadding,
						}}
						role="status"
						aria-label={loadingLabel}
					>
						<div className="spinner" />
					</div>
				}
			>
				{children}
			</Suspense>
		</section>
	);
}

LandingSection.propTypes = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	loadingLabel: PropTypes.string.isRequired,
	fallbackPadding: PropTypes.string,
	children: PropTypes.node.isRequired,
};
