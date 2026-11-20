import { lazy } from "react";

import LandingPage from "@/components/LandingPage";
import { NAV_ITEMS } from "@/nav";

const Projects = lazy(() => import("@/components/Projects"));
const ProjectDetail = lazy(() => import("@/components/ProjectDetail"));
const LinkTree = lazy(() => import("@/components/LinkTree"));
const Gallery = lazy(() => import("@/components/Gallery"));
const TechRadar = lazy(() => import("@/components/TechRadar"));

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
		path: "/radar",
		label: "Tech Stack Radar",
		element: <TechRadar />,
	},
];
