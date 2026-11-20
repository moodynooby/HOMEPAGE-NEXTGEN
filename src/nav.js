import { FolderGit2, Home, Image, User } from "lucide-react";

export const NAV_ITEMS = [
	{
		to: "/",
		label: "Home",
		icon: Home,
		shortcut: "h",
		keywords: "go-home",
	},
	{
		to: "/projects",
		label: "Projects",
		icon: FolderGit2,
		shortcut: "p",
		keywords: "go-projects",
	},
	{
		to: "/gallery",
		label: "Gallery",
		icon: Image,
		shortcut: "g",
		keywords: "go-gallery-photos-videos",
	},
	{
		to: "/links",
		label: "Directory",
		icon: User,
		shortcut: "l",
		keywords: "go-links-profile",
	},
];
