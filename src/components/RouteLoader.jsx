import { Box, CircularProgress } from "@mui/material";
import { motion } from "motion/react";

export default function RouteLoader() {
	return (
		<Box
			component={motion.div}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
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
			<CircularProgress
				size={60}
				thickness={3}
				sx={{
					color: "secondary.main",
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
				}}
			/>
			<Box
				component={motion.div}
				initial={{ width: 0 }}
				animate={{ width: "200px" }}
				transition={{ duration: 1.5, repeat: Infinity }}
				sx={{
					height: "2px",
					bgcolor: "secondary.main",
					opacity: 0.5,
				}}
			/>
		</Box>
	);
}
