import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
	title: "For Educators & Programme Partners — GoBela",
	description:
		"Help Singapore families discover your early learning, creative play or sports programme. Share your teaching approach and apply to partner with GoBela.",
	alternates: { canonical: "https://gobela.sg/educators" },
	openGraph: {
		title: "Bring your programme to more families — GoBela",
		description:
			"Education partnerships for early learning, creative play and sport in Singapore.",
		url: "https://gobela.sg/educators",
	},
};
const steps = [
	{
		title: "Tell us about your programme",
		text: "Choose Activity / enrichment class in our partner application. Share your age groups, location, class details and introductory-session arrangements.",
	},
	{
		title: "Shape a clear introduction",
		text: "Our team reviews your application and follows up with you. Help us explain your teaching approach, who leads the sessions and what families should expect.",
	},
	{
		title: "Welcome a first experience",
		text: "Once your listing and booking arrangements are agreed, families can discover your programme and explore a first session through GoBela.",
	},
];
export default function EducatorsPage() {
	return (
		<>
			<Navbar />
			<main className="gb-educators">
				<section className="gb-section gb-educator-hero">
					<div className="gb-wrap">
						<p className="gb-eyebrow">
							For educators, coaches &amp; programme providers
						</p>
						<h1>
							Help more families discover
							<br />
							<span>what makes your programme special.</span>
						</h1>
						<p className="gb-intro">
							Introduce your approach to early learning, creative play or sport.
							Help parents understand the experience you offer and take the
							first step with their child.
						</p>
						<div className="gb-actions">
							<Link className="gb-button" href="/partners#apply">
								Apply as a programme partner →
							</Link>
							<a
								className="gb-button gb-button-outline"
								href="mailto:hello@gobela.sg?subject=Education%20partnership%20with%20GoBela"
							>
								Talk to Shuyang
							</a>
						</div>
						<p className="gb-hero-note">
							Singapore-built · Live on iOS &amp; Android · Free listing tier
						</p>
					</div>
				</section>
				<section className="gb-section">
					<div className="gb-wrap">
						<p className="gb-eyebrow">A shared purpose</p>
						<h2>Make the first step feel welcoming.</h2>
						<p className="gb-intro">
							Parents want to know whether an experience is right for their
							child. GoBela connects programme discovery with an introductory
							booking, giving families a way to explore before choosing a longer
							commitment.
						</p>
						<div className="gb-grid gb-three">
							<article className="gb-interest">
								<span className="gb-number">01</span>
								<h3>Be discovered</h3>
								<p>
									Help families find your programme as they browse activities by
									age, area and category.
								</p>
							</article>
							<article className="gb-interest">
								<span className="gb-number">02</span>
								<h3>Explain your approach</h3>
								<p>
									Share what children will explore, how sessions are led and
									what makes your programme distinctive during onboarding.
								</p>
							</article>
							<article className="gb-interest">
								<span className="gb-number">03</span>
								<h3>Start with a session</h3>
								<p>
									Agree suitable trial arrangements with our team so parents
									know what to expect before their first visit.
								</p>
							</article>
						</div>
					</div>
				</section>
				<section className="gb-section gb-learning">
					<div className="gb-wrap gb-split">
						<div>
							<p className="gb-eyebrow">Who we welcome</p>
							<h2>
								Different ways to learn.
								<br />
								One curious child.
							</h2>
							<p>
								We welcome early learning and enrichment centres, independent
								educators, creative studios and sports providers across
								Singapore. Programmes for older children are welcome too.
							</p>
						</div>
						<div className="gb-welcome-list">
							<p>Early learning &amp; purposeful play</p>
							<p>Languages, storytelling &amp; drama</p>
							<p>Music, movement &amp; creative arts</p>
							<p>Sports, swimming &amp; gymnastics</p>
							<p>Hands-on science &amp; discovery</p>
						</div>
					</div>
				</section>
				<section className="gb-section">
					<div className="gb-wrap">
						<p className="gb-eyebrow">How to join</p>
						<h2>A personal introduction, from the start.</h2>
						<div className="gb-grid gb-three">
							{steps.map((step, i) => (
								<article className="gb-interest" key={step.title}>
									<span className="gb-number">0{i + 1}</span>
									<h3>{step.title}</h3>
									<p>{step.text}</p>
								</article>
							))}
						</div>
						<div className="gb-callout gb-prepare">
							<div>
								<h3>What to prepare</h3>
								<p>
									Your programme’s age range, location, session format, fees and
									availability. Tell us about your educators’ relevant
									experience and qualifications, parent participation, and
									anything a child needs to bring.
								</p>
								<p>
									Use the application’s business description to introduce your
									teaching approach. Our team can follow up on the details with
									you.
								</p>
							</div>
						</div>
					</div>
				</section>
				<section className="gb-section gb-learning">
					<div className="gb-wrap">
						<p className="gb-eyebrow">Your questions</p>
						<h2>Before you apply</h2>
						<div className="gb-faq">
							<details>
								<summary>Do I need to offer a free trial?</summary>
								<p>
									No. Tell us your introductory-session price and arrangements.
									We will confirm how fees and booking terms are presented
									before your listing goes live.
								</p>
							</details>
							<details>
								<summary>What does a listing cost?</summary>
								<p>
									GoBela offers a free listing tier. We will discuss any
									optional promotion or additional services with you before you
									agree to them.
								</p>
							</details>
							<details>
								<summary>Can I update my programme after joining?</summary>
								<p>
									Yes. Contact hello@gobela.sg with changes to your programme
									details or availability. Our team supports updates; a
									self-service partner portal is planned.
								</p>
							</details>
							<details>
								<summary>
									Can I share an educator story or learning activity?
								</summary>
								<p>
									We welcome ideas for educator introductions and family
									learning content. Email us to discuss a feature. Publication
									and placement are agreed individually.
								</p>
							</details>
						</div>
					</div>
				</section>
				<section className="gb-section gb-educator-hero">
					<div className="gb-wrap">
						<h2>Let’s introduce your programme.</h2>
						<p className="gb-intro">
							Tell us what you love teaching and the families you hope to
							welcome.
						</p>
						<div className="gb-actions">
							<Link className="gb-button" href="/partners#apply">
								Become an education partner →
							</Link>
							<a
								className="gb-button gb-button-outline"
								href="mailto:hello@gobela.sg"
							>
								hello@gobela.sg
							</a>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
