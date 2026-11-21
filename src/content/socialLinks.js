import rawSocialLinks from "@/content/socialLinks.json";
import { socialIcons } from "@/utils/socialIcons";

const COMMAND_META = {
	github: {
		name: "GitHub Profile",
		keywords: "external-github",
		shortcut: [],
	},
	linkedin: {
		name: "LinkedIn Profile",
		keywords: "external-linkedin",
		shortcut: ["i"],
	},
	addons: {
		name: "Mozilla Add-ons Profile",
		keywords: "external-mozilla-addons",
		shortcut: ["a"],
	},
};

export const socialEntries = rawSocialLinks.map(({ link, alt, id }) => ({
	link,
	alt,
	key: id,
	Icon: socialIcons[id],
}));

export const getSocialEntry = (key) =>
	socialEntries.find((entry) => entry.key === key);

export const emailLink = getSocialEntry("email")?.link?.replace(/^mailto:/, "");

export const socialCommands = socialEntries
	.filter((entry) => COMMAND_META[entry.key])
	.map((entry) => ({ ...entry, ...COMMAND_META[entry.key] }));
