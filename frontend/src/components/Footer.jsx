import { Link } from "react-router-dom";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { COMPANY } from "@/lib/company";
import Logo from "@/components/Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="bg-[#18181B] text-[#FAFAFA] mt-auto"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={48} className="shrink-0" />
              <div>
                <div className="font-display text-2xl font-extrabold">BENOTEK-BAU Kft.</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
                  Gépi vakolás Magyarországon
                </div>
              </div>
            </div>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              Professzionális gépi vakolás kivitelezés. Gyors, precíz és
              megbízható szolgáltatás családi házakhoz, lakásokhoz és ipari
              létesítményekhez egyaránt.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
              Navigáció
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  data-testid="footer-link-home"
                  className="text-zinc-200 hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  Főoldal
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/szolgaltatasok"
                  data-testid="footer-link-services"
                  className="text-zinc-200 hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  Szolgáltatások
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/kapcsolat"
                  data-testid="footer-link-contact"
                  className="text-zinc-200 hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  Kapcsolat
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
              Kapcsolat
            </div>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  data-testid="footer-email"
                  className="flex items-start gap-3 text-zinc-200 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 mt-1 shrink-0 text-primary" />
                  <span className="break-all">{COMPANY.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  data-testid="footer-phone"
                  className="flex items-start gap-3 text-zinc-200 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 mt-1 shrink-0 text-primary" />
                  <span>{COMPANY.phone}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            © {year} BENOTEK-BAU Kft. · Minden jog fenntartva
          </p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Cementes gépi vakolás · 2 500 Ft/m²-től
          </p>
        </div>
      </div>
    </footer>
  );
}
