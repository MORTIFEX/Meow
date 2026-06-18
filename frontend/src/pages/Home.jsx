import { Link } from "react-router-dom";
import { ArrowRight, Zap, Target, ShieldCheck, Clock, CheckCircle2, Calculator, Phone } from "lucide-react";
import { COMPANY, formatFt } from "@/lib/company";

const features = [
  {
    icon: Zap,
    title: "Gyorsaság",
    desc: "Akár 5x gyorsabb kivitelezés a hagyományos kézi vakoláshoz képest. Egy nap alatt több száz négyzetméter.",
  },
  {
    icon: Target,
    title: "Precizitás",
    desc: "Egyenletes, sík és milliméter pontos felület. Tökéletes alap festéshez, burkoláshoz, tapétázáshoz.",
  },
  {
    icon: ShieldCheck,
    title: "Megbízhatóság",
    desc: "Több év szakmai tapasztalat. Garantált minőség, tiszta munkavégzés, határidő betartás.",
  },
];

const stats = [
  { value: "5×", label: "Gyorsabb mint a kézi" },
  { value: "2500", label: "Ft/m²-től" },
  { value: "100%", label: "Minőségi garancia" },
];

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#18181B] text-white" data-testid="hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/5493665/pexels-photo-5493665.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#18181B] via-[#18181B]/85 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-28 lg:py-40">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-orange-400 mb-8" data-testid="hero-badge">
              <span className="h-1.5 w-1.5 bg-orange-400 animate-pulse" />
              BENOTEK-BAU Kft.
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95]" data-testid="hero-title">
              Professzionális<br />
              <span className="text-primary">cementes gépi vakolás</span><br />
              kivitelezés.
            </h1>

            <p className="mt-8 text-lg lg:text-xl text-zinc-300 max-w-2xl leading-relaxed" data-testid="hero-subtitle">
              Modern technológiával, gyorsan és precízen. Családi házaktól ipari
              létesítményekig — minden projektnél garantált minőséget szállítunk.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to="/kapcsolat"
                data-testid="hero-cta-primary"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-wider hover:bg-orange-600 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                Kérjen árajánlatot
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/szolgaltatasok"
                data-testid="hero-cta-secondary"
                className="inline-flex items-center gap-3 border-2 border-white/20 text-white px-8 py-4 font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
              >
                <Calculator className="h-5 w-5" />
                Ár kalkulátor
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mt-24 grid grid-cols-3 gap-px bg-white/10" data-testid="hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="bg-[#18181B] px-4 py-6 lg:p-8">
                <div className="font-display text-3xl lg:text-5xl font-extrabold text-primary">
                  {s.value}
                </div>
                <div className="mt-2 text-[10px] lg:text-xs uppercase tracking-widest text-zinc-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 lg:py-32" data-testid="features-section">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end mb-16">
            <div className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Miért minket válasszon
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
                A vakolás új<br />
                <span className="text-primary">generációja.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-lg text-muted-foreground leading-relaxed">
                A gépi vakolás kombinálja a gyorsaságot, a precizitást és a
                gazdaságosságot. Nálunk minden projekt egyedi figyelmet kap a
                tervezéstől az átadásig.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-card p-8 lg:p-12 hover:bg-[#18181B] hover:text-white transition-all duration-500"
                data-testid={`feature-card-${i}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground group-hover:bg-white group-hover:text-primary transition-colors">
                    <f.icon className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  <div className="font-mono-alt text-2xl font-bold text-muted-foreground group-hover:text-zinc-500 transition-colors">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="mt-8 font-display text-2xl lg:text-3xl font-bold">
                  {f.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground group-hover:text-zinc-300 transition-colors">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS / VISUAL */}
      <section className="bg-secondary text-secondary-foreground py-24 lg:py-32" data-testid="process-section">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/10383588/pexels-photo-10383588.jpeg?auto=compress&cs=tinysrgb&w=940"
                alt="Cementes gépi vakolás kivitelezés folyamatban"
                className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                data-testid="process-image"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Folyamat
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-10">
                Tervezéstől<br />az átadásig.
              </h2>
              <ul className="space-y-5">
                {[
                  "Helyszíni felmérés és személyre szabott árajánlat",
                  "Felületek előkészítése, gépek pozícionálása",
                  "Gépi vakolás kivitelezése folyamatos minőségellenőrzéssel",
                  "Simítás, élvédés és tisztaságra ügyelő utómunkák",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4" data-testid={`process-step-${i}`}>
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-base lg:text-lg">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICE TEASER */}
      <section className="py-24 lg:py-32 bg-background" data-testid="price-teaser-section">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Transzparens árazás
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Egységár,<br />
                rejtett költségek nélkül.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                A cementes gépi vakolás munkadíja nálunk{" "}
                <strong className="text-foreground">2 500 – 4 000 Ft/m²</strong>{" "}
                között mozog. Számolja ki a saját projektje teljes árát a
                részletes interaktív kalkulátorunkkal — kiegészítő munkákkal és
                felárakkal együtt.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/szolgaltatasok"
                  data-testid="price-cta-calculator"
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-wider hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300"
                >
                  <Calculator className="h-5 w-5" />
                  Ár kalkulátor
                </Link>
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  data-testid="price-cta-call"
                  className="inline-flex items-center gap-3 border-2 border-foreground text-foreground px-8 py-4 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  {COMPANY.phone}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#18181B] text-white p-10 lg:p-14 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/20 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    Cementes gépi vakolás
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <div className="font-display text-6xl lg:text-7xl font-extrabold text-primary leading-none">
                      2500
                    </div>
                    <div className="font-display text-2xl text-zinc-400">–</div>
                    <div className="font-display text-6xl lg:text-7xl font-extrabold text-primary leading-none">
                      4000
                    </div>
                  </div>
                  <div className="mt-3 text-zinc-400 text-sm uppercase tracking-widest">
                    Ft / m² · munkadíj
                  </div>
                  <div className="mt-10 pt-8 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Általában 1-3 nap kivitelezés</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-primary text-primary-foreground" data-testid="cta-banner">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-2xl">
              Kérjen ingyenes árajánlatot 24 órán belül.
            </h2>
            <Link
              to="/kapcsolat"
              data-testid="bottom-cta"
              className="shrink-0 inline-flex items-center gap-3 bg-white text-primary px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#18181B] hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              Kapcsolatfelvétel
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
