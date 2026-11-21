import { Check, Trash2, X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function TechRadarForm({
	isOpen,
	onClose,
	onSave,
	onDelete,
	initialBlip,
	availableLanguages = [],
	allProjects = [],
	quadrants = [],
	rings = [],
}) {
	const [name, setName] = useState("");
	const [quadrant, setQuadrant] = useState("Languages");
	const [ring, setRing] = useState("Adopt");
	const [yoe, setYoe] = useState(2);
	const [selectedProjects, setSelectedProjects] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		if (initialBlip) {
			setName(initialBlip.name || "");
			setQuadrant(initialBlip.quadrant || quadrants[0] || "Languages");
			setRing(initialBlip.ring || rings[0] || "Adopt");
			setYoe(initialBlip.yoe || 1);
			setSelectedProjects(
				Array.isArray(initialBlip.projects) ? initialBlip.projects : [],
			);
		} else {
			setName("");
			setQuadrant(quadrants[0] || "Languages");
			setRing(rings[0] || "Adopt");
			setYoe(2);
			setSelectedProjects([]);
		}
		setError("");
	}, [initialBlip, quadrants, rings]);

	if (!isOpen) return null;

	const handleLanguageTagClick = (lang) => {
		setName(lang);
		setQuadrant("Languages");
	};

	const toggleProject = (projectName) => {
		setSelectedProjects((prev) =>
			prev.includes(projectName)
				? prev.filter((p) => p !== projectName)
				: [...prev, projectName],
		);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedName = name.trim();
		if (!trimmedName) {
			setError("Technology name is required.");
			return;
		}

		onSave({
			id: initialBlip?.id,
			name: trimmedName,
			quadrant,
			ring,
			yoe: Math.max(1, Number(yoe) || 1),
			projects: selectedProjects,
			keyRepos: selectedProjects.slice(0, 3),
		});
		onClose();
	};

	return (
		<div
			role="presentation"
			className="modal-backdrop"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<aside
				role="dialog"
				aria-modal="true"
				aria-labelledby="tech-radar-form-title"
				data-testid="tech-radar-form"
				tabIndex={-1}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				style={{
					maxWidth: "580px",
					width: "100%",
					maxHeight: "90vh",
					overflowY: "auto",
					background: "var(--color-background-surface)",
					border: "1px solid var(--color-border)",
					padding: "2rem",
					color: "var(--color-text-primary)",
					boxShadow: "none",
					borderRadius: 0,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						borderBottom: "1px solid var(--color-border)",
						paddingBottom: "1rem",
						marginBottom: "1.5rem",
					}}
				>
					<div>
						<p className="editorial-meta" style={{ marginBottom: "0.25rem" }}>
							Radar Customizer · Dynamic Entry
						</p>
						<h3
							id="tech-radar-form-title"
							className="editorial-headline"
							style={{ fontSize: "1.5rem", margin: 0 }}
						>
							{initialBlip ? "Edit Technology Blip" : "Add Radar Technology"}
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close form"
						className="btn-ghost p-1 flex items-center"
						style={{ cursor: "pointer", border: "none" }}
					>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					{availableLanguages.length > 0 && (
						<div style={{ marginBottom: "1.5rem" }}>
							<label
								htmlFor="quick-lang-tags"
								className="editorial-meta"
								style={{ display: "block", marginBottom: "0.5rem" }}
							>
								Detected GitHub Language Tags (Quick-Fill)
							</label>
							<div
								id="quick-lang-tags"
								style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
							>
								{availableLanguages.map((lang) => {
									const isCurrent = name.toLowerCase() === lang.toLowerCase();
									return (
										<button
											key={lang}
											type="button"
											onClick={() => handleLanguageTagClick(lang)}
											className="chip"
											style={{
												borderColor: isCurrent
													? "var(--color-text-primary)"
													: "var(--color-border)",
												backgroundColor: isCurrent
													? "var(--color-overlay-hover)"
													: "transparent",
											}}
										>
											{lang}
										</button>
									);
								})}
							</div>
						</div>
					)}

					<div style={{ marginBottom: "1.25rem" }}>
						<label
							htmlFor="radar-tech-name"
							className="editorial-meta"
							style={{ display: "block", marginBottom: "0.35rem" }}
						>
							Technology / Tool Name *
						</label>
						<input
							id="radar-tech-name"
							type="text"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (error) setError("");
							}}
							placeholder="e.g. TypeScript, React, Docker..."
							required
							style={{ width: "100%" }}
						/>
						{error && (
							<p
								className="caption text-secondary"
								style={{
									color: "var(--color-status-maintenance)",
									marginTop: "0.25rem",
								}}
							>
								{error}
							</p>
						)}
					</div>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "1rem",
							marginBottom: "1.25rem",
						}}
					>
						<div>
							<label
								htmlFor="radar-quadrant"
								className="editorial-meta"
								style={{ display: "block", marginBottom: "0.35rem" }}
							>
								Quadrant
							</label>
							<select
								id="radar-quadrant"
								value={quadrant}
								onChange={(e) => setQuadrant(e.target.value)}
								style={{ width: "100%" }}
							>
								{quadrants.map((q) => (
									<option key={q} value={q}>
										{q}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor="radar-ring"
								className="editorial-meta"
								style={{ display: "block", marginBottom: "0.35rem" }}
							>
								Adoption Ring
							</label>
							<select
								id="radar-ring"
								value={ring}
								onChange={(e) => setRing(e.target.value)}
								style={{ width: "100%" }}
							>
								{rings.map((r) => (
									<option key={r} value={r}>
										{r}
									</option>
								))}
							</select>
						</div>
					</div>

					<div style={{ marginBottom: "1.25rem" }}>
						<label
							htmlFor="radar-yoe"
							className="editorial-meta"
							style={{ display: "block", marginBottom: "0.35rem" }}
						>
							Years of Experience (YOE)
						</label>
						<input
							id="radar-yoe"
							type="number"
							min="1"
							max="30"
							value={yoe}
							onChange={(e) => setYoe(e.target.value)}
							style={{ width: "100%" }}
						/>
					</div>

					{allProjects.length > 0 && (
						<div style={{ marginBottom: "1.5rem" }}>
							<span
								className="editorial-meta"
								style={{ display: "block", marginBottom: "0.5rem" }}
							>
								Associated Portfolio Projects ({selectedProjects.length}{" "}
								selected)
							</span>
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "0.4rem",
									maxHeight: "140px",
									overflowY: "auto",
									padding: "0.5rem",
									border: "1px solid var(--color-border)",
								}}
							>
								{allProjects.map((proj) => {
									const isSelected = selectedProjects.includes(proj);
									return (
										<button
											key={proj}
											type="button"
											onClick={() => toggleProject(proj)}
											className="chip chip-sm"
											style={{
												borderColor: isSelected
													? "var(--color-text-primary)"
													: "var(--color-border)",
												backgroundColor: isSelected
													? "var(--color-overlay-hover)"
													: "transparent",
											}}
										>
											{isSelected && <Check size={12} />}
											<span>{proj}</span>
										</button>
									);
								})}
							</div>
						</div>
					)}

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							borderTop: "1px solid var(--color-border)",
							paddingTop: "1.25rem",
							marginTop: "1.5rem",
						}}
					>
						{initialBlip && onDelete ? (
							<button
								type="button"
								onClick={() => {
									onDelete(initialBlip.id);
									onClose();
								}}
								className="btn btn-outline btn-sm flex items-center gap-1"
								style={{ color: "var(--color-status-maintenance)" }}
							>
								<Trash2 size={14} />
								<span>Remove</span>
							</button>
						) : (
							<div />
						)}

						<div style={{ display: "flex", gap: "0.75rem" }}>
							<button
								type="button"
								onClick={onClose}
								className="btn btn-outline btn-sm"
							>
								Cancel
							</button>
							<button type="submit" className="btn btn-primary btn-sm">
								Save Technology
							</button>
						</div>
					</div>
				</form>
			</aside>
		</div>
	);
}

TechRadarForm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	onDelete: PropTypes.func,
	initialBlip: PropTypes.object,
	availableLanguages: PropTypes.arrayOf(PropTypes.string),
	allProjects: PropTypes.arrayOf(PropTypes.string),
	quadrants: PropTypes.arrayOf(PropTypes.string),
	rings: PropTypes.arrayOf(PropTypes.string),
};
