import { GITHUB_BASE } from "@/config/site";
import rawTimelineData from "@/content/timelineMilestones.json";

const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
	timeZone: "UTC",
	month: "long",
	day: "numeric",
	year: "numeric",
});

const formatDisplayDate = (isoDate) =>
	displayDateFormatter.format(new Date(isoDate));

export const PROJECT_CONFIG = Object.fromEntries(
	Object.entries(rawTimelineData.projectConfig).map(([key, config]) => [
		key,
		{
			...config,
			name: key,
			repoUrl: `${GITHUB_BASE}/${config.repo}`,
		},
	]),
);

export const TIMELINE_MILESTONES = rawTimelineData.milestones.map(
	(milestone) => {
		const repoUrl = PROJECT_CONFIG[milestone.project]?.repoUrl;
		return {
			...milestone,
			displayDate: formatDisplayDate(milestone.date),
			commitUrl: repoUrl ? `${repoUrl}/commit/${milestone.commit}` : "",
		};
	},
);
