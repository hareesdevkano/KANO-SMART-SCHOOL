import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const columns = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Institutions", href: "#schools" },
        { name: "Check Results", href: "#check-results" },
        { name: "Download App", href: "/download", isRoute: true },
      ],
    },
    {
      title: "Schools",
      links: [
        { name: "Islamiyya & Tahfiz", href: "#schools" },
        { name: "K-12 Schools", href: "#schools" },
        { name: "Higher Education", href: "#schools" },
        { name: "Vocational", href: "#schools" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Contact", href: "mailto:hareesabdulkadir@gmail.com" },
      ],
    },
  ];

  return (
    <footer className="bg-luxury-navy-deep text-white/80 relative overflow-hidden border-t border-white/[0.06]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />

      <div className="container mx-auto px-6 pt-20 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-xl bg-luxury-teal flex items-center justify-center shadow-teal-glow">
                <span className="font-display font-bold text-2xl text-white">S</span>
                <div className="absolute inset-0 rounded-xl ring-1 ring-luxury-gold/40" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-white tracking-tight">
                  Smart<span className="text-luxury-gold">School</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-white/35 mt-1">
                  Education Platform
                </span>
              </div>
            </Link>
            <p className="text-white/45 mb-7 max-w-sm leading-relaxed text-sm">
              The premium school management platform for Nigerian institutions — trusted by 500+ schools to deliver excellence in education.
            </p>
            <div className="space-y-3.5 text-sm">
              <a href="mailto:hareesabdulkadir@gmail.com" className="flex items-center gap-3 text-white/50 hover:text-luxury-gold transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-luxury-gold/20 flex items-center justify-center group-hover:border-luxury-gold/50 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-luxury-gold" />
                </div>
                hareesabdulkadir@gmail.com
              </a>
              <div className="flex items-center gap-3 text-white/50">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-luxury-gold/20 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                </div>
                <div className="flex gap-3">
                  <a href="tel:+2349073733790" className="hover:text-luxury-gold transition-colors">+234 907 373 3790</a>
                  <span className="text-white/20">·</span>
                  <a href="tel:+2349166358735" className="hover:text-luxury-gold transition-colors">+234 916 635 8735</a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/50">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-luxury-gold/20 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                </div>
                Kano, Nigeria
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-luxury-gold text-sm mb-5 uppercase tracking-[0.2em]">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {(link as any).isRoute ? (
                      <Link to={link.href} className="text-sm text-white/45 hover:text-luxury-gold transition-colors flex items-center gap-1.5 group">
                        {link.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-white/45 hover:text-luxury-gold transition-colors">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/35 text-xs">
              © {new Date().getFullYear()} SmartSchool. All rights reserved.
            </p>
            <p className="text-white/25 text-xs mt-1">
              Powered by{" "}
              <span className="text-luxury-gold/80 font-semibold">
                Dual Intelligence ICT Services Kano
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
