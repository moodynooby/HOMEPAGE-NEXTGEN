import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buildCommandActions } from "@/config/commands";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function CommandPalette({ children }) {
	const navigate = useNavigate();
	const location = useLocation();
	const { setMode } = useThemeContext();
	const [shortcutsOpen, setShortcutsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (
				e.key === "?" &&
				!["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
			) {
				e.preventDefault();
				setShortcutsOpen(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleJumpToSection = useCallback(
		(sectionId) => {
			if (location.pathname !== "/") {
				navigate("/");
				setTimeout(() => {
					document
						.getElementById(sectionId)
						?.scrollIntoView({ behavior: "smooth" });
				}, 100);
			} else {
				document
					.getElementById(sectionId)
					?.scrollIntoView({ behavior: "smooth" });
			}
		},
		[location.pathname, navigate],
	);

	const copyToClipboard = useCallback((text) => {
		navigator.clipboard?.writeText(text);
	}, []);

	const actions = useMemo(
		() =>
			buildCommandActions({
				navigate,
				setMode,
				setShortcutsOpen,
				handleJumpToSection,
				copyToClipboard,
			}),
		[navigate, setMode, handleJumpToSection, copyToClipboard],
	);

	return (
		<KBarProvider actions={actions}>
			<KBarPortal>
				<KBarPositioner className="kbar-backdrop">
					<KBarAnimator className="kbar-animator">
						<div className="kbar-search-box">
							<KBarSearch
								className="kbar-search-input"
								placeholder="Type a command…"
							/>
						</div>
						<RenderResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
			{children}

			{shortcutsOpen && (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="shortcuts-modal-title"
					tabIndex={-1}
					onKeyDown={(e) => {
						if (e.key === "Escape") setShortcutsOpen(false);
					}}
					className="modal-backdrop"
					onClick={(e) => {
						if (e.target === e.currentTarget) setShortcutsOpen(false);
					}}
				>
					<div className="shortcuts-dialog">
						<div className="flex justify-between items-center mb-6">
							<h3 id="shortcuts-modal-title">Keyboard Shortcuts</h3>
							<button
								type="button"
								onClick={() => setShortcutsOpen(false)}
								aria-label="Close shortcuts modal"
								className="btn-ghost p-1 flex items-center"
							>
								<X size={18} strokeWidth={1.5} />
							</button>
						</div>
						<div
							id="shortcuts-modal-description"
							className="flex flex-col gap-4"
						>
							{[
								{ key: "Cmd/Ctrl + K", desc: "Open Command Palette" },
								{ key: "H", desc: "Go to Home" },
								{ key: "P", desc: "Go to Projects" },
								{ key: "L", desc: "Go to Profile / Links" },
								{ key: "G", desc: "Go to Media Gallery" },
								{ key: "T L", desc: "Theme: Light" },
								{ key: "T D", desc: "Theme: Dark" },
								{ key: "T S", desc: "Theme: System" },
								{ key: "?", desc: "Toggle this cheatsheet" },
							].map((sc) => (
								<div key={sc.desc} className="shortcuts-row">
									<span className="font-body text-primary">{sc.desc}</span>
									<div className="flex gap-1">
										{sc.key.split(" ").map((k) => (
											<span key={`${sc.desc}-${k}`} className="kbd-badge">
												{k}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</KBarProvider>
	);
}

function RenderResults() {
	const { results } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<div className="kbar-section-header">{item}</div>
				) : (
					<div className={`kbar-result-item ${active ? "active" : ""}`}>
						<div className="flex items-center gap-4">
							{item.icon && <span className="kbar-icon">{item.icon}</span>}
							<span className="font-body text-primary">{item.name}</span>
						</div>
						{item.shortcut?.length > 0 && (
							<div className="flex gap-1">
								{item.shortcut.map((sc) => (
									<span key={sc} className="kbd-sm">
										{sc}
									</span>
								))}
							</div>
						)}
					</div>
				)
			}
		/>
	);
}

CommandPalette.propTypes = {
	children: PropTypes.node,
};
