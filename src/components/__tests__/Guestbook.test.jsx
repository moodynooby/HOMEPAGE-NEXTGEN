import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Guestbook from "../Guestbook";

describe("Guestbook Component", () => {
	beforeEach(() => {
		// Clear local storage
		localStorage.clear();
		// Mock date to ensure consistent testing if needed
		vi.useFakeTimers({ toFake: ["Date"] });
	});

	it("renders the initial mock entry", async () => {
		render(<Guestbook />);
		expect(screen.getByText("Guestbook")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Welcome to my portfolio! Feel free to leave a message.",
			),
		).toBeInTheDocument();
		expect(screen.getByText("Manas")).toBeInTheDocument();
	});

	it("submits a new entry successfully", async () => {
		render(<Guestbook />);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "Test User" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Hello world!" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		await waitFor(() => {
			expect(screen.getByText("Test User")).toBeInTheDocument();
			expect(screen.getByText("Hello world!")).toBeInTheDocument();
		});
	});

	it("rejects submission if honeypot is filled", async () => {
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<Guestbook />);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "Spam Bot" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Buy my stuff!" },
		});
		// Fill honeypot
		fireEvent.change(screen.getByLabelText("Do not fill this out"), {
			target: { value: "bot data" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"Spam bot detected via honeypot.",
			);
		});

		// The new entry should not appear
		expect(screen.queryByText("Spam Bot")).not.toBeInTheDocument();
		consoleSpy.mockRestore();
	});

	it("enforces rate limiting", async () => {
		render(<Guestbook />);
		const fixedDate = new Date("2023-01-01T00:00:00Z");
		vi.setSystemTime(fixedDate);

		// First submission
		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "User 1" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Msg 1" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		await waitFor(() => {
			expect(screen.getByText("User 1")).toBeInTheDocument();
		});

		// Try to submit again immediately
		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "User 2" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Msg 2" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		await waitFor(() => {
			expect(
				screen.getByText("Please wait a minute before posting again."),
			).toBeInTheDocument();
		});
		expect(screen.queryByText("User 2")).not.toBeInTheDocument();

		// Fast forward 61 seconds
		vi.advanceTimersByTime(61000);

		// Try again
		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));
		await waitFor(() => {
			expect(screen.getByText("User 2")).toBeInTheDocument();
		});
	});
});
