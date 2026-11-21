import { FolderGit2, Image, Info } from "lucide-react";

export const SECTION_IDS = {
	about: "about-section",
	projects: "projects-section",
	experience: "experience-section",
	timeline: "timeline-section",
	radar: "tech-radar-section",
};

export const JUMP_SECTIONS = [
	{
		id: SECTION_IDS.projects,
		name: "Jump to Section: Projects",
		keywords: "jump navigate section projects featured",
		Icon: FolderGit2,
	},
	{
		id: SECTION_IDS.experience,
		name: "Jump to Section: Experience",
		keywords: "jump navigate section experience visual archive",
		Icon: Image,
	},
	{
		id: SECTION_IDS.about,
		name: "Jump to Section: About",
		keywords: "jump navigate section about intro",
		Icon: Info,
	},
];
