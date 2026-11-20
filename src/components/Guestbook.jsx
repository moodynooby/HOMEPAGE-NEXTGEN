import { useEffect, useState } from "react";

const GUESTBOOK_API = import.meta.env.VITE_GUESTBOOK_API;

const mockEntries = [
	{
		id: 1,
		name: "Manas",
		message: "Welcome to my portfolio! Feel free to leave a message.",
		date: new Date().toISOString(),
		emoji: "👋",
	},
];

export default function Guestbook() {
	const [entries, setEntries] = useState([]);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [social, setSocial] = useState("");
	const [emoji, setEmoji] = useState("😀");
	const [honeypot, setHoneypot] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				if (GUESTBOOK_API) {
					const response = await fetch(GUESTBOOK_API);
					if (response.ok) {
						setEntries(await response.json());
						return;
					}
				}
			} catch (_err) {
				// Fall through to the local fallback.
			}

			const stored = localStorage.getItem("guestbook_entries");
			if (stored) {
				try {
					setEntries(JSON.parse(stored));
					return;
				} catch (_error) {
					// Fall through to mock data.
				}
			}
			setEntries(mockEntries);
		};

		fetchEntries();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (honeypot) return;

		const lastSubmit = localStorage.getItem("guestbook_last_submit");
		if (lastSubmit && Date.now() - Number(lastSubmit) < 60000) {
			setError("Please wait a minute before posting again.");
			return;
		}

		if (!name.trim() || !message.trim()) {
			setError("Name and message are required.");
			return;
		}

		if (name.length > 50) {
			setError("Name must be under 50 characters.");
			return;
		}

		if (message.length > 500) {
			setError("Message must be under 500 characters.");
			return;
		}

		setIsSubmitting(true);
		setError("");

		const newEntry = {
			id: Date.now(),
			name: name.trim(),
			message: message.trim(),
			social: social.trim(),
			emoji: emoji || "😀",
			date: new Date().toISOString(),
		};

		try {
			let isRemoteSuccess = false;
			try {
				if (GUESTBOOK_API) {
					const res = await fetch(GUESTBOOK_API, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(newEntry),
					});
					if (res.ok) {
						isRemoteSuccess = true;
					}
				}
			} catch (_err) {
				// Fall back to local storage.
			}

			setEntries((prevEntries) => {
				const updated = [newEntry, ...prevEntries];
				if (!isRemoteSuccess || !GUESTBOOK_API) {
					localStorage.setItem("guestbook_entries", JSON.stringify(updated));
				}
				return updated;
			});
			localStorage.setItem("guestbook_last_submit", String(Date.now()));

			setName("");
			setMessage("");
			setSocial("");
			setEmoji("😀");
		} catch (_err) {
			setError("Failed to submit entry.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="guestbook" className="my-8">
			<h2 className="mb-4">Guestbook</h2>
			<p className="text-secondary mb-4">
				Leave a message, say hello, or just leave your mark.
			</p>

			<form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
				<div className="flex gap-2 flex-wrap">
					<div className="form-group flex-1">
						<label htmlFor="guestbook-name" className="form-label">
							Name
						</label>
						<input
							id="guestbook-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="form-group" style={{ width: 120 }}>
						<label htmlFor="guestbook-emoji" className="form-label">
							Avatar / Emoji
						</label>
						<input
							id="guestbook-emoji"
							value={emoji}
							onChange={(e) => setEmoji(e.target.value)}
							maxLength={2}
						/>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="guestbook-social" className="form-label">
						Social Handle (Optional)
					</label>
					<input
						id="guestbook-social"
						value={social}
						onChange={(e) => setSocial(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="guestbook-message" className="form-label">
						Message
					</label>
					<textarea
						id="guestbook-message"
						rows={3}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					/>
				</div>

				<div style={{ display: "none" }}>
					<label htmlFor="guestbook-honeypot">Do not fill this out</label>
					<input
						id="guestbook-honeypot"
						value={honeypot}
						onChange={(e) => setHoneypot(e.target.value)}
						tabIndex={-1}
						autoComplete="off"
					/>
				</div>

				{error && <p className="text-error caption">{error}</p>}

				<button
					type="submit"
					disabled={isSubmitting}
					className="btn btn-primary"
					style={{ alignSelf: "flex-start" }}
				>
					{isSubmitting ? <span className="spinner" /> : "Sign Guestbook"}
				</button>
			</form>

			<hr className="divider mb-4" />

			<ul className="list-unstyled">
				{entries.map((entry) => (
					<li
						key={entry.id}
						className="flex gap-3 items-start py-2"
						style={{
							borderBottom:
								"1px solid var(--color-border, var(--hairline-rule))",
						}}
					>
						<span className="avatar">{entry.emoji || "👤"}</span>
						<div className="flex-1">
							<div className="flex items-baseline gap-2">
								<span style={{ fontWeight: 700 }}>{entry.name}</span>
								{entry.social && (
									<span className="caption text-secondary">
										{entry.social.startsWith("@")
											? entry.social
											: `@${entry.social}`}
									</span>
								)}
								<span
									className="caption text-secondary"
									style={{ marginLeft: "auto" }}
								>
									{new Date(entry.date).toLocaleDateString()}
								</span>
							</div>
							<p className="mt-2">{entry.message}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
