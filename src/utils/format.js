export const formatNumber = (value) =>
	new Intl.NumberFormat("en").format(value || 0);

export const formatCompact = (value) =>
	new Intl.NumberFormat("en", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value || 0);
