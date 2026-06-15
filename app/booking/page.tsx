import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking · GoBela" };

interface Props {
	searchParams: Promise<{
		status?: string;
		child?: string;
		program?: string;
		msg?: string;
	}>;
}

export default async function BookingPage({ searchParams }: Props) {
	const { status, child, program, msg } = await searchParams;

	const configs = {
		confirmed: {
			icon: "✓",
			iconBg: "#d1fae5",
			iconColor: "#065f46",
			title: "Thank you for confirming!",
			body:
				child && program
					? `You've confirmed <strong>${child}</strong>'s <strong>${program}</strong> trial. The parent has been notified by email.`
					: "The booking has been confirmed and the parent has been notified.",
		},
		rejected: {
			icon: "✕",
			iconBg: "#fee2e2",
			iconColor: "#991b1b",
			title: "Booking declined",
			body:
				child && program
					? `You've declined <strong>${child}</strong>'s <strong>${program}</strong> trial. The parent has been notified and can choose another slot.`
					: "The booking has been declined and the parent has been notified.",
		},
		already_confirmed: {
			icon: "✓",
			iconBg: "#d1fae5",
			iconColor: "#065f46",
			title: "Already confirmed",
			body: "This booking was already confirmed.",
		},
		already_rejected: {
			icon: "✕",
			iconBg: "#fee2e2",
			iconColor: "#991b1b",
			title: "Already declined",
			body: "This booking was already declined.",
		},
		error: {
			icon: "!",
			iconBg: "#fef3c7",
			iconColor: "#92400e",
			title: "Something went wrong",
			body:
				msg ??
				"This link may be invalid or expired. Contact hello@gobela.sg for help.",
		},
	};

	const cfg = configs[status as keyof typeof configs] ?? configs.error;

	return (
		<div
			style={{
				background: "#f9fafb",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "24px",
				fontFamily:
					"-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
			}}
		>
			<div
				style={{
					background: "#fff",
					borderRadius: "20px",
					padding: "48px 36px",
					maxWidth: "400px",
					width: "100%",
					textAlign: "center",
					boxShadow: "0 4px 24px rgba(0,0,0,.08)",
				}}
			>
				{/* Logo */}
				<div
					style={{
						fontSize: "28px",
						fontWeight: 800,
						color: "#1a2e4a",
						letterSpacing: "-0.5px",
						marginBottom: "4px",
					}}
				>
					GoBela
				</div>
				<div
					style={{ fontSize: "12px", color: "#93c5fd", marginBottom: "32px" }}
				>
					Partner Portal
				</div>

				{/* Icon */}
				<div
					style={{
						width: "72px",
						height: "72px",
						borderRadius: "50%",
						background: cfg.iconBg,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 20px",
						fontSize: "32px",
						fontWeight: 900,
						color: cfg.iconColor,
					}}
				>
					{cfg.icon}
				</div>

				{/* Title */}
				<h1
					style={{
						fontSize: "20px",
						fontWeight: 800,
						color: "#1a2e4a",
						marginBottom: "10px",
					}}
				>
					{cfg.title}
				</h1>

				{/* Body */}
				<p
					style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}
					dangerouslySetInnerHTML={{ __html: cfg.body }}
				/>

				{/* Footer */}
				<div style={{ marginTop: "32px", fontSize: "11px", color: "#d1d5db" }}>
					GoBela Pte. Ltd. · Singapore
				</div>
			</div>
		</div>
	);
}
