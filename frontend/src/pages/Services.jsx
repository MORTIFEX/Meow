import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  ArrowRight,
  Check,
  Sparkles,
  Wrench,
  Hammer,
  Building2,
  Layers,
  CheckCheck,
  RotateCcw,
  Info,
} from "lucide-react";
import { COMPANY, formatFt } from "@/lib/company";
import { SERVICES, PRICING_DISCLAIMER } from "@/lib/pricing";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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

const formatRange = (min, max) => {
  if (min === max) return formatFt(min);
  return `${formatFt(min)} – ${formatFt(max)}`;
};

const initialState = () => {
  const state = {};
  SERVICES.forEach((s) => {
    state[s.id] = {
      checked: !!s.defaultChecked,
      qty: s.defaultQty ?? (s.type === "rate" ? 0 : 0),
    };
  });
  return state;
};

export default function Services() {
  const [items, setItems] = useState(initialState);

  const allSelected = useMemo(
    () => SERVICES.every((s) => items[s.id]?.checked),
    [items]
  );

  const toggleAll = () => {
    setItems((prev) => {
      const next = { ...prev };
      const target = !allSelected;
      SERVICES.forEach((s) => {
        next[s.id] = {
          ...next[s.id],
          checked: target,
          // When selecting all, assign a sensible default qty (mirror base sqm or 1)
          qty:
            next[s.id]?.qty ||
            (s.type === "rate"
              ? s.unit === "m²"
                ? prev.cementes?.qty || 50
                : 1
              : 0),
        };
      });
      return next;
    });
  };

  const setChecked = (id, checked) => {
    setItems((prev) => ({
      ...prev,
      [id]: {
        checked,
        qty:
          prev[id]?.qty ||
          (SERVICES.find((s) => s.id === id)?.type === "rate"
            ? SERVICES.find((s) => s.id === id)?.unit === "m²"
              ? prev.cementes?.qty || 50
              : 1
            : 0),
      },
    }));
  };

  const setQty = (id, qty) => {
    const n = qty === "" ? 0 : Number(qty);
    if (!Number.isFinite(n) || n < 0) return;
    setItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: Math.min(100000, n) },
    }));
  };

  const reset = () => setItems(initialState());

  // Compute totals
  const calc = useMemo(() => {
    let munkadijMin = 0;
    let munkadijMax = 0;
    let extrasMin = 0;
    let extrasMax = 0;
    let fixedMin = 0;
    let fixedMax = 0;
    let modFactorMin = 1;
    let modFactorMax = 1;
    let appliedModifiers = [];
    let hasCustom = false;

    SERVICES.forEach((s) => {
      const it = items[s.id];
      if (!it?.checked) return;

      if (s.type === "rate") {
        const q = Number(it.qty) || 0;
        if (q <= 0) return;
        const lineMin = q * s.min;
        const lineMax = q * s.max;
        if (s.base) {
          munkadijMin += lineMin;
          munkadijMax += lineMax;
        } else {
          extrasMin += lineMin;
          extrasMax += lineMax;
        }
      } else if (s.type === "percent") {
        modFactorMin *= 1 + s.min / 100;
        modFactorMax *= 1 + s.max / 100;
        appliedModifiers.push(s);
      } else if (s.type === "fixed") {
        fixedMin += s.min;
        fixedMax += s.max;
      } else if (s.type === "custom") {
        hasCustom = true;
      }
    });

    const munkadijAdjMin = munkadijMin * modFactorMin;
    const munkadijAdjMax = munkadijMax * modFactorMax;

    const totalMin = munkadijAdjMin + extrasMin + fixedMin;
    const totalMax = munkadijAdjMax + extrasMax + fixedMax;

    return {
      munkadijMin,
      munkadijMax,
      munkadijAdjMin,
      munkadijAdjMax,
      extrasMin,
      extrasMax,
      fixedMin,
      fixedMax,
      modFactorMin,
      modFactorMax,
      appliedModifiers,
      hasCustom,
      totalMin,
      totalMax,
    };
  }, [items]);

  const rateItems = SERVICES.filter((s) => s.type === "rate");
  const customItems = SERVICES.filter((s) => s.type === "custom");
  const percentItems = SERVICES.filter((s) => s.type === "percent");
  const fixedItems = SERVICES.filter((s) => s.type === "fixed");

  const baseSqm = items.cementes?.qty || 0;

  return (
    <div data-testid="services-page">
      {/* Hero */}
      <section className="bg-[#18181B] text-white py-24 lg:py-32" data-testid="services-hero">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
            Szolgáltatások
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] max-w-4xl">
            Cementes gépi<br />
            <span className="text-primary">vakolás profi szinten.</span>
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-zinc-300 max-w-2xl leading-relaxed">
            Modern technológia, tapasztalt szakemberek és transzparens árazás —
            minden, amire egy sikeres vakolási projekthez szüksége van.
          </p>
        </div>
      </section>

      {/* What & benefits */}
      <section className="py-24 lg:py-32 bg-background" data-testid="services-about">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Mi az a cementes gépi vakolás?
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Modern technológia.<br />
                <span className="text-muted-foreground">Hagyományos szakértelem.</span>
              </h2>
              <p className="mt-6 text-base lg:text-lg text-muted-foreground leading-relaxed">
                A cementes gépi vakolás során a cement alapú vakolóanyagot egy
                speciális vakológép keveri és juttatja a falfelületre nyomás
                alatt. Ez egyenletesebb, gyorsabb és gazdaságosabb mint a
                hagyományos kézi vakolás — miközben a végeredmény minősége
                kifogástalan.
              </p>

              <img
                src="https://koves-szerszam.hu/img/6202/KOM_26-00257359/KOM_26-00257359.jpg"
                alt="Cementes gépi vakolás"
                className="mt-10 w-full h-80 object-cover"
                loading="lazy"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary mb-8">
                <Sparkles className="h-3 w-3" />
                Részletes ár kalkulátor
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Pipálja ki amire<br />szüksége van.
              </h2>
              <p className="mt-6 text-zinc-300 leading-relaxed">
                Válassza ki a szükséges szolgáltatásokat, adja meg a
                mennyiségeket, és azonnal megkapja a becsült teljes árat
                tartományban.
              </p>

              {/* Quick actions */}
              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={toggleAll}
                  data-testid="select-all-button"
                  className="group inline-flex items-center justify-between gap-3 bg-primary text-primary-foreground px-5 py-3 font-bold uppercase tracking-wider text-xs hover:bg-orange-600 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <CheckCheck className="h-4 w-4" />
                    {allSelected ? "Mindent kikapcsol" : "Mindet kiválaszt"}
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={reset}
                  data-testid="reset-button"
                  className="inline-flex items-center justify-center gap-2 border-2 border-zinc-700 text-zinc-300 px-5 py-3 font-bold uppercase tracking-wider text-xs hover:border-primary hover:text-primary transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Alaphelyzet
                </button>
              </div>

              {/* Live Summary */}
              <div className="mt-10 bg-white text-foreground p-5 sm:p-6 border-l-4 border-primary" data-testid="calc-summary-card">
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Becsült teljes ár
                </div>
                <div
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-tight break-words"
                  data-testid="calc-total-price"
                >
                  {formatRange(calc.totalMin, calc.totalMax)}
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="text-muted-foreground">Munkadíj{calc.appliedModifiers.length > 0 ? " (felárakkal)" : ""}</span>
                    <span className="font-semibold font-mono-alt text-right">{formatRange(calc.munkadijAdjMin, calc.munkadijAdjMax)}</span>
                  </div>
                  {calc.appliedModifiers.length > 0 && (
                    <div className="flex justify-between items-baseline gap-2 flex-wrap text-xs text-muted-foreground pl-2">
                      <span>↳ alap munkadíj</span>
                      <span className="font-mono-alt text-right">{formatRange(calc.munkadijMin, calc.munkadijMax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="text-muted-foreground">Pótmunkák</span>
                    <span className="font-semibold font-mono-alt text-right">{formatRange(calc.extrasMin, calc.extrasMax)}</span>
                  </div>
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="text-muted-foreground">Egyszeri tételek</span>
                    <span className="font-semibold font-mono-alt text-right">{formatRange(calc.fixedMin, calc.fixedMax)}</span>
                  </div>
                </div>

                {calc.hasCustom && (
                  <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted p-3">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Egyedi árazású tételek is be vannak választva — pontos áruk ajánlatkérés után derül ki.</span>
                  </div>
                )}

                <Link
                  to="/kapcsolat"
                  state={{ sqm: baseSqm, calcItems: items }}
                  data-testid="calc-cta"
                  className="mt-6 group inline-flex w-full items-center justify-center gap-3 bg-foreground text-background px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors"
                >
                  Konkrét ajánlatot kérek
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white text-foreground p-4 sm:p-6 lg:p-10" data-testid="calculator-card">
                <div className="flex items-center gap-3 mb-8">
                  <Calculator className="h-6 w-6 text-primary" />
                  <div className="font-mono-alt text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Cementes gépi vakolás · árlista
                  </div>
                </div>

                {/* Group: Felület arányos tételek */}
                <PriceGroup
                  icon={<Layers className="h-4 w-4" />}
                  title="Felület arányos tételek"
                  subtitle="m² / fm / db / m³ alapon"
                >
                  {rateItems.map((s) => (
                    <RateRow
                      key={s.id}
                      service={s}
                      state={items[s.id]}
                      onCheck={(c) => setChecked(s.id, c)}
                      onQty={(q) => setQty(s.id, q)}
                    />
                  ))}
                </PriceGroup>

                {/* Group: Egyedi árazású tételek */}
                <PriceGroup
                  icon={<Info className="h-4 w-4" />}
                  title="Egyedi árazású tételek"
                  subtitle="Helyszíni felmérés után pontosítjuk"
                >
                  {customItems.map((s) => (
                    <CustomRow
                      key={s.id}
                      service={s}
                      state={items[s.id]}
                      onCheck={(c) => setChecked(s.id, c)}
                    />
                  ))}
                </PriceGroup>

                {/* Group: Felárak (%) */}
                <PriceGroup
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Felárak (munkadíjra)"
                  subtitle="Százalékos pótlék az alap munkadíjra"
                >
                  {percentItems.map((s) => (
                    <PercentRow
                      key={s.id}
                      service={s}
                      state={items[s.id]}
                      onCheck={(c) => setChecked(s.id, c)}
                    />
                  ))}
                </PriceGroup>

                {/* Group: Egyszeri tételek */}
                <PriceGroup
                  icon={<Wrench className="h-4 w-4" />}
                  title="Egyszeri tételek"
                  subtitle="Projektenként egyszer felmerülő költség"
                  last
                >
                  {fixedItems.map((s) => (
                    <FixedRow
                      key={s.id}
                      service={s}
                      state={items[s.id]}
                      onCheck={(c) => setChecked(s.id, c)}
                    />
                  ))}
                </PriceGroup>

                <p className="mt-8 text-xs text-muted-foreground leading-relaxed border-t border-border pt-6">
                  <Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-primary" />
                  {PRICING_DISCLAIMER}
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

/* ---------- Subcomponents ---------- */

function PriceGroup({ icon, title, subtitle, children, last }) {
  return (
    <div className={last ? "" : "mb-10 pb-10 border-b border-border"}>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-display font-bold text-base">{title}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div className="space-y-0 border border-border">{children}</div>
    </div>
  );
}

function RowShell({ checked, onCheck, id, primary, controls, amount }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 border-b border-border last:border-b-0 transition-colors ${
        checked ? "bg-orange-50" : "bg-white hover:bg-muted/40"
      }`}
      data-testid={`row-${id}`}
    >
      <label className="flex items-start sm:items-center gap-3 flex-1 cursor-pointer select-none min-w-0">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheck}
          data-testid={`check-${id}`}
          className="rounded-none border-2 border-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 sm:mt-0 shrink-0"
        />
        <div className="flex-1 min-w-0">{primary}</div>
      </label>

      {controls && (
        <div className="flex items-center gap-2 shrink-0 pl-8 sm:pl-0" onClick={(e) => e.preventDefault()}>
          {controls}
        </div>
      )}

      <div className="text-left sm:text-right font-mono-alt text-sm tabular-nums sm:w-44 shrink-0 pl-8 sm:pl-0" data-testid={`line-${id}`}>
        {amount}
      </div>
    </div>
  );
}

function RateRow({ service, state, onCheck, onQty }) {
  const checked = !!state?.checked;
  const qty = Number(state?.qty) || 0;
  const lineMin = qty * service.min;
  const lineMax = qty * service.max;

  return (
    <RowShell
      id={service.id}
      checked={checked}
      onCheck={onCheck}
      primary={
        <>
          <div className="font-semibold text-sm leading-snug">{service.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5 font-mono-alt">
            {service.min === service.max
              ? `${service.min} Ft/${service.unit}`
              : `${service.min}–${service.max} Ft/${service.unit}`}
          </div>
        </>
      }
      controls={
        checked ? (
          <>
            <Input
              type="number"
              min="0"
              step={1}
              value={state.qty}
              onChange={(e) => onQty(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              data-testid={`qty-${service.id}`}
              className="rounded-none h-10 w-20 sm:w-24 text-base font-display font-bold focus-visible:ring-primary focus-visible:ring-offset-0"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-8">{service.unit}</span>
          </>
        ) : null
      }
      amount={
        <span className={checked && qty > 0 ? "text-primary font-bold" : "text-muted-foreground"}>
          {checked && qty > 0
            ? service.min === service.max
              ? formatFt(lineMin)
              : `${formatFt(lineMin)} – ${formatFt(lineMax)}`
            : "—"}
        </span>
      }
    />
  );
}

function CustomRow({ service, state, onCheck }) {
  const checked = !!state?.checked;
  return (
    <RowShell
      id={service.id}
      checked={checked}
      onCheck={onCheck}
      primary={
        <>
          <div className="font-semibold text-sm leading-snug">{service.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{service.note}</div>
        </>
      }
      amount={
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Egyedi ár
        </span>
      }
    />
  );
}

function PercentRow({ service, state, onCheck }) {
  const checked = !!state?.checked;
  return (
    <RowShell
      id={service.id}
      checked={checked}
      onCheck={onCheck}
      primary={
        <>
          <div className="font-semibold text-sm leading-snug">{service.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{service.description}</div>
        </>
      }
      amount={
        <span className={checked ? "text-primary font-bold" : "text-muted-foreground"}>
          +{service.min}–{service.max}%
        </span>
      }
    />
  );
}

function FixedRow({ service, state, onCheck }) {
  const checked = !!state?.checked;
  return (
    <RowShell
      id={service.id}
      checked={checked}
      onCheck={onCheck}
      primary={
        <>
          <div className="font-semibold text-sm leading-snug">{service.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{service.description}</div>
        </>
      }
      amount={
        <span className={checked ? "text-primary font-bold" : "text-muted-foreground"}>
          {service.min === service.max
            ? formatFt(service.min)
            : `${formatFt(service.min)} – ${formatFt(service.max)}`}
        </span>
      }
    />
  );
}
