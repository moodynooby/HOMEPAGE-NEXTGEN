import { useMemo } from "react";
import useProjectsData from "@/hooks/useProjectsData";

export const RADAR_RINGS = ["Adopt", "Trial", "Assess", "Hold"];
export const RADAR_QUADRANTS = [
	"Languages",
	"Frontend/UI",
	"Backend/Data",
	"DevOps/Cloud",
];

const CURRENT_YEAR = new Date().getFullYear();

const TOPIC_METADATA = {
	react: { name: "React", quadrant: "Frontend/UI" },
	reactjs: { name: "React", quadrant: "Frontend/UI" },
	vite: { name: "Vite", quadrant: "Frontend/UI" },
	tailwindcss: { name: "Tailwind CSS", quadrant: "Frontend/UI" },
	tailwind: { name: "Tailwind CSS", quadrant: "Frontend/UI" },
	css: { name: "CSS", quadrant: "Frontend/UI" },
	webextension: { name: "WebExtensions", quadrant: "Frontend/UI" },
	"browser-extension": { name: "WebExtensions", quadrant: "Frontend/UI" },
	"firefox-addon": { name: "WebExtensions", quadrant: "Frontend/UI" },
	"chrome-extension": { name: "WebExtensions", quadrant: "Frontend/UI" },
	threejs: { name: "Three.js", quadrant: "Frontend/UI" },
	canvas: { name: "HTML5 Canvas", quadrant: "Frontend/UI" },
	vue: { name: "Vue", quadrant: "Frontend/UI" },
	nextjs: { name: "Next.js", quadrant: "Frontend/UI" },
	nodejs: { name: "Node.js", quadrant: "Backend/Data" },
	node: { name: "Node.js", quadrant: "Backend/Data" },
	express: { name: "Express", quadrant: "Backend/Data" },
	sqlite: { name: "SQLite", quadrant: "Backend/Data" },
	postgres: { name: "PostgreSQL", quadrant: "Backend/Data" },
	postgresql: { name: "PostgreSQL", quadrant: "Backend/Data" },
	supabase: { name: "Supabase", quadrant: "Backend/Data" },
	fastapi: { name: "FastAPI", quadrant: "Backend/Data" },
	flask: { name: "Flask", quadrant: "Backend/Data" },
	ai: { name: "Generative AI", quadrant: "Backend/Data" },
	llm: { name: "Generative AI", quadrant: "Backend/Data" },
	"machine-learning": { name: "Machine Learning", quadrant: "Backend/Data" },
	"computer-vision": { name: "Computer Vision", quadrant: "Backend/Data" },
	docker: { name: "Docker", quadrant: "DevOps/Cloud" },
	netlify: { name: "Netlify", quadrant: "DevOps/Cloud" },
	vercel: { name: "Vercel", quadrant: "DevOps/Cloud" },
	"github-actions": { name: "GitHub Actions", quadrant: "DevOps/Cloud" },
	ci: { name: "CI/CD", quadrant: "DevOps/Cloud" },
	aws: { name: "AWS", quadrant: "DevOps/Cloud" },
	linux: { name: "Linux", quadrant: "DevOps/Cloud" },
};

const CATEGORY_INFERENCES = {
	"Browser Extension": { name: "WebExtensions", quadrant: "Frontend/UI" },
	"Web App": { name: "React", quadrant: "Frontend/UI" },
	"AI Tool": { name: "Generative AI", quadrant: "Backend/Data" },
	"Computer Vision": { name: "Computer Vision", quadrant: "Backend/Data" },
};

function determineRing(matchingProjects) {
	const count = matchingProjects.length;
	const latestPush = matchingProjects.reduce((latest, p) => {
		const ts = p.pushed_at ? new Date(p.pushed_at).getTime() : 0;
		return Math.max(latest, ts);
	}, 0);
	const monthsSincePush = latestPush
		? (Date.now() - latestPush) / (1000 * 60 * 60 * 24 * 30)
		: Infinity;

	if (count >= 3 || (count >= 2 && monthsSincePush <= 18)) return "Adopt";
	if (count >= 2 || monthsSincePush <= 24) return "Trial";
	return "Assess";
}

function buildBlip(id, name, quadrant, matchingProjects) {
	const projectNames = matchingProjects.map((p) => p.githubName);
	const minYear = matchingProjects.reduce((earliest, p) => {
		const y = Number(p.year);
		return !Number.isNaN(y) && y > 2000 ? Math.min(earliest, y) : earliest;
	}, CURRENT_YEAR);

	return {
		id,
		name,
		quadrant,
		ring: determineRing(matchingProjects),
		yoe: Math.max(1, CURRENT_YEAR - minYear + 1),
		keyRepos: projectNames.slice(0, 3),
		projects: projectNames,
		source: "github",
	};
}

export default function useTechRadarData() {
	const { projects, loading } = useProjectsData();

	const blips = useMemo(() => {
		const grouped = new Map();

		const addTech = (name, quadrant, project) => {
			const key = `${quadrant}::${name.toLowerCase()}`;
			if (!grouped.has(key)) {
				grouped.set(key, { name, quadrant, projects: new Map() });
			}
			grouped.get(key).projects.set(project.githubName, project);
		};

		for (const project of projects) {
			const lang = project.language?.trim();
			if (lang) {
				addTech(lang, "Languages", project);
			}

			for (const topic of project.topics || []) {
				const mapped = TOPIC_METADATA[topic.toLowerCase()];
				if (mapped) {
					addTech(mapped.name, mapped.quadrant, project);
				}
			}

			const categoryTech = CATEGORY_INFERENCES[project.category];
			if (categoryTech) {
				addTech(categoryTech.name, categoryTech.quadrant, project);
			}
		}

		let nextId = 1;
		return Array.from(grouped.values())
			.map((entry) =>
				buildBlip(
					`github-${nextId++}`,
					entry.name,
					entry.quadrant,
					Array.from(entry.projects.values()),
				),
			)
			.sort((a, b) => b.projects.length - a.projects.length || b.yoe - a.yoe);
	}, [projects]);

	return {
		rings: RADAR_RINGS,
		quadrants: RADAR_QUADRANTS,
		blips,
		loading,
	};
}
