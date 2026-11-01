import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TerminalDemo from "../TerminalDemo";

// Mock xterm since it requires a real DOM and WebGL/canvas environment
vi.mock("@xterm/xterm", () => {
	const mockWrite = vi.fn();
	const mockWriteln = vi.fn();
	const mockClear = vi.fn();
	const mockOpen = vi.fn();
	const mockOnData = vi.fn();
	const mockDispose = vi.fn();

	const TerminalMock = vi.fn().mockImplementation(function () {
		this.write = mockWrite;
		this.writeln = mockWriteln;
		this.clear = mockClear;
		this.open = mockOpen;
		this.onData = mockOnData;
		this.dispose = mockDispose;
	});
	return { Terminal: TerminalMock };
});

describe("TerminalDemo", () => {
	it("renders terminal container and info text", () => {
		render(<TerminalDemo projectName="TestProject" />);

		expect(screen.getByText("Interactive Sandbox")).toBeInTheDocument();
		expect(
			screen.getByText(/Simulated terminal environment/i),
		).toBeInTheDocument();
		expect(screen.getByTestId("terminal-container")).toBeInTheDocument();
	});

	it("initializes Terminal on mount", async () => {
		const { Terminal } = await import("@xterm/xterm");
		render(<TerminalDemo projectName="TestProject" />);

		expect(Terminal).toHaveBeenCalled();
		const mockInstance = Terminal.mock.instances[0];
		expect(mockInstance.open).toHaveBeenCalled();
		expect(mockInstance.writeln).toHaveBeenCalledWith(
			expect.stringContaining("TestProject"),
		);
	});

	it("executes commands correctly when typed", async () => {
		const { Terminal } = await import("@xterm/xterm");
		render(<TerminalDemo projectName="TestProject" />);
		const mockInstance = Terminal.mock.instances[0];

		// Simulate typing 'help' and enter
		mockInstance.onData.mock.calls[0][0]("h");
		mockInstance.onData.mock.calls[0][0]("e");
		mockInstance.onData.mock.calls[0][0]("l");
		mockInstance.onData.mock.calls[0][0]("p");
		mockInstance.onData.mock.calls[0][0](String.fromCharCode(13)); // Enter

		expect(mockInstance.writeln).toHaveBeenCalledWith("Available commands:");
		expect(mockInstance.writeln).toHaveBeenCalledWith(
			expect.stringContaining("help"),
		);
	});

	it("resets state and clears terminal correctly", async () => {
		const { Terminal } = await import("@xterm/xterm");
		render(<TerminalDemo projectName="TestProject" />);
		const mockInstance = Terminal.mock.instances[0];

		// Simulate typing 'clear' and enter
		mockInstance.onData.mock.calls[0][0]("c");
		mockInstance.onData.mock.calls[0][0]("l");
		mockInstance.onData.mock.calls[0][0]("e");
		mockInstance.onData.mock.calls[0][0]("a");
		mockInstance.onData.mock.calls[0][0]("r");
		mockInstance.onData.mock.calls[0][0](String.fromCharCode(13)); // Enter

		expect(mockInstance.clear).toHaveBeenCalled();
	});
});
