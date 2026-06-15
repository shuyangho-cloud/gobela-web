export default function Page() {
	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#F9F6F1",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "32px 20px",
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 13,
					fontWeight: 700,
					color: "#0D2137",
					textAlign: "center",
					marginBottom: 28,
					letterSpacing: "-0.02em",
				}}
			>
				🐾 GoBela
			</div>
			<div
				style={{
					background: "#fff",
					borderRadius: 24,
					padding: "36px 28px",
					maxWidth: 420,
					width: "100%",
					boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
					textAlign: "center",
				}}
			>
				<div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
				<div
					style={{
						fontSize: 26,
						fontWeight: 800,
						color: "#0D2137",
						letterSpacing: "-0.02em",
						marginBottom: 8,
					}}
				>
					Premium Plans
				</div>
				<div style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>
					Coming soon
				</div>
				<div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6 }}>
					We&apos;re putting the finishing touches on our premium plans.
					<br />
					In the meantime, enjoy full access to GoBela for free.
				</div>
				<a
					href="https://gobela.sg"
					style={{
						display: "block",
						marginTop: 28,
						padding: "13px 0",
						borderRadius: 14,
						fontSize: 15,
						fontWeight: 700,
						color: "#fff",
						background: "#0D9488",
						textDecoration: "none",
					}}
				>
					Back to GoBela →
				</a>
			</div>
		</div>
	);
}
