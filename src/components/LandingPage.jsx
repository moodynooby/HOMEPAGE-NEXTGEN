import { useReducedMotion } from "motion/react";
import { lazy, useState } from "react";
import ColophonFooter from "@/components/ColophonFooter";
import FeaturedWork from "@/components/FeaturedWork";
import Header from "@/components/Header";
import LandingHero from "@/components/LandingHero";
import LandingSection from "@/components/LandingSection";
import useLandingStats, { formatNumber } from "@/hooks/useLandingStats";

const Gallery = lazy(() => import("@/components/Gallery"));
const ProjectTimeline = lazy(() => import("@/components/ProjectTimeline"));
const TechRadar = lazy(() => import("@/components/TechRadar"));

export default function LandingPage() {
	const shouldReduceMotion = useReducedMotion();
	const [activeRadarProjects, setActiveRadarProjects] = useState([]);
	const { ledgerEntries, featuredMeta } = useLandingStats();

	return (
		<div style={{ minHeight: "100vh", paddingBottom: "2rem" }}>
			<Header />

			<LandingHero
				shouldReduceMotion={shouldReduceMotion}
				ledgerEntries={ledgerEntries}
			/>

			<main id="main-content">
				<FeaturedWork
					featuredMeta={featuredMeta}
					activeRadarProjects={activeRadarProjects}
					formatNumber={formatNumber}
				/>

				<LandingSection
					id="tech-radar-section"
					title="Tech Stack Radar"
					description="An interactive overview of technologies I adopt, trial, assess, or hold."
					loadingLabel="Loading tech radar"
				>
					<TechRadar
						onActiveBlipChange={(blip) =>
							setActiveRadarProjects(blip ? blip.projects : [])
						}
					/>
				</LandingSection>

				<LandingSection
					id="timeline-section"
					title="Project Timeline"
					description="Chronological evolution and release milestone changelogs across the ecosystem."
					loadingLabel="Loading timeline"
					fallbackPadding="4rem 0"
				>
					<ProjectTimeline limit={5} />
				</LandingSection>

				<LandingSection
					id="experience-section"
					title="The Visual Archive"
					description="Photographs and kinetic studies, preserved for the record."
					loadingLabel="Loading gallery"
					fallbackPadding="4rem 0"
				>
					<Gallery limit={4} showAppBar={false} />
				</LandingSection>
			</main>

			<ColophonFooter />
		</div>
	);
}
