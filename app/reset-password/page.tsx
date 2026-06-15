"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const C = {
	navy: "#0D2137",
	gold: "#FFB020",
	bg: "#FFFBF5",
	border: "#EDE5DB",
	muted: "#64748B",
	white: "#FFFFFF",
	red: "#EF4444",
	green: "#16A34A",
};

const S: Record<string, React.CSSProperties> = {
	input: {
		width: "100%",
		padding: "12px 14px",
		border: `1px solid ${C.border}`,
		borderRadius: 10,
		fontSize: 15,
		fontFamily: "inherit",
		background: C.white,
		color: C.navy,
		outline: "none",
		boxSizing: "border-box",
	},
	btn: {
		width: "100%",
		padding: "13px",
		background: C.gold,
		color: C.navy,
		border: "none",
		borderRadius: 10,
		fontSize: 15,
		fontWeight: 700,
		cursor: "pointer",
		fontFamily: "inherit",
	},
};

export default function ResetPasswordPage() {
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "done" | "error" | "invalid"
	>("idle");
	const [message, setMessage] = useState("");
	const [hasToken, setHasToken] = useState(false);

	useEffect(() => {
		// Supabase puts the recovery token in the URL hash
		const hash = window.location.hash;
		if (hash.includes("type=recovery") || hash.includes("access_token")) {
			setHasToken(true);
		} else {
			setStatus("invalid");
		}
	}, []);

	const handleReset = async () => {
		if (password.length < 8) {
			setMessage("Password must be at least 8 characters.");
			setStatus("error");
			return;
		}
		if (password !== confirm) {
			setMessage("Passwords do not match.");
			setStatus("error");
			return;
		}

		setStatus("loading");
		try {
			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			);
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			setStatus("done");
		} catch (e: unknown) {
			setMessage(
				e instanceof Error ? e.message : "Something went wrong. Try again.",
			);
			setStatus("error");
		}
	};

	return (
		<main
			style={{
				minHeight: "100vh",
				background: C.bg,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 24,
				fontFamily:
					"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			}}
		>
			<div style={{ width: "100%", maxWidth: 400 }}>
				{/* Logo */}
				<div style={{ textAlign: "center", marginBottom: 32 }}>
					<a
						href="/"
						style={{
							fontSize: 24,
							fontWeight: 700,
							color: C.navy,
							textDecoration: "none",
						}}
					>
						Go<span style={{ color: C.gold }}>Bela</span>
					</a>
				</div>

				<div
					style={{
						background: C.white,
						border: `1px solid ${C.border}`,
						borderRadius: 20,
						padding: 32,
					}}
				>
					{status === "invalid" && (
						<>
							<div
								style={{ fontSize: 40, textAlign: "center", marginBottom: 16 }}
							>
								⚠️
							</div>
							<h1
								style={{
									fontSize: 20,
									fontWeight: 700,
									color: C.navy,
									textAlign: "center",
									marginBottom: 10,
								}}
							>
								Invalid reset link
							</h1>
							<p
								style={{
									fontSize: 14,
									color: C.muted,
									textAlign: "center",
									lineHeight: 1.65,
									marginBottom: 24,
								}}
							>
								This link has expired or is invalid. Request a new one from the
								app or partner login screen.
							</p>
							<a
								href="/"
								style={{
									...S.btn,
									display: "block",
									textAlign: "center",
									textDecoration: "none",
								}}
							>
								Back to GoBela
							</a>
						</>
					)}

					{status === "done" && (
						<>
							<div
								style={{ fontSize: 40, textAlign: "center", marginBottom: 16 }}
							>
								✅
							</div>
							<h1
								style={{
									fontSize: 20,
									fontWeight: 700,
									color: C.navy,
									textAlign: "center",
									marginBottom: 10,
								}}
							>
								Password updated!
							</h1>
							<p
								style={{
									fontSize: 14,
									color: C.muted,
									textAlign: "center",
									lineHeight: 1.65,
									marginBottom: 24,
								}}
							>
								Your password has been changed. You can now log in with your new
								password.
							</p>
							<a
								href="/"
								style={{
									...S.btn,
									display: "block",
									textAlign: "center",
									textDecoration: "none",
								}}
							>
								Back to GoBela
							</a>
						</>
					)}

					{hasToken && status !== "done" && status !== "invalid" && (
						<>
							<h1
								style={{
									fontSize: 22,
									fontWeight: 700,
									color: C.navy,
									marginBottom: 6,
								}}
							>
								Set new password
							</h1>
							<p
								style={{
									fontSize: 14,
									color: C.muted,
									lineHeight: 1.6,
									marginBottom: 24,
								}}
							>
								Choose a strong password — at least 8 characters.
							</p>

							<div
								style={{ display: "flex", flexDirection: "column", gap: 14 }}
							>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 13,
											fontWeight: 600,
											color: C.navy,
											marginBottom: 6,
										}}
									>
										New password
									</label>
									<input
										style={S.input}
										type="password"
										placeholder="Min. 8 characters"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											setStatus("idle");
										}}
									/>
								</div>
								<div>
									<label
										style={{
											display: "block",
											fontSize: 13,
											fontWeight: 600,
											color: C.navy,
											marginBottom: 6,
										}}
									>
										Confirm password
									</label>
									<input
										style={S.input}
										type="password"
										placeholder="Repeat your password"
										value={confirm}
										onChange={(e) => {
											setConfirm(e.target.value);
											setStatus("idle");
										}}
										onKeyDown={(e) => e.key === "Enter" && handleReset()}
									/>
								</div>

								{status === "error" && (
									<p style={{ fontSize: 13, color: C.red, margin: 0 }}>
										{message}
									</p>
								)}

								<button
									style={{ ...S.btn, opacity: status === "loading" ? 0.6 : 1 }}
									onClick={handleReset}
									disabled={status === "loading"}
								>
									{status === "loading" ? "Updating…" : "Update password"}
								</button>
							</div>
						</>
					)}
				</div>

				<p
					style={{
						textAlign: "center",
						fontSize: 12,
						color: C.muted,
						marginTop: 20,
					}}
				>
					Need help?{" "}
					<a href="mailto:hello@gobela.sg" style={{ color: C.gold }}>
						hello@gobela.sg
					</a>
				</p>
			</div>
		</main>
	);
}
