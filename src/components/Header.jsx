import { useKBar } from "kbar";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_TITLE } from "@/config/site";
import { socialEntries } from "@/content/socialLinks";
import useIsMobile from "@/hooks/useIsMobile";
import { NAV_ITEMS } from "@/routes";

function SocialLinks() {
	return (
		<div className="social-links">
			{socialEntries.map(({ alt, link, Icon }) =>
				Icon ? (
					<a
						key={alt}
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Open ${alt} in a new tab`}
						className="social-link-btn"
					>
						<Icon size={16} strokeWidth={1.5} />
					</a>
				) : null,
			)}
		</div>
	);
}

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isMobile = useIsMobile();
	const { query } = useKBar();

	const currentDate = new Date()
		.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		})
		.toUpperCase();

	return (
		<header className="site-header">
			<a href="#main-content" className="skip-link">
				Skip to main content
			</a>
			<div className="masthead">
				<Link to="/" className="masthead-title">
					{SITE_TITLE.toUpperCase()} TIMES
				</Link>

				<div className="masthead-sub">
					<span>{SITE_TITLE}</span>
					<span>{isMobile ? "Personal Archive" : currentDate}</span>
					<span>Est. MMXXIV</span>
				</div>
			</div>

			<nav className="site-nav">
				<div className="nav-inner">
					{!isMobile &&
						NAV_ITEMS.map((item) => (
							<Link key={item.path} to={item.path} className="nav-link">
								{item.label}
							</Link>
						))}

					{isMobile && (
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Open navigation menu"
							className="nav-btn p-1"
						>
							{isMobileMenuOpen ? (
								<X size={20} strokeWidth={1.5} />
							) : (
								<Menu size={20} strokeWidth={1.5} />
							)}
						</button>
					)}

					<div className="nav-divider" />

					<button
						type="button"
						onClick={query.toggle}
						aria-label="Open command palette"
						className="nav-btn"
					>
						<Search size={14} strokeWidth={1.5} />
						<span>Search</span>
					</button>

					<div className="nav-divider" />

					<ThemeToggle />

					{!isMobile && (
						<>
							<div className="nav-divider" />
							<SocialLinks />
						</>
					)}
				</div>

				{isMobile && isMobileMenuOpen && (
					<div className="mobile-menu-drawer">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setIsMobileMenuOpen(false)}
								className="nav-link"
							>
								{item.label}
							</Link>
						))}
						<div className="mobile-menu-socials">
							<SocialLinks />
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
