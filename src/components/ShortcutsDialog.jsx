import { X } from "lucide-react";
import PropTypes from "prop-types";
import { GLOBAL_SHORTCUTS } from "@/config/shortcuts";

export default function ShortcutsDialog({ actions, onClose }) {
	const rows = [
		...GLOBAL_SHORTCUTS,
		...actions
			.filter((action) => action.shortcut?.length > 0)
			.map((action) => ({
				key: action.shortcut.join(" "),
				description: action.description || action.name,
			})),
	];

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="shortcuts-modal-title"
			tabIndex={-1}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
			className="modal-backdrop"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="shortcuts-dialog">
				<div className="flex justify-between items-center mb-6">
					<h3 id="shortcuts-modal-title">Keyboard Shortcuts</h3>
					<button
						type="button"
						onClick={() => onClose()}
						aria-label="Close shortcuts modal"
						className="btn-ghost p-1 flex items-center"
					>
						<X size={18} strokeWidth={1.5} />
					</button>
				</div>
				<div className="flex flex-col gap-4">
					{rows.map((row) => (
						<div key={row.description} className="shortcuts-row">
							<span className="font-body text-primary">{row.description}</span>
							<div className="flex gap-1">
								{row.key.split(" ").map((key) => (
									<span key={`${row.description}-${key}`} className="kbd-badge">
										{key}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

ShortcutsDialog.propTypes = {
	actions: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
};
