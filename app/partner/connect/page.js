import { redirect } from "next/navigation";

const PROVIDER_MAP = {
	"penguin-swim": "Penguin Swim School",
	minisport: "MiniSport Singapore",
	"elevate-dance": "Elevate Dance Academie",
	"family-yoga": "Family Yoga SG @ Charm Element",
	"elite-linguistic": "Elite Linguistic Network",
	"golf-pc": "Golf PC",
	"fencing-masters": "Fencing Masters",
	"code-ninja": "Code Ninja",
	"bubbles-gym": "Bubbles Gym (Eastwood)",
	"seashell-academy": "Seashell Academy",
};

export default async function PartnerConnectPage({ searchParams }) {
	const params = await searchParams;
	const slug = params?.p;
	const providerName = PROVIDER_MAP[slug];

	if (!providerName) {
		return <ErrorPage message="Invalid or missing partner link. Please contact shuyang@gobela.sg." />;
	}

	let onboardingUrl;
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-connect-account`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ provider_name: providerName }),
				cache: "no-store",
			},
		);
		const data = await res.json();
		if (!data.onboarding_url) throw new Error(data.error || "No URL returned");
		onboardingUrl = data.onboarding_url;
	} catch (err) {
		return <ErrorPage message={`Could not generate your link: ${err.message}. Please contact shuyang@gobela.sg.`} />;
	}

	redirect(onboardingUrl);
}

function ErrorPage({ message }) {
	return (
		<html lang="en">
			<body style={{ fontFamily: "Arial, sans-serif", maxWidth: 480, margin: "80px auto", padding: "0 24px", color: "#1a1a1a" }}>
				<h2 style={{ color: "#e53e3e" }}>Something went wrong</h2>
				<p>{message}</p>
			</body>
		</html>
	);
}
