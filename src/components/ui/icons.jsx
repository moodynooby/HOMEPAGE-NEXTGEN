import {
	AlertTriangle,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ArrowUpDown,
	Calendar,
	CheckCircle,
	ExternalLink,
	Eye,
	Filter,
	GitCommit,
	Globe,
	LogOut,
	Bookmark as LucideBookmark,
	CloudUpload as LucideCloudUpload,
	Download as LucideDownload,
	Edit as LucideEdit,
	Key as LucideKey,
	Lock as LucideLock,
	Search as LucideSearch,
	Star as LucideStar,
	Plus,
	RefreshCw,
	RotateCcw,
	Share2,
	Tag,
	Trash2,
	Wand2,
	X,
} from "lucide-react";

const wrap =
	(Icon, defaultProps = {}) =>
	(props) => {
		const size =
			props.fontSize === "small"
				? 16
				: props.fontSize === "inherit"
					? "1em"
					: 20;
		return <Icon size={size} strokeWidth={1.5} {...defaultProps} {...props} />;
	};

export const GitHubSvg = (props) => {
	const size = props.fontSize === "small" ? 16 : 20;
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			stroke="currentColor"
			strokeWidth="1.5"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<title>GitHub</title>
			<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</svg>
	);
};

export const Close = wrap(X);
export const CloseIcon = wrap(X);
export const ClearIcon = wrap(X);
export const Search = wrap(LucideSearch);
export const SearchIcon = wrap(LucideSearch);
export const RestartAlt = wrap(RotateCcw);
export const RestartAltIcon = wrap(RotateCcw);
export const CalendarTodayIcon = wrap(Calendar);
export const CommitIcon = wrap(GitCommit);
export const FilterAltIcon = wrap(Filter);
export const LaunchIcon = wrap(ExternalLink);
export const SwapVertIcon = wrap(ArrowUpDown);
export const ArrowForward = wrap(ArrowRight);
export const ArrowBack = wrap(ArrowLeft);
export const ArrowUpward = wrap(ArrowUp);
export const ArrowDownward = wrap(ArrowDown);
export const Bookmark = wrap(LucideBookmark, { fill: "currentColor" });
export const BookmarkBorder = wrap(LucideBookmark);
export const Share = wrap(Share2);
export const Key = wrap(LucideKey);
export const VpnKey = wrap(LucideKey);
export const Lock = wrap(LucideLock);
export const AutoFixHigh = wrap(Wand2);
export const Star = wrap(LucideStar, { fill: "currentColor" });
export const StarBorder = wrap(LucideStar);
export const Add = wrap(Plus);
export const Delete = wrap(Trash2);
export const Edit = wrap(LucideEdit);
export const Logout = wrap(LogOut);
export const Refresh = wrap(RefreshCw);
export const CloudUpload = wrap(LucideCloudUpload);
export const Download = wrap(LucideDownload);
export const GitHub = GitHubSvg;
export const GitHubIcon = GitHubSvg;
export const TagIcon = wrap(Tag);
export const EyeIcon = wrap(Eye);
export const GlobeIcon = wrap(Globe);
export const CheckCircleIcon = wrap(CheckCircle);
export const AlertTriangleIcon = wrap(AlertTriangle);

export default Close;
