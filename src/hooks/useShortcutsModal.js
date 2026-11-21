import { useEffect, useState } from "react";

/** Listens for "?" outside form fields and owns the cheatsheet's open state. */
export default function useShortcutsModal() {
	const [shortcutsOpen, setShortcutsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (
				event.key === "?" &&
				!["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
			) {
				event.preventDefault();
				setShortcutsOpen(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return [shortcutsOpen, setShortcutsOpen];
}
