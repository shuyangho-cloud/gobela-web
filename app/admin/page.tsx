"use client";
import { useEffect, useState } from "react";

const C = {
	coral: "#FFB020",
	navy: "#0D2137",
	cream: "#FFFBF5",
	bg2: "#F8F4F0",
	border: "#EDE5DB",
	muted: "#64748B",
	white: "#FFFFFF",
	green: "#16A34A",
	red: "#EF4444",
};

type Application = {
	id: string;
	business_name: string;
	contact_name: string;
	contact_email: string;
	contact_phone: string;
	whatsapp: string;
	application_type: string;
	website: string;
	instagram: string;
	full_address: string;
	location_district: string;
	description: string;
	class_details: ClassEntry[];
	logo_url: string;
	photo_urls: string[];
	status: string;
	created_at: string;
};

type ClassEntry = {
	name: string;
	age_range: string;
	description: string;
	trial_price: string;
	term_price: string;
	duration: string;
	schedule: string;
};

export default function AdminPage() {
	const [password, setPassword] = useState("");
	const [authed, setAuthed] = useState(false);
	const [apps, setApps] = useState<Application[]>([]);
	const [expanded, setExpanded] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [acting, setActing] = useState<string | null>(null);
	const [msg, setMsg] = useState("");
	const [filter, setFilter] = useState("pending");
	const [pushTitle, setPushTitle] = useState("");
	const [pushBody, setPushBody] = useState("");
	const [pushSending, setPushSending] = useState(false);
	const [pushResult, setPushResult] = useState("");
	const [connectProvider, setConnectProvider] = useState("");
	const [connectLoading, setConnectLoading] = useState(false);
	const [connectResult, setConnectResult] = useState<{ url?: string; account_id?: string; error?: string } | null>(null);

	useEffect(() => {
		const saved = sessionStorage.getItem("gobela_admin");
		if (saved) {
			setPassword(saved);
			setAuthed(true);
		}
	}, []);

	const login = async () => {
		setLoading(true);
		const res = await fetch("/api/admin/applications", {
			headers: { "x-admin-key": password },
		});
		setLoading(false);
		if (res.ok) {
			sessionStorage.setItem("gobela_admin", password);
			setAuthed(true);
			const { applications } = await res.json();
			setApps(applications);
		} else if (res.status === 401) {
			setMsg("Wrong password");
		} else {
			const err = await res.json().catch(() => ({}));
			setMsg(`Server error ${res.status}: ${err.error ?? "check Vercel logs"}`);
		}
	};

	const fetchApps = async (status = filter) => {
		setLoading(true);
		const res = await fetch(`/api/admin/applications?status=${status}`, {
			headers: { "x-admin-key": password },
		});
		setLoading(false);
		if (res.ok) {
			const { applications } = await res.json();
			setApps(applications);
		}
	};

	const act = async (id: string, action: "approve" | "reject") => {
		setActing(id + action);
		const res = await fetch("/api/admin/approve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, action, password }),
		});
		const data = await res.json();
		setActing(null);
		if (res.ok) {
			setMsg(
				action === "approve"
					? `✅ Approved — ${data.classes_created} class(es) created in enrichment_classes`
					: "🗑️ Rejected",
			);
			setApps((a) => a.filter((x) => x.id !== id));
		} else {
			setMsg(`Error: ${data.error}`);
		}
	};

	if (!authed) {
		return (
			<div
				style={{
					minHeight: "100vh",
					background: C.cream,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						background: C.white,
						border: `1px solid ${C.border}`,
						borderRadius: 16,
						padding: 40,
						width: 360,
						textAlign: "center",
					}}
				>
					<div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
					<h1
						style={{
							fontSize: 22,
							fontWeight: 700,
							color: C.navy,
							marginBottom: 24,
						}}
					>
						GoBela Admin
					</h1>
					<input
						type="password"
						placeholder="Admin password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && login()}
						style={{
							width: "100%",
							padding: "11px 14px",
							border: `1px solid ${C.border}`,
							borderRadius: 10,
							fontSize: 14,
							boxSizing: "border-box",
							marginBottom: 12,
							fontFamily: "inherit",
						}}
					/>
					{msg && (
						<p style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>
							{msg}
						</p>
					)}
					<button
						onClick={login}
						disabled={loading}
						style={{
							width: "100%",
							background: C.coral,
							color: C.navy,
							border: "none",
							padding: "12px",
							borderRadius: 10,
							fontSize: 14,
							fontWeight: 600,
							cursor: "pointer",
							fontFamily: "inherit",
						}}
					>
						{loading ? "Checking…" : "Log in →"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: "100vh",
				background: C.cream,
				fontFamily: "system-ui, sans-serif",
				padding: "32px 24px",
			}}
		>
			<div style={{ maxWidth: 900, margin: "0 auto" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 16,
						marginBottom: 28,
					}}
				>
					<h1
						style={{
							fontSize: 24,
							fontWeight: 700,
							color: C.navy,
							margin: 0,
							flex: 1,
						}}
					>
						Partner Applications
					</h1>
					<div style={{ display: "flex", gap: 8 }}>
						{(["pending", "approved", "rejected"] as const).map((s) => (
							<button
								key={s}
								onClick={() => {
									setFilter(s);
									fetchApps(s);
								}}
								style={{
									padding: "7px 14px",
									borderRadius: 8,
									border: `1px solid ${C.border}`,
									background: filter === s ? C.coral : C.white,
									color: filter === s ? C.navy : C.muted,
									fontWeight: 600,
									fontSize: 13,
									cursor: "pointer",
									fontFamily: "inherit",
									textTransform: "capitalize",
								}}
							>
								{s}
							</button>
						))}
					</div>
					<button
						onClick={() => fetchApps()}
						style={{
							padding: "7px 14px",
							borderRadius: 8,
							border: `1px solid ${C.border}`,
							background: C.white,
							fontSize: 13,
							cursor: "pointer",
							fontFamily: "inherit",
							color: C.muted,
						}}
					>
						↻ Refresh
					</button>
				</div>

				{msg && (
					<div
						style={{
							background: "#F0FDF4",
							border: "1px solid #BBF7D0",
							borderRadius: 10,
							padding: "12px 16px",
							marginBottom: 20,
							fontSize: 14,
							color: C.green,
						}}
					>
						{msg}{" "}
						<button
							onClick={() => setMsg("")}
							style={{
								marginLeft: 12,
								background: "none",
								border: "none",
								cursor: "pointer",
								color: C.muted,
							}}
						>
							✕
						</button>
					</div>
				)}

				{/* ── Push Broadcast ───────────────────────────────────────────── */}
				<div
					style={{
						background: C.white,
						border: `1px solid ${C.border}`,
						borderRadius: 14,
						padding: "20px 24px",
						marginBottom: 28,
					}}
				>
					<h2
						style={{
							fontSize: 16,
							fontWeight: 700,
							color: C.navy,
							margin: "0 0 16px",
						}}
					>
						📢 Broadcast Push Notification
					</h2>
					<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
						<input
							placeholder="Title  e.g. New classes near you!"
							value={pushTitle}
							onChange={(e) => setPushTitle(e.target.value)}
							style={{
								padding: "10px 14px",
								border: `1px solid ${C.border}`,
								borderRadius: 9,
								fontSize: 14,
								fontFamily: "inherit",
							}}
						/>
						<textarea
							placeholder="Message  e.g. Check out 3 new enrichment classes added this week in your area."
							value={pushBody}
							onChange={(e) => setPushBody(e.target.value)}
							rows={3}
							style={{
								padding: "10px 14px",
								border: `1px solid ${C.border}`,
								borderRadius: 9,
								fontSize: 14,
								fontFamily: "inherit",
								resize: "vertical",
							}}
						/>
						{pushResult && (
							<p
								style={{
									fontSize: 13,
									color: pushResult.startsWith("✅") ? C.green : C.red,
									margin: 0,
								}}
							>
								{pushResult}
							</p>
						)}
						<button
							disabled={pushSending || !pushTitle.trim() || !pushBody.trim()}
							onClick={async () => {
								if (
									!confirm(
										`Send to ALL GoBela users?\n\n"${pushTitle}"\n${pushBody}`,
									)
								)
									return;
								setPushSending(true);
								setPushResult("");
								const res = await fetch("/api/admin/broadcast", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({
										password,
										title: pushTitle,
										body: pushBody,
									}),
								});
								const data = await res.json();
								setPushSending(false);
								if (res.ok) {
									setPushResult(
										`✅ Sent to ${data.sent} devices (${data.failed} failed)`,
									);
									setPushTitle("");
									setPushBody("");
								} else {
									setPushResult(`❌ Error: ${data.error}`);
								}
							}}
							style={{
								alignSelf: "flex-start",
								padding: "10px 22px",
								background: C.navy,
								color: "#fff",
								border: "none",
								borderRadius: 9,
								fontSize: 14,
								fontWeight: 600,
								cursor: "pointer",
								fontFamily: "inherit",
								opacity:
									pushSending || !pushTitle.trim() || !pushBody.trim()
										? 0.5
										: 1,
							}}
						>
							{pushSending ? "Sending…" : "Send to all users →"}
						</button>
					</div>
				</div>

				{/* ── Stripe Connect ───────────────────────────────────────────── */}
				<div
					style={{
						background: C.white,
						border: `1px solid ${C.border}`,
						borderRadius: 14,
						padding: "20px 24px",
						marginBottom: 28,
					}}
				>
					<h2 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 16px" }}>
						💳 Generate Stripe Connect Link
					</h2>
					<div style={{ display: "flex", gap: 10 }}>
						<input
							placeholder="Provider name e.g. Penguin Swim School"
							value={connectProvider}
							onChange={(e) => { setConnectProvider(e.target.value); setConnectResult(null); }}
							style={{ flex: 1, padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 14, fontFamily: "inherit" }}
						/>
						<button
							disabled={connectLoading || !connectProvider.trim()}
							onClick={async () => {
								setConnectLoading(true);
								setConnectResult(null);
								const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-connect-account`, {
									method: "POST",
									headers: { "Content-Type": "application/json", apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
									body: JSON.stringify({ provider_name: connectProvider.trim() }),
								});
								const data = await res.json();
								setConnectLoading(false);
								setConnectResult(data);
							}}
							style={{ padding: "10px 20px", background: C.navy, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: connectLoading || !connectProvider.trim() ? 0.5 : 1 }}
						>
							{connectLoading ? "Generating…" : "Get link →"}
						</button>
					</div>
					{connectResult?.error && (
						<p style={{ marginTop: 10, fontSize: 13, color: C.red }}>{connectResult.error}</p>
					)}
					{connectResult?.url && (
						<div style={{ marginTop: 12, background: C.bg2, borderRadius: 9, padding: "12px 16px" }}>
							<p style={{ fontSize: 12, color: C.muted, margin: "0 0 6px" }}>Account: <strong>{connectResult.account_id}</strong></p>
							<p style={{ fontSize: 13, color: C.navy, margin: "0 0 8px", wordBreak: "break-all" }}>{connectResult.url}</p>
							<button
								onClick={() => { navigator.clipboard.writeText(connectResult.url!); }}
								style={{ padding: "6px 14px", background: C.coral, border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", color: C.navy, fontFamily: "inherit" }}
							>
								Copy link
							</button>
						</div>
					)}
				</div>

				{loading && <p style={{ color: C.muted, fontSize: 14 }}>Loading…</p>}

				{!loading && apps.length === 0 && (
					<div
						style={{
							textAlign: "center",
							padding: 60,
							color: C.muted,
							fontSize: 15,
						}}
					>
						No {filter} applications.
					</div>
				)}

				<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
					{apps.map((app) => (
						<div
							key={app.id}
							style={{
								background: C.white,
								border: `1px solid ${C.border}`,
								borderRadius: 14,
								overflow: "hidden",
							}}
						>
							{/* Header row */}
							<div
								role="button"
								tabIndex={0}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 14,
									padding: "16px 20px",
									cursor: "pointer",
								}}
								onClick={() => setExpanded(expanded === app.id ? null : app.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										setExpanded(expanded === app.id ? null : app.id);
								}}
							>
								{app.logo_url && (
									<img
										src={app.logo_url}
										alt=""
										style={{
											width: 48,
											height: 48,
											objectFit: "contain",
											borderRadius: 8,
											border: `1px solid ${C.border}`,
											flexShrink: 0,
										}}
									/>
								)}
								<div style={{ flex: 1 }}>
									<div style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>
										{app.business_name}
									</div>
									<div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
										{app.contact_name} · {app.contact_email} ·{" "}
										{app.application_type}
										{app.class_details?.length
											? ` · ${app.class_details.length} class(es)`
											: ""}
									</div>
								</div>
								<div
									style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}
								>
									{new Date(app.created_at).toLocaleDateString("en-SG", {
										day: "numeric",
										month: "short",
									})}
								</div>
								<span style={{ color: C.coral, fontWeight: 600, fontSize: 18 }}>
									{expanded === app.id ? "−" : "+"}
								</span>
							</div>

							{/* Expanded detail */}
							{expanded === app.id && (
								<div
									style={{
										borderTop: `1px solid ${C.border}`,
										padding: "20px 20px 24px",
									}}
								>
									{/* Contact row */}
									<div
										style={{
											display: "grid",
											gridTemplateColumns:
												"repeat(auto-fit, minmax(180px, 1fr))",
											gap: 12,
											marginBottom: 20,
										}}
									>
										{[
											["Phone", app.contact_phone],
											["WhatsApp", app.whatsapp],
											["Website", app.website],
											["Instagram", app.instagram ? `@${app.instagram}` : null],
											["Address", app.full_address],
										].map(([label, val]) =>
											val ? (
												<div key={label as string}>
													<div
														style={{
															fontSize: 11,
															fontWeight: 600,
															color: C.muted,
															textTransform: "uppercase",
															letterSpacing: "0.05em",
															marginBottom: 3,
														}}
													>
														{label}
													</div>
													<div style={{ fontSize: 13, color: C.navy }}>
														{val}
													</div>
												</div>
											) : null,
										)}
									</div>

									{/* Description */}
									{app.description && (
										<div style={{ marginBottom: 20 }}>
											<div
												style={{
													fontSize: 11,
													fontWeight: 600,
													color: C.muted,
													textTransform: "uppercase",
													letterSpacing: "0.05em",
													marginBottom: 6,
												}}
											>
												About
											</div>
											<p
												style={{
													fontSize: 13,
													color: C.navy,
													lineHeight: 1.65,
													margin: 0,
												}}
											>
												{app.description}
											</p>
										</div>
									)}

									{/* Classes */}
									{app.class_details?.length > 0 && (
										<div style={{ marginBottom: 20 }}>
											<div
												style={{
													fontSize: 11,
													fontWeight: 600,
													color: C.muted,
													textTransform: "uppercase",
													letterSpacing: "0.05em",
													marginBottom: 10,
												}}
											>
												Classes
											</div>
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: 10,
												}}
											>
												{app.class_details.map((cls: ClassEntry, i: number) => (
													<div
														key={i}
														style={{
															background: C.bg2,
															borderRadius: 10,
															padding: "12px 16px",
														}}
													>
														<div
															style={{
																fontWeight: 600,
																fontSize: 14,
																color: C.navy,
																marginBottom: 4,
															}}
														>
															{cls.name}{" "}
															<span style={{ fontWeight: 400, color: C.muted }}>
																· {cls.age_range}
															</span>
														</div>
														<div
															style={{
																fontSize: 13,
																color: C.muted,
																marginBottom: 6,
															}}
														>
															{cls.description}
														</div>
														<div
															style={{
																fontSize: 12,
																color: C.navy,
																display: "flex",
																gap: 16,
																flexWrap: "wrap",
															}}
														>
															<span>
																Trial: <strong>S${cls.trial_price}</strong>
															</span>
															<span>
																Term: <strong>S${cls.term_price}</strong>
															</span>
															<span>
																Duration: <strong>{cls.duration}min</strong>
															</span>
															<span>
																Schedule: <strong>{cls.schedule}</strong>
															</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Photos */}
									{(app.logo_url || app.photo_urls?.length > 0) && (
										<div style={{ marginBottom: 24 }}>
											<div
												style={{
													fontSize: 11,
													fontWeight: 600,
													color: C.muted,
													textTransform: "uppercase",
													letterSpacing: "0.05em",
													marginBottom: 10,
												}}
											>
												Media
											</div>
											<div
												style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
											>
												{app.logo_url && (
													<div>
														<div
															style={{
																fontSize: 11,
																color: C.muted,
																marginBottom: 4,
															}}
														>
															Logo
														</div>
														<img
															src={app.logo_url}
															alt="logo"
															style={{
																height: 80,
																objectFit: "contain",
																borderRadius: 8,
																border: `1px solid ${C.border}`,
																background: C.bg2,
															}}
														/>
													</div>
												)}
												{app.photo_urls?.map((url: string, i: number) => (
													<div key={i}>
														<div
															style={{
																fontSize: 11,
																color: C.muted,
																marginBottom: 4,
															}}
														>
															Photo {i + 1}
														</div>
														<img
															src={url}
															alt={`Class ${i + 1}`}
															style={{
																height: 80,
																width: 120,
																objectFit: "cover",
																borderRadius: 8,
																border: `1px solid ${C.border}`,
															}}
														/>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Actions */}
									{app.status === "pending" && (
										<div style={{ display: "flex", gap: 10 }}>
											<button
												onClick={() => act(app.id, "approve")}
												disabled={!!acting}
												style={{
													flex: 1,
													background: C.green,
													color: "#fff",
													border: "none",
													padding: "12px",
													borderRadius: 10,
													fontSize: 14,
													fontWeight: 600,
													cursor: "pointer",
													fontFamily: "inherit",
													opacity: acting ? 0.6 : 1,
												}}
											>
												{acting === `${app.id}approve`
													? "Creating classes…"
													: "✅ Approve & go live"}
											</button>
											<button
												onClick={() => act(app.id, "reject")}
												disabled={!!acting}
												style={{
													padding: "12px 20px",
													background: "#FEF2F2",
													color: C.red,
													border: `1px solid #FECACA`,
													borderRadius: 10,
													fontSize: 14,
													fontWeight: 600,
													cursor: "pointer",
													fontFamily: "inherit",
													opacity: acting ? 0.6 : 1,
												}}
											>
												{acting === `${app.id}reject` ? "…" : "Reject"}
											</button>
										</div>
									)}
									{app.status !== "pending" && (
										<div
											style={{
												fontSize: 13,
												color: C.muted,
												textAlign: "center",
												padding: "8px 0",
											}}
										>
											Status:{" "}
											<strong style={{ textTransform: "capitalize" }}>
												{app.status}
											</strong>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
