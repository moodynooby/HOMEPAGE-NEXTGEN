import { FolderGit2, Home, Image, User } from "lucide-react";
import { lazy } from "react";

const LandingPage = lazy(() => import("@/components/LandingPage"));
const Projects = lazy(() => import("@/components/Projects"));
const ProjectDetail = lazy(() => import("@/components/ProjectDetail"));
const LinkTree = lazy(() => import("@/components/LinkTree"));
const Gallery = lazy(() => import("@/components/Gallery"));
const TechRadar = lazy(() => import("@/components/TechRadar"));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));

export const APP_ROUTES = [
	{
		path: "/",
		label: "Home",
		nav: true,
		icon: Home,
		shortcut: "h",
		keywords: "go-home",
		component: LandingPage,
	},
	{
		path: "/projects",
		label: "Projects",
		nav: true,
		icon: FolderGit2,
		shortcut: "p",
		keywords: "go-projects",
		component: Projects,
	},
	{
		path: "/gallery",
		label: "Gallery",
		nav: true,
		icon: Image,
		shortcut: "g",
		keywords: "go-gallery-photos-videos",
		component: Gallery,
	},
	{
		path: "/links",
		label: "Directory",
		nav: true,
		icon: User,
		shortcut: "l",
		keywords: "go-links-profile",
		component: LinkTree,
	},
	{
		path: "/projects/:projectName",
		label: "Project",
		component: ProjectDetail,
	},
	{
		path: "/radar",
		label: "Tech Stack Radar",
		component: TechRadar,
	},
	{
		path: "/admin",
		label: "Curator Admin",
		component: AdminDashboard,
	},
];

export const NAV_ITEMS = APP_ROUTES.filter((route) => route.nav);
