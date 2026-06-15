"use client";

const C = {
	navy: "#0D2137",
	coral: "#FFB020",
	muted: "#64748B",
	cream: "#FFFBF5",
	border: "#EDE5DB",
};

export default function Navbar() {
	return (
		<nav
			style={{
				position: "sticky",
				top: 0,
				zIndex: 100,
				background: "rgba(255,251,245,0.96)",
				backdropFilter: "blur(16px)",
				WebkitBackdropFilter: "blur(16px)",
				borderBottom: `1px solid ${C.border}`,
				padding: "0 24px",
			}}
			aria-label="Main navigation"
		>
			<div
				style={{
					maxWidth: 960,
					margin: "0 auto",
					display: "flex",
					alignItems: "center",
					height: 60,
					gap: 24,
				}}
			>
				{/* Logo */}
				<a
					href="/"
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						textDecoration: "none",
						marginRight: "auto",
					}}
					aria-label="GoBela home"
				>
					<img
						src="/mascot/transparent/Happy.png"
						alt=""
						aria-hidden="true"
						style={{ width: 30, height: 30, objectFit: "contain" }}
					/>
					<span
						style={{
							fontSize: 19,
							fontWeight: 700,
							color: C.navy,
							letterSpacing: "-0.02em",
						}}
					>
						Go<span style={{ color: C.coral }}>Bela</span>
					</span>
				</a>

				{/* Nav links — hidden on small screens via CSS */}
				<style>{`
          @media (max-width: 640px) { .nav-links { display: none !important; } }
        `}</style>
				<div
					className="nav-links"
					style={{ display: "flex", gap: 20, alignItems: "center" }}
				>
					{(
						[
							["Features", "/#features"],
							["How it works", "/#how-it-works"],
							["About", "/about"],
							["Partners", "/partners"],
						] as [string, string][]
					).map(([label, href]) => (
						<a
							key={label}
							href={href}
							style={{
								fontSize: 13,
								color: C.muted,
								textDecoration: "none",
								fontWeight: 500,
							}}
						>
							{label}
						</a>
					))}
				</div>

				{/* CTA */}
				<a
					href="/#download"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
						background: C.coral,
						color: C.navy,
						border: "none",
						padding: "9px 18px",
						borderRadius: 10,
						fontSize: 13,
						fontWeight: 700,
						cursor: "pointer",
						textDecoration: "none",
						whiteSpace: "nowrap",
						letterSpacing: "-0.01em",
					}}
				>
					📱 Download free
				</a>
			</div>
		</nav>
	);
}
