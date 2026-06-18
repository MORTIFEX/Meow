import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight, Check, Sparkles, Wrench, Hammer, Building2 } from "lucide-react";
import { COMPANY, formatFt } from "@/lib/company";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const benefits = [
  "Egyenletes, sík felület minden esetben",
  "Akár 5x gyorsabb mint a kézi vakolás",
  "Kevesebb anyagveszteség, gazdaságosabb kivitelezés",
  "Tökéletes alap festéshez, burkoláshoz, tapétázáshoz",
  "Tartós, repedésmentes végeredmény",
  "Minimális utólagos javítás és simítás",
];

const surfaces = [
  { icon: Building2, title: "Családi házak", desc: "Belső és külső falfelületek precíz kivitelezése." },
  { icon: Wrench, title: "Lakások, irodák", desc: "Felújítási projektek gyors és tiszta megoldása." },
  { icon: Hammer, title: "Ipari létesítmények", desc: "Csarnokok és nagy felületű projektek gépesítve." },
];

export default function Services() {
  const [sqm, setSqm] = useState(50);
  const total = useMemo(() => Math.max(0, sqm) * COMPANY.pricePerSqm, [sqm]);

  const handleInput = (v) => {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) {
      setSqm(Math.min(10000, n));
    } else if (v === "") {
      setSqm(0);
    }
  };

  return (
    <div data-testid="services-page">
      {/* Hero */}
      <section className="bg-[#18181B] text-white py-24 lg:py-32" data-testid="services-hero">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
            Szolgáltatások
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] max-w-4xl">
            Gépi vakolás<br />
            <span className="text-primary">profi szinten.</span>
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-zinc-300 max-w-2xl leading-relaxed">
            Modern technológia, tapasztalt szakemberek és transzparens árazás —
            minden, amire egy sikeres projekthez szüksége van.
          </p>
        </div>
      </section>

      {/* What & benefits */}
      <section className="py-24 lg:py-32 bg-background" data-testid="services-about">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Mi az a gépi vakolás?
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Modern technológia.<br />
                <span className="text-muted-foreground">Hagyományos szakértelem.</span>
              </h2>
              <p className="mt-6 text-base lg:text-lg text-muted-foreground leading-relaxed">
                A gépi vakolás során a vakolóanyagot egy speciális gép keveri és
                juttatja a falfelületre nyomás alatt. Ez egyenletesebb, gyorsabb
                és gazdaságosabb mint a hagyományos kézi vakolás — miközben a
                végeredmény minősége kifogástalan.
              </p>

              <img
                src="https://images.unsplash.com/photo-1523413307857-ef24c53571ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwbGFzdGVyaW5nJTIwd29ya2VyfGVufDB8fHx8MTc4MTc4Nzg0Mnww&ixlib=rb-4.1.0&q=85"
                alt="Gépi vakolás"
                className="mt-10 w-full h-80 object-cover"
                data-testid="services-about-image"
              />
            </div>

            <div className="lg:col-span-7">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Előnyök
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-10">
                Miért érdemes minket választani?
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`benefit-${i}`}>
                    <div className="mt-1 flex h-5 w-5 items-center justify-center bg-primary text-primary-foreground shrink-0">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Surface types */}
              <div className="mt-16">
                <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                  Hol vállaljuk?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
                  {surfaces.map((s, i) => (
                    <div key={i} className="bg-card p-6" data-testid={`surface-${i}`}>
                      <s.icon className="h-8 w-8 text-primary mb-4" strokeWidth={2} />
                      <div className="font-display font-bold text-lg mb-1">{s.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-[#18181B] text-white py-24 lg:py-32 relative overflow-hidden" data-testid="calculator-section">
        <div className="absolute top-1/2 -translate-y-1/2 -left-32 h-96 w-96 bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary mb-8">
                <Sparkles className="h-3 w-3" />
                Ár kalkulátor
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Számolja ki<br />
                a projekt árát.
              </h2>
              <p className="mt-6 text-zinc-300 leading-relaxed max-w-md">
                Adja meg a vakolandó felület nagyságát négyzetméterben, és
                azonnal megkapja a becsült teljes árat.
              </p>
              <div className="mt-8 inline-flex items-baseline gap-3 border-l-4 border-primary pl-6">
                <div className="font-display text-3xl font-bold">{formatFt(COMPANY.pricePerSqm)}</div>
                <div className="text-xs uppercase tracking-widest text-zinc-500">/ m²</div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white text-foreground p-8 lg:p-12 border-l-8 border-primary" data-testid="calculator-card">
                <div className="flex items-center gap-3 mb-8">
                  <Calculator className="h-6 w-6 text-primary" />
                  <div className="font-mono-alt text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Gépi vakolás kalkulátor
                  </div>
                </div>

                <label htmlFor="sqm-input" className="block text-sm font-semibold uppercase tracking-wider mb-3">
                  Felület mérete (m²)
                </label>
                <div className="flex items-stretch gap-3">
                  <Input
                    id="sqm-input"
                    type="number"
                    min="0"
                    max="10000"
                    step="1"
                    value={sqm}
                    onChange={(e) => handleInput(e.target.value)}
                    data-testid="calc-sqm-input"
                    className="rounded-none text-2xl font-display font-bold h-16 px-5 focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                  <div className="flex items-center px-6 bg-muted font-display font-bold text-lg">
                    m²
                  </div>
                </div>

                <div className="mt-6">
                  <Slider
                    value={[Math.min(500, sqm)]}
                    onValueChange={(v) => setSqm(v[0])}
                    max={500}
                    step={5}
                    data-testid="calc-sqm-slider"
                    className="[&_[role=slider]]:rounded-none [&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono-alt">
                    <span>0 m²</span>
                    <span>250 m²</span>
                    <span>500+ m²</span>
                  </div>
                </div>

                {/* Quick presets */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {[25, 50, 100, 200, 500].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSqm(p)}
                      data-testid={`calc-preset-${p}`}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                        sqm === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p} m²
                    </button>
                  ))}
                </div>

                {/* Result */}
                <div className="mt-10 pt-8 border-t-2 border-dashed border-border">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                        Becsült teljes ár
                      </div>
                      <div
                        className="font-display text-5xl sm:text-6xl font-extrabold text-primary leading-none"
                        data-testid="calc-total-price"
                      >
                        {formatFt(total)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono-alt">
                      {sqm || 0} m² × {COMPANY.pricePerSqm} Ft
                    </div>
                  </div>

                  <Link
                    to="/kapcsolat"
                    state={{ sqm }}
                    data-testid="calc-cta"
                    className="mt-8 group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-bold uppercase tracking-wider hover:bg-primary hover:-translate-y-1 transition-all duration-300"
                  >
                    Konkrét ajánlatot kérek
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                  * A megadott ár tájékoztató jellegű. A pontos árajánlatért
                  kérjük, vegye fel velünk a kapcsolatot — minden projekt
                  egyedi paraméterekkel rendelkezik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground" data-testid="services-cta">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Készen áll a következő lépésre?
            </h2>
            <Link
              to="/kapcsolat"
              data-testid="services-bottom-cta"
              className="shrink-0 inline-flex items-center gap-3 bg-white text-primary px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#18181B] hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              Vegye fel velünk a kapcsolatot
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
