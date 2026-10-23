import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
	title: "Early Years Activities in Singapore: Babies to Preschool — GoBela",
	description:
		"Find early learning, movement, music and play programmes for babies, toddlers and preschoolers in Singapore. Browse by age and area, and book a first trial class with GoBela.",
	alternates: { canonical: "https://gobela.sg/early-years" },
	openGraph: {
		title: "Early years, explored through play — GoBela",
		description:
			"Programmes for babies, toddlers and preschoolers in Singapore. Try a first class before you commit.",
		url: "https://gobela.sg/early-years",
	},
};

const APP_STORE = "https://apps.apple.com/sg/app/gobela/id6767062415";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.gobela.app";

const stages = [
	{
		title: "Babies",
		detail: "Under 1 year",
		text: "Look for parent-and-baby classes with music, sensory play and gentle movement. You take part alongside your baby, and sessions are short.",
	},
	{
		title: "Toddlers",
		detail: "1 to 3 years",
		text: "Toddlers learn by doing: water play, songs, art and first words. Look for small groups with a parent or caregiver close by.",
	},
	{
		title: "Preschoolers",
		detail: "4 to 6 years",
		text: "Preschoolers are ready for a little more structure: swimming, sport, dance, drama, early language and building. Try a class that follows their curiosity.",
	},
];

const areas = [
	{
		title: "Moving & coordination",
		detail: "Swimming, gymnastics and sports",
		text: "Chances to practise balance, strength and confidence in their own bodies.",
	},
	{
		title: "Language & communication",
		detail: "Stories, drama and languages",
		text: "New words, songs and ways to express an idea.",
	},
	{
		title: "Playing with others",
		detail: "Small-group classes",
		text: "A gentle way to practise sharing, taking turns and following a teacher.",
	},
	{
		title: "Thinking & creativity",
		detail: "Music, art and discovery",
		text: "Activities that follow a child's questions and invite imagination.",
	},
];

const steps = [
	{
		title: "Browse by age and area",
		text: "Filter programmes in the app by your child's age, where you live and the kind of activity.",
	},
	{
		title: "Book a trial class",
		text: "Request a first session and the programme confirms it with you. Trial prices vary, and some are free.",
	},
	{
		title: "Decide together",
		text: "See how your child responds before you commit to a term.",
	},
];

export default function EarlyYearsPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="gb-section gb-educator-hero">
					<div className="gb-wrap">
						<p className="gb-eyebrow">Early years · Babies to preschool</p>
						<h1>
							Early years,
							<br />
							<span>explored through play.</span>
						</h1>
						<p className="gb-intro">
							From a baby&rsquo;s first splash to a preschooler&rsquo;s first
							story, the early years are when children discover how to move,
							speak, share and think. Find programmes that suit their age near
							you, and try a first class before you commit.
						</p>
						<div className="gb-actions">
							<a className="gb-button" href={APP_STORE}>
								Get GoBela on the App Store →
							</a>
							<a className="gb-button gb-button-outline" href={PLAY_STORE}>
								Get it on Google Play
							</a>
						</div>
						<p className="gb-hero-note">
							Singapore-built · Live on iOS &amp; Android · Browse by age and
							area
						</p>
					</div>
				</section>

				<section className="gb-section">
					<div className="gb-wrap">
						<p className="gb-eyebrow">By age &amp; stage</p>
						<h2>Every stage learns differently.</h2>
						<p className="gb-intro">
							Each programme on GoBela shows an age range, so you can look for
							what suits your child today.
						</p>
						<div className="gb-grid gb-three">
							{stages.map((stage, i) => (
								<article className="gb-interest" key={stage.title}>
									<span className="gb-number" aria-hidden="true">
										0{i + 1}
									</span>
									<h3>{stage.title}</h3>
									<p className="gb-interest-detail">{stage.detail}</p>
									<p>{stage.text}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="gb-section gb-learning">
					<div className="gb-wrap">
						<p className="gb-eyebrow">Four ways children explore</p>
						<h2>What early years programmes give children room to try.</h2>
						<p className="gb-intro">
							Young children learn through play. These are the kinds of
							experiences you will find when you browse programmes.
						</p>
						<div className="gb-grid">
							{areas.map((area, i) => (
								<article className="gb-interest" key={area.title}>
									<span className="gb-number" aria-hidden="true">
										0{i + 1}
									</span>
									<h3>{area.title}</h3>
									<p className="gb-interest-detail">{area.detail}</p>
									<p>{area.text}</p>
								</article>
							))}
						</div>
						<div className="gb-callout gb-prepare">
							<div>
								<h3>A note for parents</h3>
								<p>
									GoBela helps you find activities. It is not a developmental
									assessment. If you have concerns about your child&rsquo;s
									development, please speak with your child&rsquo;s doctor or a
									child development professional.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="gb-section">
					<div className="gb-wrap">
						<p className="gb-eyebrow">How it works</p>
						<h2>A first class, without the commitment.</h2>
						<div className="gb-grid gb-three">
							{steps.map((step, i) => (
								<article className="gb-interest" key={step.title}>
									<span className="gb-number" aria-hidden="true">
										0{i + 1}
									</span>
									<h3>{step.title}</h3>
									<p>{step.text}</p>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="gb-section gb-learning">
					<div className="gb-wrap">
						<p className="gb-eyebrow">Your questions</p>
						<h2>Before you book</h2>
						<div className="gb-faq">
							<details>
								<summary>What age can my child start?</summary>
								<p>
									Some programmes welcome babies from a few months old. Each
									listing shows its age range, so you can check before you
									book.
								</p>
							</details>
							<details>
								<summary>Do I stay with my child?</summary>
								<p>
									It depends on the programme and your child&rsquo;s age.
									Parent-and-child classes are common for babies and toddlers.
									The listing describes the format.
								</p>
							</details>
							<details>
								<summary>What does a trial class cost?</summary>
								<p>
									It varies by programme and is shown on each listing. Some
									trials are free.
								</p>
							</details>
							<details>
								<summary>What if we need to cancel?</summary>
								<p>
									For a paid trial, cancel at least 48 hours ahead for a full
									refund. Inside 48 hours, or if you do not attend, the trial
									fee is not refunded.
								</p>
							</details>
						</div>
					</div>
				</section>

				<section className="gb-section gb-educator-hero">
					<div className="gb-wrap">
						<h2>Find a first class for your little one.</h2>
						<p className="gb-intro">
							Browse programmes by age, area and category in the GoBela app.
						</p>
						<div className="gb-actions">
							<a className="gb-button" href={APP_STORE}>
								Get GoBela on the App Store →
							</a>
							<a className="gb-button gb-button-outline" href={PLAY_STORE}>
								Get it on Google Play
							</a>
						</div>
						<p className="gb-hero-note">Questions? hello@gobela.sg</p>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
