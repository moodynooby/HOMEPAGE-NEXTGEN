import { useReducedMotion } from "motion/react";
import { lazy, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ColophonFooter from "@/components/ColophonFooter";
import FeaturedWork from "@/components/FeaturedWork";
import Header from "@/components/Header";
import LandingHero from "@/components/LandingHero";
import LandingSection from "@/components/LandingSection";
import { SECTION_IDS } from "@/config/sections";
import useLandingStats from "@/hooks/useLandingStats";

const Gallery = lazy(() => import("@/components/Gallery"));
const ProjectTimeline = lazy(() => import("@/components/ProjectTimeline"));
const TechRadar = lazy(() => import("@/components/TechRadar"));

export default function LandingPage() {
	const shouldReduceMotion = useReducedMotion();
	const location = useLocation();
	const navigate = useNavigate();
	const [activeRadarProjects, setActiveRadarProjects] = useState([]);
	const { ledgerEntries, featuredMeta } = useLandingStats();

	useEffect(() => {
		const sectionId = location.state?.scrollTo;
		if (!sectionId) return;
		document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
		navigate(location.pathname, { replace: true, state: null });
	}, [location, navigate]);

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
				/>

				<LandingSection
					id={SECTION_IDS.radar}
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
					id={SECTION_IDS.timeline}
					title="Project Timeline"
					description="Chronological evolution and release milestone changelogs across the ecosystem."
					loadingLabel="Loading timeline"
				>
					<ProjectTimeline limit={5} />
				</LandingSection>

				<LandingSection
					id={SECTION_IDS.experience}
					title="The Visual Archive"
					description="Photographs and kinetic studies, preserved for the record."
					loadingLabel="Loading gallery"
				>
					<Gallery limit={4} showAppBar={false} />
				</LandingSection>
			</main>

			<ColophonFooter />
		</div>
	);
}
