import PropTypes from "prop-types";
import { Suspense } from "react";

export default function LandingSection({
	id,
	title,
	description,
	loadingLabel,
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
							padding: "4rem 0",
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
	children: PropTypes.node.isRequired,
};
