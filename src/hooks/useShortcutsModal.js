import { useEffect, useState } from "react";
import { FORM_TAGS, HELP_SHORTCUT } from "@/config/shortcuts";

export default function useShortcutsModal() {
	const [shortcutsOpen, setShortcutsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (
				event.key === HELP_SHORTCUT &&
				!FORM_TAGS.includes(event.target.tagName)
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
