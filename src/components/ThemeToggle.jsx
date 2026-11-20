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
		<div
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: "6px",
				position: "relative",
			}}
		>
			<div
				role="group"
				style={{
					display: "inline-flex",
					border: "1px solid var(--color-border)",
				}}
			>
				<button
					type="button"
					aria-label="Use light theme"
					aria-pressed={mode === "light"}
					onClick={() => setMode("light")}
					style={{
						background:
							mode === "light"
								? "var(--color-overlay-pressed, rgba(56, 57, 46, 0.12))"
								: "transparent",
						border: "none",
						borderRight: "1px solid var(--color-border)",
						color:
							mode === "light"
								? "var(--color-text-primary)"
								: "var(--color-text-secondary)",
						padding: "5px 8px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
					}}
				>
					<Sun size={15} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					aria-label="Use system theme"
					aria-pressed={mode === "system"}
					onClick={() => setMode("system")}
					style={{
						background:
							mode === "system"
								? "var(--color-overlay-pressed, rgba(56, 57, 46, 0.12))"
								: "transparent",
						border: "none",
						borderRight: "1px solid var(--color-border)",
						color:
							mode === "system"
								? "var(--color-text-primary)"
								: "var(--color-text-secondary)",
						padding: "5px 8px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
					}}
				>
					<Monitor size={15} strokeWidth={1.5} />
				</button>
				<button
					type="button"
					aria-label="Use dark theme"
					aria-pressed={mode === "dark"}
					onClick={() => setMode("dark")}
					style={{
						background:
							mode === "dark"
								? "var(--color-overlay-pressed, rgba(56, 57, 46, 0.12))"
								: "transparent",
						border: "none",
						color:
							mode === "dark"
								? "var(--color-text-primary)"
								: "var(--color-text-secondary)",
						padding: "5px 8px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
					}}
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
					style={{
						background: "transparent",
						border: "1px solid var(--color-border)",
						color: "var(--color-text-secondary)",
						padding: "4px",
						height: "27px",
						width: "27px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Contrast size={15} strokeWidth={1.5} />
				</button>

				{isOpen && (
					<div
						style={{
							position: "absolute",
							top: "calc(100% + 4px)",
							right: 0,
							background: "var(--color-background-surface, #fdffda)",
							border: "1px solid var(--color-border)",
							padding: "8px 12px",
							minWidth: "160px",
							zIndex: 1000,
							boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
						}}
					>
						<button
							type="button"
							onClick={toggleHighContrast}
							style={{
								background: "none",
								border: "none",
								width: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								cursor: "pointer",
								padding: "4px 0",
								color: "var(--color-text-primary)",
								fontFamily: "var(--font-family-body, serif)",
								fontSize: "0.875rem",
							}}
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
