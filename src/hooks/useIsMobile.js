import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 900) {
	const query =
		typeof breakpoint === "string"
			? breakpoint
			: `(max-width: ${breakpoint - 1}px)`;

	const [isMobile, setIsMobile] = useState(() => {
		if (
			typeof window === "undefined" ||
			typeof window.matchMedia !== "function"
		) {
			return false;
		}
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		if (
			typeof window === "undefined" ||
			typeof window.matchMedia !== "function"
		) {
			return;
		}

		const mql = window.matchMedia(query);
		setIsMobile(mql.matches);

		const handler = (e) => {
			setIsMobile(e.matches);
		};

		if (mql.addEventListener) {
			mql.addEventListener("change", handler);
		} else if (mql.addListener) {
			mql.addListener(handler);
		}

		return () => {
			if (mql.removeEventListener) {
				mql.removeEventListener("change", handler);
			} else if (mql.removeListener) {
				mql.removeListener(handler);
			}
		};
	}, [query]);

	return isMobile;
}

export { useIsMobile };
