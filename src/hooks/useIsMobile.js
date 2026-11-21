import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 899px)";

export default function useIsMobile() {
	const [isMobile, setIsMobile] = useState(
		() => window.matchMedia(MOBILE_QUERY).matches,
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia(MOBILE_QUERY);
		setIsMobile(mediaQuery.matches);

		const handleChange = (event) => setIsMobile(event.matches);
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return isMobile;
}
