import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarSearch,
} from "kbar";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CommandResults from "@/components/CommandResults";
import ShortcutsDialog from "@/components/ShortcutsDialog";
import { buildCommandActions } from "@/config/commands";
import { useThemeContext } from "@/contexts/ThemeContext";
import useShortcutsModal from "@/hooks/useShortcutsModal";

export default function CommandPalette({ children }) {
	const navigate = useNavigate();
	const { setMode } = useThemeContext();
	const [shortcutsOpen, setShortcutsOpen] = useShortcutsModal();

	const handleJumpToSection = useCallback(
		(sectionId) => navigate("/", { state: { scrollTo: sectionId } }),
		[navigate],
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
		[navigate, setMode, setShortcutsOpen, handleJumpToSection, copyToClipboard],
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
						<CommandResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>
			{children}
			{shortcutsOpen && (
				<ShortcutsDialog
					actions={actions}
					onClose={() => setShortcutsOpen(false)}
				/>
			)}
		</KBarProvider>
	);
}

CommandPalette.propTypes = {
	children: PropTypes.node,
};
