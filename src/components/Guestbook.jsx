import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

// Mock entries
const mockEntries = [
	{
		id: 1,
		name: "Manas",
		message: "Welcome to my portfolio! Feel free to leave a message.",
		date: new Date().toISOString(),
		emoji: "👋",
	},
];

// Simple PoW function: hash needs to end with '0'
async function generateProofOfWork(str) {
	let nonce = 0;
	while (true) {
		const input = `${str}-${nonce}`;
		// Extremely simple hash for demonstration
		let hash = 0;
		for (let i = 0; i < input.length; i++) {
			const char = input.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		if (Math.abs(hash) % 10 === 0) {
			return { nonce, hash };
		}
		nonce++;
	}
}

export default function Guestbook() {
	const [entries, setEntries] = useState([]);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [social, setSocial] = useState("");
	const [emoji, setEmoji] = useState("😀");
	const [honeypot, setHoneypot] = useState(""); // Honeypot field
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				const apiUrl = import.meta.env.VITE_GUESTBOOK_API;
				if (apiUrl) {
					const response = await fetch(apiUrl);
					if (response.ok) {
						const data = await response.json();
						setEntries(data);
						return;
					}
				}
			} catch (_err) {
				console.warn("Failed to fetch from remote API, using local fallback.");
			}

			// Load entries from localStorage or mock
			const stored = localStorage.getItem("guestbook_entries");
			if (stored) {
				setEntries(JSON.parse(stored));
			} else {
				setEntries(mockEntries);
				localStorage.setItem("guestbook_entries", JSON.stringify(mockEntries));
			}
		};

		fetchEntries();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Honeypot check
		if (honeypot) {
			console.warn("Spam bot detected via honeypot.");
			return; // Silently reject
		}

		if (!name.trim() || !message.trim()) {
			setError("Name and message are required.");
			return;
		}

		// Rate limiting check
		const lastSubmit = localStorage.getItem("guestbook_last_submit");
		if (lastSubmit && Date.now() - Number(lastSubmit) < 60000) {
			setError("Please wait a minute before posting again.");
			return;
		}

		setIsSubmitting(true);

		try {
			// PoW Check
			const pow = await generateProofOfWork(name + message);

			const newEntry = {
				id: Date.now(),
				name,
				message,
				social,
				emoji,
				date: new Date().toISOString(),
				pow, // Store proof
			};

			let isRemoteSuccess = false;
			try {
				const apiUrl = import.meta.env.VITE_GUESTBOOK_API;
				if (apiUrl) {
					const response = await fetch(apiUrl, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(newEntry),
					});
					if (response.ok) {
						isRemoteSuccess = true;
					}
				}
			} catch (_err) {
				console.warn(
					"Failed to submit to remote API, falling back to local storage.",
				);
			}

			// Fallback or optimistically update UI
			const updatedEntries = [newEntry, ...entries];
			setEntries(updatedEntries);
			if (!isRemoteSuccess || !import.meta.env.VITE_GUESTBOOK_API) {
				localStorage.setItem(
					"guestbook_entries",
					JSON.stringify(updatedEntries),
				);
			}
			localStorage.setItem("guestbook_last_submit", Date.now().toString());

			// Reset form
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
		<Box sx={{ mt: 8, mb: 8 }} id="guestbook">
			<Typography
				variant="h3"
				component="h2"
				sx={{ fontFamily: "Newsreader", mb: 4 }}
			>
				Guestbook
			</Typography>
			<Typography
				variant="body1"
				sx={{ fontFamily: "Noto Serif", mb: 4, color: "text.secondary" }}
			>
				Leave a message, say hello, or just leave your mark.
			</Typography>

			<Box component="form" onSubmit={handleSubmit} sx={{ mb: 6 }}>
				<Stack spacing={3}>
					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
						<TextField
							label="Name"
							variant="outlined"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							sx={{ flexGrow: 1 }}
						/>
						<TextField
							label="Avatar / Emoji"
							variant="outlined"
							value={emoji}
							onChange={(e) => setEmoji(e.target.value)}
							inputProps={{ maxLength: 2 }}
							sx={{ width: 120 }}
						/>
					</Box>
					<TextField
						label="Social Handle (Optional)"
						variant="outlined"
						value={social}
						onChange={(e) => setSocial(e.target.value)}
					/>
					<TextField
						label="Message"
						variant="outlined"
						multiline
						rows={3}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					/>

					{/* Honeypot Field - visually hidden */}
					<Box sx={{ display: "none" }}>
						<TextField
							label="Do not fill this out"
							value={honeypot}
							onChange={(e) => setHoneypot(e.target.value)}
							tabIndex={-1}
							autoComplete="off"
						/>
					</Box>

					{error && (
						<Typography color="error" variant="body2">
							{error}
						</Typography>
					)}

					<Button
						type="submit"
						variant="contained"
						disabled={isSubmitting}
						sx={{ width: { xs: "100%", sm: "auto" }, alignSelf: "flex-start" }}
					>
						{isSubmitting ? <CircularProgress size={24} /> : "Sign Guestbook"}
					</Button>
				</Stack>
			</Box>

			<Divider sx={{ mb: 4 }} />

			<List sx={{ p: 0 }}>
				{entries.map((entry) => (
					<ListItem
						key={entry.id}
						alignItems="flex-start"
						sx={{
							px: 0,
							py: 2,
							borderBottom: "1px solid",
							borderColor: "divider",
						}}
					>
						<ListItemAvatar>
							<Avatar
								sx={{
									bgcolor: "background.paper",
									border: "1px solid",
									borderColor: "divider",
								}}
							>
								{entry.emoji || "👤"}
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={
								<Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
									<Typography
										variant="subtitle1"
										component="span"
										sx={{ fontWeight: 700 }}
									>
										{entry.name}
									</Typography>
									{entry.social && (
										<Typography
											variant="body2"
											component="span"
											color="text.secondary"
										>
											{entry.social.startsWith("@")
												? entry.social
												: `@${entry.social}`}
										</Typography>
									)}
									<Typography
										variant="caption"
										component="span"
										color="text.secondary"
										sx={{ ml: "auto" }}
									>
										{new Date(entry.date).toLocaleDateString()}
									</Typography>
								</Box>
							}
							secondary={
								<Typography
									variant="body1"
									sx={{
										mt: 1,
										fontFamily: "Noto Serif",
										color: "text.primary",
									}}
								>
									{entry.message}
								</Typography>
							}
						/>
					</ListItem>
				))}
			</List>
		</Box>
	);
}
