import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Institutions", href: "#schools" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Live Demo", href: "/demo" },
    { name: "Schools", href: "/schools" },
    { name: "Results", href: "#check-results" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-luxury-cream/95 backdrop-blur-xl border-b border-luxury-emerald/10"
          : "bg-luxury-cream"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 bg-luxury-emerald flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:-translate-y-0.5">
              <span className="font-display italic font-bold text-[1.65rem] leading-none text-luxury-cream translate-y-[1px]">
                S
              </span>
              <span className="absolute inset-[3px] ring-1 ring-luxury-gold/45" />
              <span className="absolute -bottom-6 -right-6 w-12 h-12 rotate-45 bg-luxury-gold/25" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[1.35rem] italic font-bold text-luxury-emerald tracking-tight">
                SmartSchool
              </span>
              <span className="flex items-center gap-2 mt-1.5">
                <span className="h-px w-4 bg-luxury-gold" />
                <span className="text-[8.5px] uppercase tracking-[0.34em] text-luxury-emerald/55 font-bold">
                  Education Platform
                </span>
              </span>
            </div>
          </Link>


          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 font-medium text-sm text-luxury-emerald/70 hover:text-luxury-emerald transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-none font-medium text-luxury-emerald hover:bg-luxury-emerald/5 uppercase tracking-wider text-xs"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="rounded-none font-semibold bg-luxury-emerald text-luxury-cream hover:bg-luxury-emerald/90 border-0 uppercase tracking-wider text-xs px-6"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-none border border-luxury-emerald/20 hover:bg-luxury-emerald/5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5 text-luxury-emerald" /> : <Menu className="w-5 h-5 text-luxury-emerald" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-luxury-emerald/10 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-3 text-luxury-emerald/80 hover:text-luxury-emerald hover:bg-luxury-emerald/5 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-luxury-emerald/10">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full rounded-none border-luxury-emerald text-luxury-emerald hover:bg-luxury-emerald hover:text-luxury-cream">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button size="lg" className="w-full rounded-none bg-luxury-emerald text-luxury-cream hover:bg-luxury-emerald/90 border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
