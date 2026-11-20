import { Lock } from "lucide-react";
import { lazy } from "react";

import LandingPage from "@/components/LandingPage";
import { NAV_ITEMS } from "@/nav";

const Projects = lazy(() => import("@/components/Projects"));
const ProjectDetail = lazy(() => import("@/components/ProjectDetail"));
const LinkTree = lazy(() => import("@/components/LinkTree"));
const Gallery = lazy(() => import("@/components/Gallery"));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const TechRadar = lazy(() => import("@/components/TechRadar"));
const ArchitectureTopology = lazy(
	() => import("@/components/ArchitectureTopology"),
);

const NAV_ELEMENTS = {
	"/": <LandingPage />,
	"/projects": <Projects />,
	"/gallery": <Gallery />,
	"/links": <LinkTree />,
};

export const APP_ROUTES = [
	...NAV_ITEMS.map((item) => ({
		path: item.to,
		label: item.label,
		nav: true,
		element: NAV_ELEMENTS[item.to],
	})),
	{
		path: "/projects/:projectName",
		label: "Project",
		element: <ProjectDetail />,
	},
	{
		path: "/admin",
		label: "Admin Dashboard",
		icon: Lock,
		keywords: "admin dashboard manage edit projects login",
		element: <AdminDashboard />,
	},
	{
		path: "/radar",
		label: "Tech Stack Radar",
		element: <TechRadar />,
	},
	{
		path: "/architecture",
		label: "Ecosystem Architecture",
		element: <ArchitectureTopology />,
	},
];
