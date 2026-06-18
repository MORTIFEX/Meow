import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Mail, Phone, Send, Loader2, CheckCircle2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { COMPANY, formatFt } from "@/lib/company";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const location = useLocation();
  const prefilledSqm = location.state?.sqm;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    square_meters: prefilledSqm ? String(prefilledSqm) : "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const estimatedPrice = useMemo(() => {
    const n = Number(form.square_meters);
    if (Number.isFinite(n) && n > 0) return n * COMPANY.pricePerSqm;
    return 0;
  }, [form.square_meters]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((er) => ({ ...er, [field]: undefined }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      e.name = "Kérjük, adja meg a nevét.";
    }
    if (!form.phone.trim() || form.phone.trim().length < 6) {
      e.phone = "Kérjük, adjon meg egy érvényes telefonszámot.";
    }
    if (!emailRegex.test(form.email.trim())) {
      e.email = "Kérjük, adjon meg egy érvényes e-mail címet.";
    }
    const n = Number(form.square_meters);
    if (!Number.isFinite(n) || n <= 0) {
      e.square_meters = "Kérjük, adja meg a négyzetmétert (pozitív szám).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        square_meters: Number(form.square_meters),
        message: form.message.trim(),
      });
      setSuccess(true);
      toast.success("Köszönjük! Hamarosan jelentkezünk.", {
        description: "Az árajánlat-kérése sikeresen megérkezett.",
      });
      setForm({ name: "", phone: "", email: "", square_meters: "", message: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Hiba történt a beküldés során. Kérjük, próbálja újra vagy hívjon minket.";
      toast.error("Sikertelen beküldés", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      {/* Hero */}
      <section className="bg-[#18181B] text-white py-24 lg:py-32" data-testid="contact-hero">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
            Kapcsolat
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] max-w-4xl">
            Beszéljünk a<br />
            <span className="text-primary">projektjéről.</span>
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-zinc-300 max-w-2xl leading-relaxed">
            Töltse ki az űrlapot, vagy keressen minket közvetlenül — 24 órán
            belül válaszolunk, és ingyenes árajánlatot készítünk.
          </p>
        </div>
      </section>

      {/* Contact + Form */}
      <section className="py-20 lg:py-28 bg-background" data-testid="contact-main">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left – Contact Info */}
            <div className="lg:col-span-5">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-6">
                Elérhetőségek
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-10">
                Vegye fel velünk<br />a kapcsolatot.
              </h2>

              <div className="space-y-px bg-border border border-border">
                <a
                  href={`mailto:${COMPANY.email}`}
                  data-testid="contact-info-email"
                  className="group bg-card p-6 flex items-start gap-5 hover:bg-[#18181B] hover:text-white transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-zinc-400 mb-1">
                      E-mail
                    </div>
                    <div className="font-display font-bold text-lg break-all">{COMPANY.email}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-zinc-400 mt-1">
                      Írjon nekünk bármikor
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  data-testid="contact-info-phone"
                  className="group bg-card p-6 flex items-start gap-5 hover:bg-[#18181B] hover:text-white transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-zinc-400 mb-1">
                      Telefon
                    </div>
                    <div className="font-display font-bold text-lg">{COMPANY.phone}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-zinc-400 mt-1">
                      Hívjon közvetlenül
                    </div>
                  </div>
                </a>

                <div className="bg-card p-6 flex items-start gap-5">
                  <div className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                      Nyitvatartás
                    </div>
                    <div className="font-display font-bold text-lg">Hétfő – Szombat</div>
                    <div className="text-sm text-muted-foreground mt-1">07:00 – 18:00</div>
                  </div>
                </div>

                <div className="bg-card p-6 flex items-start gap-5">
                  <div className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                      Működési terület
                    </div>
                    <div className="font-display font-bold text-lg">Magyarország</div>
                    <div className="text-sm text-muted-foreground mt-1">Országosan vállalunk projekteket</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 bg-secondary text-secondary-foreground p-8 border-l-4 border-primary">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                  Egységár
                </div>
                <div className="font-display text-3xl font-extrabold">
                  {formatFt(COMPANY.pricePerSqm)} <span className="text-base text-zinc-400 font-medium">/ m²</span>
                </div>
                <p className="text-sm text-zinc-400 mt-3">
                  Transzparens árazás, rejtett költségek nélkül.
                </p>
              </div>
            </div>

            {/* Right – Form */}
            <div className="lg:col-span-7">
              <div className="bg-card border border-border p-8 lg:p-12" data-testid="contact-form-card">
                {success ? (
                  <div className="py-16 text-center" data-testid="contact-success">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center bg-primary text-primary-foreground mb-8">
                      <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                      Köszönjük megkeresését!
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                      Az árajánlat-kérése sikeresen megérkezett hozzánk.<br />
                      24 órán belül felvesszük Önnel a kapcsolatot.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      data-testid="contact-send-another"
                      className="mt-10 inline-flex items-center gap-2 border-2 border-foreground text-foreground px-8 py-3 font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                    >
                      Új üzenet küldése
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate data-testid="contact-form">
                    <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                      Árajánlat-kérés
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-8">
                      Töltse ki az űrlapot
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-xs uppercase tracking-wider font-bold">
                          Név *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange("name")}
                          placeholder="Kovács István"
                          data-testid="form-name"
                          className="mt-2 rounded-none h-12 focus-visible:ring-primary focus-visible:ring-offset-0"
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-destructive" data-testid="error-name">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-xs uppercase tracking-wider font-bold">
                          Telefonszám *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange("phone")}
                          placeholder="+36 30 123 4567"
                          data-testid="form-phone"
                          className="mt-2 rounded-none h-12 focus-visible:ring-primary focus-visible:ring-offset-0"
                          aria-invalid={!!errors.phone}
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-destructive" data-testid="error-phone">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold">
                          E-mail *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange("email")}
                          placeholder="kovacs.istvan@email.hu"
                          data-testid="form-email"
                          className="mt-2 rounded-none h-12 focus-visible:ring-primary focus-visible:ring-offset-0"
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-destructive" data-testid="error-email">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="sqm" className="text-xs uppercase tracking-wider font-bold">
                          Mennyi négyzetmétert szeretne vakoltatni? *
                        </Label>
                        <div className="mt-2 flex items-stretch gap-3">
                          <Input
                            id="sqm"
                            type="number"
                            min="0"
                            step="1"
                            value={form.square_meters}
                            onChange={handleChange("square_meters")}
                            placeholder="50"
                            data-testid="form-sqm"
                            className="rounded-none h-12 focus-visible:ring-primary focus-visible:ring-offset-0 text-lg font-display font-semibold"
                            aria-invalid={!!errors.square_meters}
                          />
                          <div className="flex items-center px-5 bg-muted font-display font-bold">
                            m²
                          </div>
                        </div>
                        {errors.square_meters && (
                          <p className="mt-1.5 text-xs text-destructive" data-testid="error-sqm">
                            {errors.square_meters}
                          </p>
                        )}
                        {estimatedPrice > 0 && (
                          <p className="mt-3 text-sm text-muted-foreground" data-testid="form-estimated-price">
                            Becsült ár:{" "}
                            <span className="font-display font-bold text-primary text-lg">
                              {formatFt(estimatedPrice)}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="message" className="text-xs uppercase tracking-wider font-bold">
                          Üzenet (opcionális)
                        </Label>
                        <Textarea
                          id="message"
                          rows={5}
                          value={form.message}
                          onChange={handleChange("message")}
                          placeholder="További részletek a projektről, helyszín, határidő..."
                          data-testid="form-message"
                          className="mt-2 rounded-none focus-visible:ring-primary focus-visible:ring-offset-0 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      data-testid="form-submit"
                      className="mt-10 group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground w-full sm:w-auto px-10 py-4 font-bold uppercase tracking-wider hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Küldés...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          Küldés
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-xs text-muted-foreground">
                      A *-gal jelölt mezők kitöltése kötelező. Adatait
                      bizalmasan kezeljük, kizárólag a kapcsolatfelvételhez
                      használjuk fel.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
