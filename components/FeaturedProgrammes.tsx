import Link from "next/link";

// Shared editorial introductions. Current eligibility, fees and availability stay in the app.
const programmes = [
	{
		name: "MiniSport Singapore",
		category: "Movement & play",
		icon: "01",
		description:
			"An introduction to different sports through active play. Explore a multi-sport experience for a child who enjoys moving and trying something new.",
		explore: "Multi-sport activities",
		ask: "Which session suits my child’s age, and can I stay to watch?",
	},
	{
		name: "Penguin Swim School",
		category: "Swimming",
		icon: "02",
		description:
			"Explore swimming lessons and an introduction to the water. Discuss your child’s previous swimming experience with the provider before choosing a session.",
		explore: "Swimming lessons",
		ask: "What is the lesson location, and should a parent enter the pool?",
	},
	{
		name: "Elevate Dance Academie",
		category: "Music & creativity",
		icon: "03",
		description:
			"Discover dance as a way to explore movement and expression. Find out which style and introductory class suits your child’s interests.",
		explore: "Dance and movement",
		ask: "Which class welcomes beginners, and what should my child wear?",
	},
	{
		name: "Fencing Masters",
		category: "Sports discovery",
		icon: "04",
		description:
			"Introduce an older child to fencing. Speak with the provider about beginner sessions, suitable ages and equipment before their first visit.",
		explore: "An introduction to fencing",
		ask: "What equipment is provided, and which ages can join?",
	},
];

export default function FeaturedProgrammes() {
	return (
		<section
			id="partners"
			className="gb-section gb-programmes"
			aria-labelledby="programme-heading"
		>
			<div className="gb-wrap">
				<p className="gb-eyebrow">People and programmes to discover</p>
				<h2 id="programme-heading">
					A first experience can start a new interest.
				</h2>
				<p className="gb-intro">
					Meet some of GoBela’s programme partners, from early play to
					activities for older children. Check the app for each programme’s
					current ages, location, session details and full booking price.
				</p>
				<div className="gb-grid">
					{programmes.map((p) => (
						<article className="gb-programme" key={p.name}>
							<div className="gb-card-top">
								<span className="gb-number" aria-hidden="true">
									{p.icon}
								</span>
								<span className="gb-category">{p.category}</span>
							</div>
							<h3>{p.name}</h3>
							<p>{p.description}</p>
							<dl>
								<dt>Explore</dt>
								<dd>{p.explore}</dd>
								<dt>Ask before your first session</dt>
								<dd>{p.ask}</dd>
							</dl>
							<Link className="gb-text-link" href="/#download">
								Find programmes in the app →
							</Link>
						</article>
					))}
				</div>
				<div className="gb-after-grid">
					<p>Teach, coach or run a children’s programme?</p>
					<Link className="gb-text-link" href="/educators">
						Introduce your programme to GoBela →
					</Link>
				</div>
			</div>
		</section>
	);
}
