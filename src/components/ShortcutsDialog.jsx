import { X } from "lucide-react";
import PropTypes from "prop-types";

export default function ShortcutsDialog({ onClose }) {
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
				<div id="shortcuts-modal-description" className="flex flex-col gap-4">
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
	);
}

ShortcutsDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
};
