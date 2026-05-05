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
    { name: "Results", href: "#check-results" },
    { name: "Stories", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-luxury-navy-deep/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-luxury"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-luxury-teal flex items-center justify-center shadow-teal-glow transition-transform duration-300 group-hover:scale-105">
              <span className="font-display font-bold text-xl text-white">S</span>
              <div className="absolute inset-0 rounded-xl ring-1 ring-luxury-gold/40" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-white tracking-tight">
                Smart<span className="text-luxury-gold">School</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-medium mt-1">
                Education Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg font-medium text-sm text-white/70 hover:text-luxury-gold transition-colors duration-200"
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
                className="font-medium text-white/80 hover:text-white hover:bg-white/[0.06] rounded-lg"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="font-semibold rounded-lg bg-luxury-gold text-luxury-navy-deep hover:bg-luxury-gold/90 shadow-gold-glow border-0"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/[0.08] animate-slide-up bg-luxury-navy-deep/95 backdrop-blur-2xl rounded-b-2xl">
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-white/80 hover:text-luxury-gold hover:bg-white/[0.04] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.08]">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full bg-transparent border-white/20 text-white hover:bg-white/[0.06]">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button size="lg" className="w-full bg-luxury-gold text-luxury-navy-deep hover:bg-luxury-gold/90 border-0">
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
