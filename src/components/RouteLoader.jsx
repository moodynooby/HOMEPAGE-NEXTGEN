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
			className="route-loader-screen"
		>
			<span className="overline">Loading page…</span>
			<div className="route-loader-bar" aria-hidden="true" />
		</motion.div>
	);
}
