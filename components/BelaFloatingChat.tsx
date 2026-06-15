"use client";

import { useEffect, useRef, useState } from "react";

const C = {
	gold: "#FFB020",
	navy: "#0D2137",
	bg2: "#F8F4F0",
	border: "#EDE5DB",
	muted: "#64748B",
	white: "#FFFFFF",
};

type Msg = { role: "user" | "assistant"; content: string };

const PROMPTS = [
	{
		label: "🌧️ Rainy day",
		text: "Rainy Sunday, kids aged 5 and 8 — what should we do?",
	},
	{
		label: "🍽️ Dine out",
		text: "Family-friendly restaurant near Orchard for 2 kids?",
	},
	{
		label: "🎓 Find a class",
		text: "Swimming trial for a 6-year-old in the East?",
	},
	{
		label: "🍳 Quick dinner",
		text: "Quick dinner from NTUC basics, 2 picky kids",
	},
];

export default function BelaFloatingChat() {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Msg[]>([
		{
			role: "assistant",
			content:
				"Hi! I'm Bela 👋 Tell me about your family's day and I'll help plan something great!",
		},
	]);
	const chatRef = useRef<HTMLDivElement>(null);
	const histRef = useRef<Msg[]>([]);

	useEffect(() => {
		if (chatRef.current)
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
	}, [messages, loading]);

	const send = async (text?: string) => {
		const content = (text ?? input).trim();
		if (!content || loading) return;
		setInput("");
		setLoading(true);
		const userMsg: Msg = { role: "user", content };
		histRef.current = [...histRef.current, userMsg];
		setMessages((p) => [...p, userMsg]);
		try {
			const res = await fetch("/api/bela", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: histRef.current }),
			});
			const data = await res.json();
			const reply = data.reply ?? "Hmm, tell me a bit more?";
			const aMsg: Msg = { role: "assistant", content: reply };
			histRef.current = [...histRef.current, aMsg];
			setMessages((p) => [...p, aMsg]);
		} catch {
			setMessages((p) => [
				...p,
				{ role: "assistant", content: "Oops! Try again in a moment 🙏" },
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<style>{`
        @keyframes bela-typing{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes bela-slide-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .bela-fab:hover{transform:scale(1.07)!important}
        .bela-send:hover{opacity:.85!important}
      `}</style>

			{/* Floating action button */}
			<button
				className="bela-fab"
				onClick={() => setOpen((o) => !o)}
				aria-label={open ? "Close Bela chat" : "Chat with Bela"}
				style={{
					position: "fixed",
					bottom: 24,
					right: 24,
					width: 56,
					height: 56,
					borderRadius: "50%",
					background: C.gold,
					border: "none",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "0 4px 20px rgba(255,176,32,0.5)",
					zIndex: 9999,
					transition: "transform 0.18s",
				}}
			>
				{open ? (
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#fff"
						strokeWidth="2.5"
						strokeLinecap="round"
						aria-hidden="true"
					>
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				) : (
					<img
						src="/mascot/transparent/Happy.png"
						alt="Bela"
						style={{ width: 38, height: 38, objectFit: "contain" }}
					/>
				)}
			</button>

			{/* Chat panel */}
			{open && (
				<div
					style={{
						position: "fixed",
						bottom: 92,
						right: 24,
						width: 340,
						maxHeight: 520,
						background: C.white,
						borderRadius: 20,
						boxShadow: "0 12px 60px rgba(0,0,0,0.15)",
						border: `1px solid ${C.border}`,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						zIndex: 9998,
						animation: "bela-slide-up 0.18s ease",
					}}
				>
					{/* Header */}
					<div
						style={{
							background: C.navy,
							padding: "12px 16px",
							display: "flex",
							alignItems: "center",
							gap: 10,
							flexShrink: 0,
						}}
					>
						<img
							src="/mascot/transparent/Happy.png"
							alt="Bela"
							style={{
								width: 36,
								height: 36,
								objectFit: "contain",
								flexShrink: 0,
							}}
						/>
						<div>
							<div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
								Bela
							</div>
							<div
								style={{
									fontSize: 11,
									color: "rgba(255,255,255,0.55)",
									display: "flex",
									alignItems: "center",
									gap: 4,
								}}
							>
								<span
									style={{
										width: 5,
										height: 5,
										borderRadius: "50%",
										background: "#4ADE80",
										display: "inline-block",
									}}
								/>
								Your AI parenting co-pilot
							</div>
						</div>
					</div>

					{/* Messages */}
					<div
						ref={chatRef}
						style={{
							flex: 1,
							overflowY: "auto",
							padding: 14,
							display: "flex",
							flexDirection: "column",
							gap: 10,
						}}
					>
						{messages.map((msg, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									flexDirection: msg.role === "user" ? "row-reverse" : "row",
									gap: 6,
									alignItems: "flex-end",
								}}
							>
								{msg.role === "assistant" && (
									<img
										src="/mascot/transparent/Happy.png"
										alt="Bela"
										style={{
											width: 24,
											height: 24,
											objectFit: "contain",
											flexShrink: 0,
										}}
									/>
								)}
								<div
									style={{
										padding: "8px 12px",
										fontSize: 13,
										lineHeight: 1.55,
										maxWidth: "80%",
										borderRadius: 12,
										borderBottomLeftRadius: msg.role === "assistant" ? 2 : 12,
										borderBottomRightRadius: msg.role === "user" ? 2 : 12,
										background: msg.role === "user" ? C.gold : C.bg2,
										color: msg.role === "user" ? "#fff" : C.navy,
										border:
											msg.role === "assistant"
												? `1px solid ${C.border}`
												: "none",
									}}
								>
									{msg.content}
								</div>
							</div>
						))}
						{loading && (
							<div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
								<img
									src="/mascot/transparent/Happy.png"
									alt="Bela"
									style={{
										width: 24,
										height: 24,
										objectFit: "contain",
										flexShrink: 0,
									}}
								/>
								<div
									style={{
										padding: "10px 12px",
										borderRadius: "12px 12px 12px 2px",
										background: C.bg2,
										border: `1px solid ${C.border}`,
										display: "flex",
										gap: 4,
										alignItems: "center",
									}}
								>
									{[0, 1, 2].map((i) => (
										<div
											key={i}
											style={{
												width: 5,
												height: 5,
												borderRadius: "50%",
												background: C.gold,
												animation: `bela-typing 1s ${i * 0.2}s infinite`,
											}}
										/>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Quick prompts */}
					<div
						style={{
							padding: "8px 12px",
							borderTop: `1px solid ${C.border}`,
							display: "flex",
							gap: 6,
							flexWrap: "wrap",
							flexShrink: 0,
						}}
					>
						{PROMPTS.map(({ label, text }) => (
							<button
								key={label}
								onClick={() => send(text)}
								style={{
									background: C.bg2,
									border: `1px solid ${C.border}`,
									color: C.muted,
									borderRadius: 999,
									padding: "4px 10px",
									fontSize: 11,
									cursor: "pointer",
									fontFamily: "inherit",
								}}
							>
								{label}
							</button>
						))}
					</div>

					{/* Input */}
					<div
						style={{
							padding: "8px 12px 12px",
							borderTop: `1px solid ${C.border}`,
							display: "flex",
							gap: 8,
							flexShrink: 0,
						}}
					>
						<input
							style={{
								flex: 1,
								padding: "9px 12px",
								border: `1px solid ${C.border}`,
								borderRadius: 8,
								fontSize: 13,
								fontFamily: "inherit",
								background: C.white,
								color: C.navy,
								outline: "none",
							}}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && send()}
							placeholder="Ask Bela anything..."
							disabled={loading}
						/>
						<button
							className="bela-send"
							onClick={() => send()}
							disabled={loading || !input.trim()}
							style={{
								background: C.gold,
								color: "#fff",
								border: "none",
								borderRadius: 8,
								padding: "9px 14px",
								fontSize: 16,
								fontWeight: 700,
								cursor: "pointer",
								opacity: !input.trim() || loading ? 0.4 : 1,
								transition: "opacity 0.15s",
							}}
						>
							↑
						</button>
					</div>
				</div>
			)}
		</>
	);
}
