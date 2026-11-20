export const PROJECT_CATEGORIES = [
	"Web App",
	"Browser Extension",
	"Game",
	"AI Tool",
	"Computer Vision",
];

export const orderCategories = (categories) => [
	...PROJECT_CATEGORIES.filter((category) => categories.includes(category)),
	...new Set(
		categories.filter((category) => !PROJECT_CATEGORIES.includes(category)),
	),
];
