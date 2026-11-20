import { motion, useReducedMotion } from "motion/react";

export default function RouteLoader() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.div
			initial={shouldReduceMotion ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			role="status"
			aria-live="polite"
			aria-label="Loading page"
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				background: "var(--color-background-body, #fdffda)",
				gap: "1.5rem",
			}}
		>
			<span
				style={{
					fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
					fontSize: "0.75rem",
					letterSpacing: "0.15em",
					textTransform: "uppercase",
					color: "var(--color-text-secondary, #7d5d53)",
				}}
			>
				Loading page…
			</span>
			<div
				style={{
					width: "160px",
					height: "1px",
					background: "var(--color-accent, #7d5d53)",
					opacity: 0.6,
				}}
				aria-hidden="true"
			/>
		</motion.div>
	);
}
