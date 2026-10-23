import Link from "next/link";

const interests = [
	{
		title: "Movement & play",
		detail: "Swimming, gymnastics and multi-sport",
		note: "For children who enjoy moving, exploring and playing together.",
	},
	{
		title: "Language & stories",
		detail: "Languages, storytelling and drama",
		note: "Explore words, stories and new ways to express an idea.",
	},
	{
		title: "Music & creativity",
		detail: "Music, dance and art",
		note: "Make space for imagination, rhythm and self-expression.",
	},
	{
		title: "Curiosity & discovery",
		detail: "Science, building and age-appropriate coding",
		note: "Follow questions and explore how things work.",
	},
];
export default function LearningDiscovery() {
	return (
		<section
			id="early-learning"
			className="gb-section gb-learning"
			aria-labelledby="learning-heading"
		>
			<div className="gb-wrap">
				<p className="gb-eyebrow">Early learning &amp; play</p>
				<h2 id="learning-heading">Start with what sparks their curiosity.</h2>
				<p className="gb-intro">
					A song, a story, a splash, a new game. Explore interests at your
					child’s pace and look for a programme that fits their age and your
					family.
				</p>
				<div className="gb-grid">
					{interests.map((item, i) => (
						<article className="gb-interest" key={item.title}>
							<span className="gb-number" aria-hidden="true">
								0{i + 1}
							</span>
							<h3>{item.title}</h3>
							<p className="gb-interest-detail">{item.detail}</p>
							<p>{item.note}</p>
						</article>
					))}
				</div>
				<div className="gb-after-grid">
					<Link className="gb-button" href="#partners">
						Meet featured programme partners →
					</Link>
					<p>
						Browse current programmes by age, area and category in the GoBela
						app.
					</p>
				</div>
			</div>
		</section>
	);
}
