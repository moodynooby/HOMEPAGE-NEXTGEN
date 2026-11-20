import {
	Collections as GalleryIcon,
	Home as HomeIcon,
	Person as ProfileIcon,
	AccountTree as ProjectsIcon,
} from "@mui/icons-material";

export const NAV_ITEMS = [
	{
		to: "/",
		label: "Home",
		icon: HomeIcon,
		shortcut: "h",
		keywords: "go-home",
	},
	{
		to: "/projects",
		label: "Projects",
		icon: ProjectsIcon,
		shortcut: "p",
		keywords: "go-projects",
	},
	{
		to: "/gallery",
		label: "Gallery",
		icon: GalleryIcon,
		shortcut: "g",
		keywords: "go-gallery-photos-videos",
	},
	{
		to: "/links",
		label: "Directory",
		icon: ProfileIcon,
		shortcut: "l",
		keywords: "go-links-profile",
	},
];
