import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Guestbook from "../Guestbook";

describe("Guestbook Component", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.useFakeTimers({ toFake: ["Date"] });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders the initial mock entry", async () => {
		render(<Guestbook />);

		expect(screen.getByText("Guestbook")).toBeInTheDocument();
		expect(
			await screen.findByText(
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

		expect(await screen.findByText("Test User")).toBeInTheDocument();
		expect(screen.getByText("Hello world!")).toBeInTheDocument();
	});

	it("rejects submission if honeypot is filled", async () => {
		render(<Guestbook />);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "Spam Bot" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Buy my stuff!" },
		});
		fireEvent.change(screen.getByLabelText("Do not fill this out"), {
			target: { value: "bot data" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		await waitFor(() => {
			expect(screen.queryByText("Spam Bot")).not.toBeInTheDocument();
		});
	});

	it("enforces rate limiting", async () => {
		const fixedDate = new Date("2023-01-01T00:00:00Z");
		vi.setSystemTime(fixedDate);

		render(<Guestbook />);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "User 1" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Msg 1" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		expect(await screen.findByText("User 1")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: "User 2" },
		});
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: "Msg 2" },
		});
		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));

		expect(
			await screen.findByText("Please wait a minute before posting again."),
		).toBeInTheDocument();
		expect(screen.queryByText("User 2")).not.toBeInTheDocument();

		vi.setSystemTime(new Date(fixedDate.getTime() + 61000));

		fireEvent.click(screen.getByRole("button", { name: /Sign Guestbook/i }));
		expect(await screen.findByText("User 2")).toBeInTheDocument();
	});
});
