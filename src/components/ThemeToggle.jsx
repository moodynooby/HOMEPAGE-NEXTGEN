import { Contrast, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";

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
				<button
					type="button"
					aria-label="Use light theme"
					aria-pressed={mode === "light"}
					onClick={() => setMode("light")}
					className="theme-toggle-btn"
				>
					<Sun size={15} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					aria-label="Use system theme"
					aria-pressed={mode === "system"}
					onClick={() => setMode("system")}
					className="theme-toggle-btn"
				>
					<Monitor size={15} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					aria-label="Use dark theme"
					aria-pressed={mode === "dark"}
					onClick={() => setMode("dark")}
					className="theme-toggle-btn"
				>
					<Moon size={15} strokeWidth={1.5} />
				</button>
			</div>

			<div ref={menuRef} style={{ position: "relative" }}>
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
								style={{
									cursor: "pointer",
									accentColor: "var(--color-accent)",
								}}
							/>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
