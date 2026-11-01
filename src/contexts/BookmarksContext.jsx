import PropTypes from "prop-types";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const BookmarksContext = createContext(null);

export const BookmarksContextProvider = ({ children }) => {
	const [bookmarks, setBookmarks] = useState(() => {
		try {
			const saved = localStorage.getItem("bookmarked_projects");
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			console.error("Failed to parse bookmarks from localStorage", error);
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem("bookmarked_projects", JSON.stringify(bookmarks));
		} catch (error) {
			console.error("Failed to save bookmarks to localStorage", error);
		}
	}, [bookmarks]);

	const toggleBookmark = useCallback((slug) => {
		setBookmarks((prev) => {
			if (prev.includes(slug)) {
				return prev.filter((s) => s !== slug);
			}
			return [...prev, slug];
		});
	}, []);

	const isBookmarked = useCallback(
		(slug) => {
			return bookmarks.includes(slug);
		},
		[bookmarks],
	);

	const clearBookmarks = useCallback(() => {
		setBookmarks([]);
	}, []);

	const value = {
		bookmarks,
		isBookmarked,
		toggleBookmark,
		clearBookmarks,
	};

	return (
		<BookmarksContext.Provider value={value}>
			{children}
		</BookmarksContext.Provider>
	);
};

BookmarksContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useBookmarksContext = () => {
	const context = useContext(BookmarksContext);
	if (!context) {
		return {
			bookmarks: [],
			isBookmarked: () => false,
			toggleBookmark: () => {},
			clearBookmarks: () => {},
		};
	}
	return context;
};
