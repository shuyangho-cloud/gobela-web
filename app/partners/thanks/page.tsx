import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ThankYouPage() {
	return (
		<>
			<Navbar />
			<main className="pt-16 min-h-screen flex items-center justify-center bg-[#F8F9FA]">
				<div className="text-center max-w-md mx-auto px-5 py-20">
					<div className="text-6xl mb-6">🎉</div>
					<h1 className="text-3xl font-extrabold text-[#1A2C4E] mb-4">
						Application received!
					</h1>
					<p className="text-gray-500 mb-8">
						Thank you for applying to become a GoBela partner. Our team will
						review your application and reach out within 3 business days.
					</p>
					<Link
						href="/"
						className="inline-block bg-[#FFB703] text-[#1A2C4E] font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors"
					>
						Back to GoBela
					</Link>
				</div>
			</main>
			<Footer />
		</>
	);
}
