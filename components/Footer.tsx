import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1A2C4E] text-white/70 text-sm">
      <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <p className="font-extrabold text-xl text-white tracking-tight mb-3">
            <span>Go</span><span style={{ color: "#FFB703" }}>Bela</span>
          </p>
          <p className="leading-relaxed text-white/60 text-xs">
            The Operating System for Modern Parenting.<br />
            Singapore · 2026
          </p>
        </div>

        {/* App */}
        <div>
          <p className="text-white font-semibold mb-3">App</p>
          <ul className="space-y-2">
            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
            <li><a href="#download" className="hover:text-white transition-colors">Download</a></li>
          </ul>
        </div>

        {/* Partners */}
        <div>
          <p className="text-white font-semibold mb-3">Partners</p>
          <ul className="space-y-2">
            <li><Link href="/partners" className="hover:text-white transition-colors">Become a Partner</Link></li>
            <li><Link href="/partners#types" className="hover:text-white transition-colors">Partner Types</Link></li>
            <li><Link href="/partners#faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-white font-semibold mb-3">Company</p>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><a href="mailto:hello@gobela.sg" className="hover:text-white transition-colors">hello@gobela.sg</a></li>
            <li><a href="mailto:partnerships@gobela.sg" className="hover:text-white transition-colors">partnerships@gobela.sg</a></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/support" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Child Safety</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-6xl mx-auto px-5 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
        <p>© 2026 GoBela Pte Ltd. All rights reserved.</p>
        <p>Made with ❤️ for Singapore families</p>
      </div>
    </footer>
  );
}
