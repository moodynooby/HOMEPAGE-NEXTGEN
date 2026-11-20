import { useKBar } from "kbar";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import socialLinks from "@/content/socialLinks.json";
import { NAV_ITEMS } from "@/nav";
import { socialIcons } from "@/utils/socialIcons";

function SocialLinks() {
	return (
		<div style={{ display: "flex", gap: "6px" }}>
			{socialLinks.map((social) => {
				const IconComponent = socialIcons[social.alt];
				if (!IconComponent) return null;
				return (
					<a
						key={social.alt}
						href={social.link}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Open ${social.alt} in a new tab`}
						style={{
							color: "var(--color-text-secondary, #7d5d53)",
							border: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
							padding: "4px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							textDecoration: "none",
							transition: "color 0.2s ease, border-color 0.2s ease",
						}}
					>
						<IconComponent size={16} strokeWidth={1.5} />
					</a>
				);
			})}
		</div>
	);
}

export default function ButtonAppBar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { query } = useKBar();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 900);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const currentDate = new Date()
		.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		})
		.toUpperCase();

	return (
		<header>
			<div
				style={{
					paddingTop: isMobile ? "2.5rem" : "3.5rem",
					paddingBottom: "1.25rem",
					paddingLeft: "1rem",
					paddingRight: "1rem",
					textAlign: "center",
				}}
			>
				<Link
					to="/"
					style={{
						display: "block",
						fontFamily:
							"var(--font-family-heading, 'Newsreader', Georgia, serif)",
						fontSize: isMobile ? "2.6rem" : "4.25rem",
						color: "var(--color-text-primary, #38392e)",
						textDecoration: "none",
						marginBottom: "1rem",
						fontWeight: 800,
						lineHeight: 1,
						transition: "opacity 0.2s ease",
					}}
				>
					MANAS DOSHI TIMES
				</Link>

				<div
					style={{
						borderTop: "2px solid var(--color-text-primary, #38392e)",
						borderBottom:
							"1px solid var(--color-border, rgba(56, 57, 46, 0.25))",
						padding: "0.5rem 0",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						maxWidth: "1200px",
						margin: "0 auto",
						fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
						fontSize: "0.72rem",
						letterSpacing: "0.12em",
						textTransform: "uppercase",
						color: "var(--color-text-secondary, #7d5d53)",
					}}
				>
					<span>Manas Doshi</span>
					<span style={{ display: isMobile ? "none" : "inline" }}>
						{currentDate}
					</span>
					<span style={{ display: isMobile ? "inline" : "none" }}>
						Personal Archive
					</span>
					<span>Est. MMXXIV</span>
				</div>
			</div>

			<nav
				style={{
					position: "sticky",
					top: 0,
					zIndex: 100,
					background: "var(--color-background-body, #fdffda)",
					borderBottom: "1px solid var(--color-border, rgba(56, 57, 46, 0.10))",
					backdropFilter: "blur(12px)",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: isMobile ? "0.75rem" : "1.25rem",
						minHeight: "52px",
						maxWidth: "1200px",
						margin: "0 auto",
						padding: "0 1rem",
					}}
				>
					{!isMobile &&
						NAV_ITEMS.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								style={{
									fontFamily:
										"var(--font-family-code, 'Work Sans', sans-serif)",
									fontSize: "0.8rem",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									color: "var(--color-text-primary, #38392e)",
									textDecoration: "none",
									padding: "0.5rem 0.75rem",
									fontWeight: 600,
								}}
							>
								{item.label}
							</Link>
						))}

					{isMobile && (
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Open navigation menu"
							style={{
								background: "transparent",
								border: "none",
								color: "var(--color-text-primary)",
								cursor: "pointer",
								padding: "6px",
								display: "flex",
								alignItems: "center",
							}}
						>
							{isMobileMenuOpen ? (
								<X size={20} strokeWidth={1.5} />
							) : (
								<Menu size={20} strokeWidth={1.5} />
							)}
						</button>
					)}

					<div
						style={{
							width: "1px",
							height: "20px",
							background: "var(--color-border, rgba(56, 57, 46, 0.10))",
						}}
					/>

					<button
						type="button"
						onClick={query.toggle}
						aria-label="Open command palette"
						style={{
							background: "transparent",
							border: "none",
							color: "var(--color-text-primary, #38392e)",
							fontFamily: "var(--font-family-code, 'Work Sans', sans-serif)",
							fontSize: "0.8rem",
							letterSpacing: "0.1em",
							textTransform: "uppercase",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							padding: "0.5rem 0.75rem",
							fontWeight: 600,
						}}
					>
						<Search size={14} strokeWidth={1.5} />
						<span>Search</span>
					</button>

					<div
						style={{
							width: "1px",
							height: "20px",
							background: "var(--color-border, rgba(56, 57, 46, 0.10))",
						}}
					/>

					<ThemeToggle />

					{!isMobile && (
						<>
							<div
								style={{
									width: "1px",
									height: "20px",
									background: "var(--color-border, rgba(56, 57, 46, 0.10))",
								}}
							/>
							<SocialLinks />
						</>
					)}
				</div>

				{isMobile && isMobileMenuOpen && (
					<div
						style={{
							borderTop: "1px solid var(--color-border)",
							background: "var(--color-background-surface, #fdffda)",
							padding: "1rem",
							display: "flex",
							flexDirection: "column",
							gap: "0.75rem",
						}}
					>
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								onClick={() => setIsMobileMenuOpen(false)}
								style={{
									fontFamily:
										"var(--font-family-code, 'Work Sans', sans-serif)",
									fontSize: "0.875rem",
									letterSpacing: "0.1em",
									textTransform: "uppercase",
									color: "var(--color-text-primary)",
									textDecoration: "none",
									padding: "0.5rem 0",
								}}
							>
								{item.label}
							</Link>
						))}
						<div
							style={{
								borderTop: "1px solid var(--color-border)",
								paddingTop: "0.75rem",
							}}
						>
							<SocialLinks />
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
