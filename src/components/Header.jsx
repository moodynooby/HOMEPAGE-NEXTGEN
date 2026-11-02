import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import WebIcon from "@mui/icons-material/Web";
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useKBar } from "kbar";
import { useState } from "react";
import { Link } from "react-router-dom";

import ThemeToggle from "@/components/ThemeToggle";
import socialLinks from "@/content/socialLinks.json";

const iconMap = {
	LinkedIn: LinkedInIcon,
	GitHub: GitHubIcon,
	Email: EmailIcon,
	Instagram: InstagramIcon,
	"Addons Profile": WebIcon,
};

const NAV_ITEMS = [
	{ label: "Home", to: "/" },
	{ label: "Projects", to: "/projects" },
	{ label: "Gallery", to: "/gallery" },
	{ label: "Directory", to: "/links" },
];

function SocialLinks() {
	return (
		<Box sx={{ display: "flex", gap: 0.75 }}>
			{socialLinks.map((social) => {
				const IconComponent = iconMap[social.alt];
				if (!IconComponent) return null;
				return (
					<IconButton
						key={social.alt}
						href={social.link}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Open ${social.alt} in a new tab`}
						size="small"
						sx={{
							color: "text.secondary",
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 0,
							transition: "color 0.25s ease, border-color 0.25s ease",
							"&:hover": {
								color: "secondary.main",
								borderColor: "secondary.main",
								bgcolor: "transparent",
							},
						}}
					>
						<IconComponent fontSize="small" />
					</IconButton>
				);
			})}
		</Box>
	);
}

export default function ButtonAppBar() {
	const [menuAnchorEl, setMenuAnchorEl] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { query } = useKBar();

	const currentDate = new Date()
		.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		})
		.toUpperCase();

	return (
		<Box component="header">
			<Box
				sx={{
					pt: { xs: 5, md: 7 },
					pb: 2.5,
					px: 2,
					textAlign: "center",
				}}
			>
				<Typography
					variant="h1"
					component={Link}
					to="/"
					sx={{
						display: "block",
						fontSize: { xs: "2.6rem", md: "4.25rem" },
						color: "text.primary",
						textDecoration: "none",
						mb: 2,
						fontWeight: 800,
						lineHeight: 1,
						transition: "opacity 0.3s ease",
						"&:hover": { opacity: 0.85 },
					}}
				>
					MANAS DOSHI TIMES
				</Typography>

				<Box
					sx={{
						borderTop: `2px solid ${theme.palette.text.primary}`,
						borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.35)}`,
						py: 0.75,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						maxWidth: "1200px",
						mx: "auto",
					}}
				>
					<Typography variant="overline">Manas Doshi</Typography>
					<Typography
						variant="overline"
						sx={{ display: { xs: "none", sm: "block" } }}
					>
						{currentDate}
					</Typography>
					<Typography
						variant="overline"
						sx={{ display: { sm: "none" }, letterSpacing: "0.08em" }}
					>
						Personal Archive
					</Typography>
					<Typography variant="overline">Est. MMXXIV</Typography>
				</Box>
			</Box>

			<AppBar position="sticky" elevation={0}>
				<Toolbar
					variant="dense"
					sx={{
						justifyContent: "center",
						gap: { xs: 1, md: 2 },
						minHeight: "52px !important",
					}}
				>
					{!isMobile &&
						NAV_ITEMS.map((item) => (
							<Button
								key={item.to}
								component={Link}
								to={item.to}
								color="inherit"
								sx={{ px: 1.5 }}
							>
								{item.label}
							</Button>
						))}
					{isMobile && (
						<IconButton
							onClick={(event) => setMenuAnchorEl(event.currentTarget)}
							color="inherit"
							aria-label="Open navigation menu"
							aria-controls={
								menuAnchorEl ? "mobile-navigation-menu" : undefined
							}
							aria-haspopup="menu"
							size="small"
							sx={{ borderRadius: 0 }}
						>
							<MenuIcon />
						</IconButton>
					)}

					<Box sx={{ width: "1px", height: "20px", bgcolor: "divider" }} />

					<Button
						onClick={query.toggle}
						color="inherit"
						startIcon={<SearchIcon fontSize="small" />}
						sx={{ px: 1.5 }}
						aria-label="Open command palette"
					>
						Search
					</Button>

					<Box sx={{ width: "1px", height: "20px", bgcolor: "divider" }} />

					<ThemeToggle />

					{!isMobile && (
						<>
							<Box sx={{ width: "1px", height: "20px", bgcolor: "divider" }} />
							<SocialLinks />
						</>
					)}
				</Toolbar>
			</AppBar>

			<Menu
				id="mobile-navigation-menu"
				anchorEl={menuAnchorEl}
				open={Boolean(menuAnchorEl)}
				onClose={() => setMenuAnchorEl(null)}
				slotProps={{
					paper: {
						sx: {
							minWidth: 200,
							mt: 1,
						},
					},
				}}
			>
				{NAV_ITEMS.map((item) => (
					<MenuItem
						key={item.to}
						component={Link}
						to={item.to}
						onClick={() => setMenuAnchorEl(null)}
					>
						{item.label}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}
