import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const COMMANDS = {
	help: "Show this help message",
	"fastmcp --help": "Show fastmcp help",
	"notebooklm run": "Run NotebookLM simulation",
	"diet logs": "Show diet logs",
	clear: "Clear terminal",
};

export default function TerminalDemo({ projectName }) {
	const terminalRef = useRef(null);
	const theme = useTheme();

	useEffect(() => {
		if (!terminalRef.current) return;

		const isDark = theme.palette.mode === "dark";
		const bgColor = isDark ? "#282a21" : "#fdffda"; // theme.palette.background.paper
		const fgColor = isDark ? "#fdffda" : "#38392e"; // theme.palette.text.primary

		const term = new Terminal({
			cursorBlink: true,
			fontFamily:
				'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
			fontSize: 14,
			theme: {
				background: bgColor,
				foreground: fgColor,
				cursor: fgColor,
				selectionBackground: alpha(theme.palette.secondary.main, 0.3),
			},
			convertEol: true,
		});

		term.open(terminalRef.current);

		term.writeln(
			`\x1b[3mWelcome to the interactive sandbox for ${projectName}.\x1b[0m`,
		);
		term.writeln('Type "help" for a list of available commands.');
		term.write("\r\n$ ");

		let currentInput = "";
		let cursorOffset = 0; // Offset from the end of the input

		term.onData((data) => {
			const code = data.charCodeAt(0);
			if (code === 13) {
				// Enter
				term.write("\r\n");
				processCommand(currentInput.trim());
				currentInput = "";
				cursorOffset = 0;
				term.write("$ ");
			} else if (code === 127 || data === "\x08") {
				// Backspace
				if (currentInput.length > 0 && cursorOffset < currentInput.length) {
					currentInput =
						currentInput.slice(0, currentInput.length - cursorOffset - 1) +
						currentInput.slice(currentInput.length - cursorOffset);
					// Move cursor back, erase, and rewrite the rest
					term.write("\b \b");
					if (cursorOffset > 0) {
						term.write(
							`${currentInput.slice(currentInput.length - cursorOffset)} `,
						);
						term.write("\b".repeat(cursorOffset + 1));
					}
				}
			} else if (code === 9) {
				// Tab completion
				const matches = Object.keys(COMMANDS).filter((cmd) =>
					cmd.startsWith(currentInput),
				);
				if (matches.length === 1) {
					const completion = matches[0].slice(currentInput.length);
					currentInput += completion;
					term.write(completion);
				} else if (matches.length > 1) {
					term.write(`\r\n${matches.join("  ")}\r\n$ ${currentInput}`);
				}
			} else if (data === "\x1b[C") {
				// Right arrow
				if (cursorOffset > 0) {
					cursorOffset--;
					term.write(data);
				}
			} else if (data === "\x1b[D") {
				// Left arrow
				if (cursorOffset < currentInput.length) {
					cursorOffset++;
					term.write(data);
				}
			} else if (code < 32 && code !== 27) {
				// Other control characters ignored (except escape sequences)
			} else if (code !== 27) {
				// Printable character
				if (cursorOffset === 0) {
					currentInput += data;
					term.write(data);
				} else {
					const insertPos = currentInput.length - cursorOffset;
					currentInput =
						currentInput.slice(0, insertPos) +
						data +
						currentInput.slice(insertPos);
					term.write(data + currentInput.slice(insertPos + 1));
					term.write("\b".repeat(cursorOffset));
				}
			}
		});

		const processCommand = (cmd) => {
			if (!cmd) return;

			switch (cmd) {
				case "help":
					term.writeln("Available commands:");
					for (const [command, desc] of Object.entries(COMMANDS)) {
						term.writeln(`  ${command.padEnd(20)} ${desc}`);
					}
					break;
				case "fastmcp --help":
					term.writeln("fastmcp: A fast model control panel.");
					term.writeln("Usage: fastmcp [command] [options]");
					break;
				case "notebooklm run":
					term.writeln("Starting NotebookLM pipeline...");
					term.writeln("[INFO] Loading documents...");
					term.writeln("[INFO] Indexing completed in 240ms.");
					break;
				case "diet logs":
					term.writeln("2023-10-01 08:00:00 - Breakfast logged");
					term.writeln("2023-10-01 12:30:00 - Lunch logged");
					break;
				case "clear":
					term.clear();
					break;
				default:
					term.writeln(`Command not found: ${cmd}`);
			}
		};

		return () => {
			term.dispose();
		};
	}, [projectName, theme]);

	return (
		<Box
			sx={{
				mt: 6,
				mb: 4,
				border: "1px solid",
				borderColor: "divider",
				p: { xs: 2, md: 3 },
				backgroundColor: "background.paper",
			}}
		>
			<Typography
				variant="h3"
				component="h2"
				sx={{ mb: 2, fontSize: "1.3rem" }}
			>
				Interactive Sandbox
			</Typography>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mb: 3, fontStyle: "italic" }}
			>
				Simulated terminal environment. Try typing commands like "help".
			</Typography>
			<Box
				ref={terminalRef}
				sx={{
					height: 320,
					width: "100%",
					overflow: "hidden",
					"& .xterm-viewport": {
						backgroundColor: "transparent !important",
					},
				}}
				data-testid="terminal-container"
			/>
		</Box>
	);
}

TerminalDemo.propTypes = {
	projectName: PropTypes.string.isRequired,
};
