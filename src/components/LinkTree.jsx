import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import PropTypes from "prop-types";

import Header from "@/components/Header";
import socialLinks from "@/content/socialLinks.json";
import { socialIcons } from "@/utils/socialIcons";

function LinkRow({ link, alt }) {
	const IconComponent = socialIcons[alt];

	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={`Open ${alt} in a new tab`}
			className="link-tree-row"
		>
			<span className="flex text-secondary">
				{IconComponent && <IconComponent size={20} strokeWidth={1.5} />}
			</span>
			<span className="link-tree-label">{alt}</span>
			<ArrowUpRight size={18} strokeWidth={1.5} className="directory-arrow" />
		</a>
	);
}

LinkRow.propTypes = {
	link: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default function LinkTree() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<div>
			<Header />

			<motion.div
				initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
			>
				<main className="directory-container">
					<p className="editorial-meta mb-2">Index · Directory</p>
					<h1 className="editorial-headline mb-4">Connected Profiles</h1>
					<p className="editorial-body directory-intro mb-8">
						A simple directory of places where my work, writing, and ongoing
						projects can be found.
					</p>

					<div>
						{socialLinks.map((social, index) => (
							<motion.div
								key={social.alt}
								initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={
									shouldReduceMotion
										? { duration: 0 }
										: { delay: index * 0.06, duration: 0.45 }
								}
							>
								<LinkRow link={social.link} alt={social.alt} />
							</motion.div>
						))}
						<hr className="editorial-divider" />
					</div>
				</main>
			</motion.div>
		</div>
	);
}
