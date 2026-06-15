"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
		"idle",
	);

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("sending");
		const form = e.currentTarget;
		const data = new FormData(form);
		try {
			const res = await fetch("https://formspree.io/f/xeenljgj", {
				method: "POST",
				body: data,
				headers: { Accept: "application/json" },
			});
			if (res.ok) {
				setStatus("sent");
				form.reset();
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	}

	return (
		<>
			<Navbar />
			<main className="pt-16">
				<div className="max-w-2xl mx-auto px-5 py-20">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-extrabold text-[#1A2C4E] mb-4">
							Talk to us
						</h1>
						<p className="text-gray-500 text-lg">
							Partner with us, share feedback, or just say hello. We read every
							message.
						</p>
					</div>

					{status === "sent" ? (
						<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
							<div className="text-5xl mb-4">✅</div>
							<h2 className="text-2xl font-extrabold text-[#1A2C4E] mb-2">
								Message sent!
							</h2>
							<p className="text-gray-500 mb-8">
								Thanks for reaching out. We&apos;ll get back to you within one
								business day.
							</p>
							<button
								type="button"
								onClick={() => setStatus("idle")}
								className="bg-[#FFB703] text-[#1A2C4E] font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors"
							>
								Send another message
							</button>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6"
						>
							<div>
								<label className="block text-sm font-semibold text-[#1A2C4E] mb-2">
									Name
								</label>
								<input
									type="text"
									name="name"
									required
									placeholder="Your name"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB703] transition-colors text-gray-800"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#1A2C4E] mb-2">
									Email
								</label>
								<input
									type="email"
									name="email"
									required
									placeholder="your@email.com"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB703] transition-colors text-gray-800"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#1A2C4E] mb-2">
									Subject
								</label>
								<select
									name="subject"
									aria-label="Subject"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB703] transition-colors text-gray-800 bg-white"
								>
									<option value="Partnership">
										Partnership / Become a partner
									</option>
									<option value="Feedback">App feedback</option>
									<option value="Press">Press & media</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#1A2C4E] mb-2">
									Message
								</label>
								<textarea
									name="message"
									required
									rows={5}
									placeholder="Tell us how we can help..."
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFB703] transition-colors text-gray-800 resize-none"
								/>
							</div>

							{status === "error" && (
								<p className="text-red-500 text-sm text-center">
									Something went wrong. Please try again or email us directly at
									hello@gobela.sg
								</p>
							)}

							<button
								type="submit"
								disabled={status === "sending"}
								className="w-full bg-[#FFB703] text-[#1A2C4E] font-bold py-4 rounded-full hover:bg-yellow-400 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{status === "sending" ? "Sending…" : "Send Message"}
							</button>
						</form>
					)}

					<p className="text-center text-gray-400 text-sm mt-8">
						Or email us directly at{" "}
						<a
							href="mailto:hello@gobela.sg"
							className="text-[#FFB703] hover:underline"
						>
							hello@gobela.sg
						</a>
					</p>
				</div>
			</main>
			<Footer />
		</>
	);
}
