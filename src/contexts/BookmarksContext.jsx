import PropTypes from "prop-types";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { STORAGE_KEYS } from "@/config/storage";

const BookmarksContext = createContext();

export const BookmarksContextProvider = ({ children }) => {
	const [bookmarks, setBookmarks] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.bookmarks);
			return saved ? JSON.parse(saved) : [];
		} catch (_error) {
			return [];
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
		} catch (_error) {
			// Storage may be unavailable.
		}
	}, [bookmarks]);

	const toggleBookmark = useCallback((slug) => {
		setBookmarks((prev) =>
			prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
		);
	}, []);

	const isBookmarked = useCallback(
		(slug) => bookmarks.includes(slug),
		[bookmarks],
	);

	const value = {
		bookmarks,
		isBookmarked,
		toggleBookmark,
	};

	return (
		<BookmarksContext.Provider value={value}>
			{children}
		</BookmarksContext.Provider>
	);
};

BookmarksContextProvider.propTypes = {
	children: PropTypes.node,
};

export const useBookmarksContext = () => {
	const context = useContext(BookmarksContext);
	if (!context) {
		throw new Error(
			"useBookmarksContext must be used within a BookmarksContextProvider",
		);
	}
	return context;
};
