import { Box, CircularProgress, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";

export default function RouteLoader() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<Box
			component={motion.div}
			initial={shouldReduceMotion ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={shouldReduceMotion ? undefined : { opacity: 0 }}
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
				gap: 2,
			}}
		>
			<CircularProgress
				size={52}
				thickness={3}
				aria-label="Loading"
				sx={{
					color: "secondary.main",
					...(shouldReduceMotion
						? {}
						: {
								"@keyframes pulse": {
									"0%": {
										boxShadow: "0 0 0 0 rgba(125, 93, 83, 0.4)",
									},
									"70%": {
										boxShadow: "0 0 0 20px rgba(125, 93, 83, 0)",
									},
									"100%": {
										boxShadow: "0 0 0 0 rgba(125, 93, 83, 0)",
									},
								},
								animation: "pulse 2s infinite",
							}),
				}}
			/>
			<Typography variant="body2" color="text.secondary">
				Loading page…
			</Typography>
			{!shouldReduceMotion && (
				<Box
					component={motion.div}
					initial={{ width: 0 }}
					animate={{ width: "200px" }}
					transition={{ duration: 1.5, repeat: Infinity }}
					aria-hidden="true"
					sx={{
						height: "2px",
						bgcolor: "secondary.main",
						opacity: 0.5,
					}}
				/>
			)}
		</Box>
	);
}
