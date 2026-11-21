import { Contrast } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { THEME_MODE_ICONS, THEME_MODES } from "@/theme/themeConfig";

export default function ThemeToggle() {
	const { mode, setMode, highContrast, toggleHighContrast } = useThemeContext();
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	return (
		<div className="theme-toggle">
			<div role="group" className="theme-toggle-group">
				{THEME_MODES.map((themeMode) => {
					const ModeIcon = THEME_MODE_ICONS[themeMode];
					return (
						<button
							key={themeMode}
							type="button"
							aria-label={`Use ${themeMode} theme`}
							aria-pressed={mode === themeMode}
							onClick={() => setMode(themeMode)}
							className="theme-toggle-btn"
						>
							<ModeIcon size={15} strokeWidth={1.5} />
						</button>
					);
				})}
			</div>

			<div ref={menuRef} className="relative">
				<button
					type="button"
					aria-label="Theme settings"
					aria-haspopup="true"
					aria-expanded={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					className="theme-settings-btn"
				>
					<Contrast size={15} strokeWidth={1.5} />
				</button>

				{isOpen && (
					<div className="theme-settings-popover">
						<button
							type="button"
							onClick={toggleHighContrast}
							className="theme-setting-item"
						>
							<span>High Contrast</span>
							<input
								type="checkbox"
								checked={highContrast}
								readOnly
								aria-label="Toggle high contrast mode"
								className="theme-checkbox"
							/>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
