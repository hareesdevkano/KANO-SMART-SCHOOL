import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const columns = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Institutions", href: "#schools" },
        { name: "Check Results", href: "#check-results" },
        { name: "Live Demo", href: "/demo", isRoute: true },
      ],
    },
    {
      title: "Schools",
      links: [
        { name: "Islamiyya & Tahfiz", href: "#schools" },
        { name: "K-12 Schools", href: "#schools" },
        { name: "Higher Education", href: "#schools" },
        { name: "Registered Schools", href: "/schools", isRoute: true },
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
    <footer className="bg-luxury-navy-deep text-luxury-cream border-t border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-10 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-none bg-luxury-gold flex items-center justify-center">
                <span className="font-display italic font-bold text-2xl text-luxury-emerald">S</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl italic font-bold text-luxury-cream tracking-tight">
                  SmartSchool
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-luxury-gold mt-1">
                  Education Platform
                </span>
              </div>
            </Link>
            <p className="text-luxury-cream/60 mb-7 max-w-sm leading-relaxed text-sm">
              The premium school management platform for Nigerian institutions — trusted by 500+ schools to deliver excellence in education.
            </p>
            <div className="space-y-3.5 text-sm">
              <a href="mailto:hareesabdulkadir@gmail.com" className="flex items-center gap-3 text-luxury-cream/70 hover:text-luxury-gold transition-colors">
                <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
                hareesabdulkadir@gmail.com
              </a>
              <div className="flex items-center gap-3 text-luxury-cream/70">
                <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
                <div className="flex gap-3">
                  <a href="tel:+2349073733790" className="hover:text-luxury-gold transition-colors">+234 907 373 3790</a>
                  <span className="text-luxury-cream/30">·</span>
                  <a href="tel:+2349166358735" className="hover:text-luxury-gold transition-colors">+234 916 635 8735</a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-luxury-cream/70">
                <MapPin className="w-4 h-4 text-luxury-gold shrink-0" />
                Kano, Nigeria
              </div>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-luxury-gold text-xs mb-5 uppercase tracking-[0.25em]">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {(link as any).isRoute ? (
                      <Link to={link.href} className="text-sm text-luxury-cream/60 hover:text-luxury-gold transition-colors">
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-luxury-cream/60 hover:text-luxury-gold transition-colors">
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
        <div className="border-t border-luxury-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-luxury-cream/50 text-xs">
              © {new Date().getFullYear()} SmartSchool. All rights reserved.
            </p>
            <p className="text-luxury-cream/40 text-xs mt-1">
              Powered by{" "}
              <span className="text-luxury-gold font-semibold">
                Dual Intelligence ICT Services Kano
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-luxury-cream/50 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
