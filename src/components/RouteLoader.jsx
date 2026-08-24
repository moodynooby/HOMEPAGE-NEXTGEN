import { Box, LinearProgress, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";

export default function RouteLoader() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<Box
			component={motion.div}
			initial={shouldReduceMotion ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			role="status"
			aria-live="polite"
			aria-label="Loading page"
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				bgcolor: "background.default",
				gap: 3,
			}}
		>
			<Typography variant="overline" color="text.secondary">
				Loading page…
			</Typography>
			<LinearProgress
				color="secondary"
				sx={{ width: 160, height: "1px" }}
				aria-hidden="true"
			/>
		</Box>
	);
}
