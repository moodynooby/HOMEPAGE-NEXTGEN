import ContrastIcon from "@mui/icons-material/Contrast";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import {
	Box,
	IconButton,
	Menu,
	MenuItem,
	Switch,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from "@mui/material";
import { useState } from "react";

import { useThemeContext } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
	const { mode, setThemeMode, highContrast, toggleHighContrast } =
		useThemeContext();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
			<ToggleButtonGroup
				value={mode}
				exclusive
				onChange={(_, newMode) => newMode && setThemeMode(newMode)}
				size="small"
				sx={{
					"& .MuiToggleButton-root": {
						borderRadius: 0,
						padding: "4px 8px",
						borderColor: "divider",
						color: "text.secondary",
						"&.Mui-selected": {
							backgroundColor: "action.selected",
							color: "text.primary",
						},
					},
				}}
			>
				<ToggleButton value="light" aria-label="Use light theme">
					<LightModeIcon sx={{ fontSize: 15 }} />
				</ToggleButton>
				<ToggleButton value="system" aria-label="Use system theme">
					<SettingsBrightnessIcon sx={{ fontSize: 15 }} />
				</ToggleButton>
				<ToggleButton value="dark" aria-label="Use dark theme">
					<DarkModeIcon sx={{ fontSize: 15 }} />
				</ToggleButton>
			</ToggleButtonGroup>

			<IconButton
				onClick={handleOpenMenu}
				size="small"
				aria-label="Theme settings"
				aria-controls={anchorEl ? "theme-settings-menu" : undefined}
				aria-haspopup="true"
				sx={{
					color: "text.secondary",
					borderRadius: 0,
					border: "1px solid",
					borderColor: "divider",
					padding: "4px",
					height: "25px",
					width: "25px",
					"&:hover": {
						color: "secondary.main",
						borderColor: "secondary.main",
						bgcolor: "transparent",
					},
				}}
			>
				<ContrastIcon sx={{ fontSize: 15 }} />
			</IconButton>

			<Menu
				id="theme-settings-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
				slotProps={{
					paper: {
						sx: {
							minWidth: 200,
							mt: 1,
						},
					},
				}}
			>
				<MenuItem
					onClick={toggleHighContrast}
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Typography variant="body2">High Contrast</Typography>
					<Switch
						checked={highContrast}
						size="small"
						color="secondary"
						inputProps={{ "aria-label": "Toggle high contrast mode" }}
					/>
				</MenuItem>
			</Menu>
		</Box>
	);
}
