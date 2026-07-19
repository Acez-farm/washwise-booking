import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Clock,
  Check,
  ChevronRight,
  Car,
  Calendar as CalendarIcon,
  Star,
  ArrowRight,
  MessageCircle,
  Instagram,
  MapPin,
  Phone,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImage from "@/assets/hero-carwash.jpg";
import {
  ALL_SLOTS,
  addBooking,
  isSlotTaken,
  useBlockedSlots,
  useBookings,
} from "@/lib/bookings-store";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const services = [
  {
    id: "simples",
    name: "Lavagem Simples",
    price: 35,
    duration: "30 min",
    features: ["Lavagem externa", "Secagem premium", "Pretinho nos pneus"],
  },
  {
    id: "completa",
    name: "Lavagem Completa",
    price: 60,
    duration: "1h",
    features: [
      "Tudo da Simples",
      "Aspiração interna",
      "Limpeza de painel",
      "Aromatização",
    ],
    featured: true,
  },
  {
    id: "detalhada",
    name: "Lavagem Detalhada",
    price: 150,
    duration: "2h30",
    features: [
      "Tudo da Completa",
      "Cera de carnaúba",
      "Hidratação de couro",
      "Motor + rodas detalhadas",
    ],
  },
];

const testimonials = [
  {
    name: "Rafael M.",
    car: "BMW 320i",
    text: "Melhor lava jato da região do Silveira. Meu carro sai brilhando como novo toda vez.",
  },
  {
    name: "Juliana P.",
    car: "Jeep Compass",
    text: "Agendei pelo celular em 30 segundos. Super rápido e o atendimento é impecável.",
  },
  {
    name: "Diego S.",
    car: "VW Golf GTI",
    text: "Lavagem detalhada surreal. Parece que saiu da concessionária.",
  },
  {
    name: "Fernanda L.",
    car: "Hyundai HB20",
    text: "Atendimento nota 10! Equipe super educada e o carro ficou impecável por dentro e por fora.",
  },
  {
    name: "Marcos A.",
    car: "Toyota Corolla",
    text: "Sou cliente há mais de 2 anos. Confio de olhos fechados no pessoal do Silveira.",
  },
  {
    name: "Camila R.",
    car: "Fiat Pulse",
    text: "Localização ótima em BH e preço justo. A higienização interna fez toda diferença.",
  },
  {
    name: "Bruno T.",
    car: "Chevrolet Onix",
    text: "Rápido, caprichoso e sempre no horário marcado. Recomendo demais!",
  },
  {
    name: "Patrícia S.",
    car: "Renault Kwid",
    text: "Peguei o carro cheirando a novo. Vou voltar toda semana com certeza.",
  },
];

const extraTestimonials = [
  { name: "Lucas F.", car: "Honda Civic", text: "Atendimento sensacional. Pontualidade e capricho — meu Civic ficou espelhando." },
  { name: "Aline C.", car: "Nissan Kicks", text: "Já indiquei pra família toda. Preço honesto e serviço muito bem feito." },
  { name: "Rodrigo V.", car: "Ford Ranger", text: "Levo a caminhonete cheia de barro e sai zerada. Trabalho impecável!" },
  { name: "Beatriz N.", car: "Peugeot 208", text: "Amei a aromatização, o carro fica com aquele cheirinho de novo por dias." },
  { name: "Thiago O.", car: "Mitsubishi L200", text: "Detalhada com cera ficou perfeita. Vale cada centavo, super recomendo." },
  { name: "Larissa D.", car: "Chevrolet Tracker", text: "Local limpo, equipe simpática e serviço rápido. Fidelizada!" },
  { name: "Gustavo H.", car: "Volkswagen T-Cross", text: "Melhor custo-benefício do bairro Silveira. Nunca mais lavei em outro lugar." },
  { name: "Mariana B.", car: "Renault Duster", text: "Agendamento pelo site é super prático. Chegou na hora e entregou no prazo." },
  { name: "Pedro L.", car: "Toyota Hilux", text: "Motor e rodas ficaram novos. Trabalho detalhista de verdade." },
  { name: "Isabela M.", car: "Fiat Argo", text: "Sempre saio com o carro impecável. Time atencioso e caprichoso." },
  { name: "André P.", car: "Kia Sportage", text: "Higienização interna surpreendente. Removeram manchas que eu achei que eram permanentes." },
  { name: "Renata S.", car: "Volkswagen Polo", text: "Ambiente organizado e serviço rápido. Nota 10 pra equipe do Silveira!" },
];

const allTestimonials = [...testimonials, ...extraTestimonials];

const WHATSAPP_NUMBER = "5531983992520";
const WHATSAPP_DISPLAY = "(31) 98399-2520";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de agendar uma lavagem no Lava Jato Silveira."
)}`;
const INSTAGRAM_URL =
  "https://www.instagram.com/lavajatosilveira?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const ADDRESS = "R. Carlos Turner, 421 - Silveira, Belo Horizonte - MG, 31140-520";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Lava Jato Silveira, R. Carlos Turner, 421, Belo Horizonte MG"
)}`;

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Services />
      <BookingSection />
      <Testimonials />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-black tracking-tight">Lava Jato Silveira</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#servicos" className="hover:text-foreground">Serviços</a>
          <a href="#agendar" className="hover:text-foreground">Agendar</a>
          <a href="#depoimentos" className="hover:text-foreground">Depoimentos</a>
          <a href="#contato" className="hover:text-foreground">Contato</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, oklch(0.85 0.24 145 / 0.25), transparent 60%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            4,5 ★ · 170 avaliações no Google
          </span>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Seu carro <span className="text-primary">brilhando</span> sem sair de casa.
          </h1>
          <p className="max-w-lg text-base text-muted-foreground md:text-lg">
            Lava Jato Silveira em Belo Horizonte/MG. Escolha o serviço, o horário e
            pronto — a gente cuida do resto com produtos premium e uma equipe
            apaixonada por carros.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#agendar">
              <Button
                size="lg"
                className="group h-12 rounded-full bg-[image:var(--gradient-primary)] px-6 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
              >
                Agendar Lavagem
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/40 bg-transparent px-6 text-base text-primary hover:bg-primary/10"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Garantia de satisfação
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Pronto em até 2h
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            className="absolute -inset-4 -z-10 rounded-3xl opacity-40 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <img
            src={heroImage}
            alt="Carro esportivo preto sendo lavado com espuma"
            width={1600}
            height={1200}
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-elegant)]"
          />
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">
          Escolha o cuidado ideal
        </h2>
        <p className="mt-3 text-muted-foreground">
          Do rápido ao detalhado — preços justos e produtos premium em todas as opções.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.id}
            className={`relative flex flex-col rounded-2xl border p-6 transition ${
              s.featured
                ? "border-primary/40 bg-card shadow-[var(--shadow-glow)]"
                : "border-border bg-card/60 hover:border-primary/30"
            }`}
          >
            {s.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                Mais escolhido
              </span>
            )}
            <h3 className="text-xl font-bold">{s.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-primary">
                R${s.price}
              </span>
              <span className="text-sm text-muted-foreground">/ {s.duration}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {s.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="#agendar" className="mt-8">
              <Button
                className={`w-full rounded-full ${
                  s.featured
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-95"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Agendar este serviço
              </Button>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingSection() {
  return (
    <section id="agendar" className="border-y border-border/50 bg-card/40 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <CalendarIcon className="h-3.5 w-3.5" />
            Agendamento rápido
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
            Reserve seu horário
          </h2>
          <p className="mt-3 text-muted-foreground">
            3 passos simples. Confirmação imediata.
          </p>
        </div>
        <div className="mt-10">
          <BookingWizard />
        </div>
      </div>
    </section>
  );
}

function BookingWizard() {
  const bookings = useBookings();
  const blocked = useBlockedSlots();
  const [step, setStep] = useState(1);
  const [service, setService] = useState<(typeof services)[number] | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [form, setForm] = useState({ plate: "", model: "", name: "", phone: "" });
  const [confirmed, setConfirmed] = useState<null | { id: string }>(null);

  const dates = useMemo(() => {
    const out: { value: string; label: string; weekday: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const value = d.toISOString().slice(0, 10);
      out.push({
        value,
        label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      });
    }
    return out;
  }, []);

  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!service || !date || !time) return;
    if (!form.plate || !form.model || !form.name || !form.phone) {
      toast.error("Preencha todos os dados do veículo.");
      return;
    }
    setSubmitting(true);
    try {
      const b = await addBooking({
        service: service.name,
        price: service.price,
        date,
        time,
        plate: form.plate.toUpperCase(),
        model: form.model,
        name: form.name,
        phone: form.phone,
      });
      setConfirmed({ id: b.id });
      toast.success("Agendamento confirmado!");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível confirmar o agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-3xl border border-primary/40 bg-card p-8 text-center shadow-[var(--shadow-glow)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-2xl font-black">
          Tudo certo, {form.name.split(" ")[0]}!
        </h3>
        <p className="mt-2 text-muted-foreground">
          {service?.name} para{" "}
          <span className="font-semibold text-foreground">{form.model}</span> (
          {form.plate.toUpperCase()}) —{" "}
          {new Date(date + "T00:00").toLocaleDateString("pt-BR")} às {time}.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Código: {confirmed.id}</p>
        <Button
          className="mt-6 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-95"
          onClick={() => {
            setConfirmed(null);
            setStep(1);
            setService(null);
            setDate("");
            setTime("");
            setForm({ plate: "", model: "", name: "", phone: "" });
          }}
        >
          Fazer outro agendamento
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] md:p-8">
      <StepIndicator step={step} />

      {step === 1 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-bold">1. Escolha o serviço</h3>
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setService(s);
                setStep(2);
              }}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                service?.id === s.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-secondary/50"
              }`}
            >
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.duration}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-primary">R${s.price}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && service && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold">2. Escolha data e horário</h3>
            <p className="text-sm text-muted-foreground">Próximos 7 dias</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => {
                  setDate(d.value);
                  setTime("");
                }}
                className={`flex min-w-[72px] shrink-0 flex-col items-center rounded-2xl border p-3 transition ${
                  date === d.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-xs uppercase text-muted-foreground">
                  {d.weekday}
                </span>
                <span className="mt-1 text-lg font-bold">
                  {d.label.split(" ")[0]}
                </span>
                <span className="text-[10px] uppercase text-muted-foreground">
                  {d.label.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>

          {date && (
            <div>
              <div className="mb-3 text-sm font-medium">Horários disponíveis</div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {ALL_SLOTS.map((t) => {
                  const taken = isSlotTaken(bookings, blocked, date, t);
                  return (
                    <button
                      key={t}
                      disabled={taken}
                      onClick={() => setTime(t)}
                      className={`rounded-xl border p-3 text-sm font-medium transition ${
                        time === t
                          ? "border-primary bg-primary text-primary-foreground"
                          : taken
                            ? "cursor-not-allowed border-border/50 bg-muted/40 text-muted-foreground line-through"
                            : "border-border hover:border-primary/40 hover:bg-secondary/50"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep(1)} className="rounded-full">
              Voltar
            </Button>
            <Button
              disabled={!date || !time}
              onClick={() => setStep(3)}
              className="rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-95"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 3 && service && (
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-bold">3. Dados do veículo e contato</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Placa" icon={<Car className="h-4 w-4" />}>
              <Input
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value })}
                placeholder="ABC-1D23"
                maxLength={8}
                className="bg-background"
              />
            </Field>
            <Field label="Modelo do veículo">
              <Input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Ex: Honda Civic"
                className="bg-background"
              />
            </Field>
            <Field label="Seu nome">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Como te chamamos?"
                className="bg-background"
              />
            </Field>
            <Field label="WhatsApp">
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-0000"
                className="bg-background"
              />
            </Field>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Serviço</span>
              <span className="font-semibold">{service.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Quando</span>
              <span className="font-semibold">
                {new Date(date + "T00:00").toLocaleDateString("pt-BR")} · {time}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-black text-primary">R${service.price}</span>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep(2)} className="rounded-full">
              Voltar
            </Button>
            <Button
              onClick={submit}
              disabled={submitting}
              className="rounded-full bg-[image:var(--gradient-primary)] px-6 text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Confirmando..." : "Confirmar agendamento"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = ["Serviço", "Horário", "Dados"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-primary/30 text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <span
              className={`hidden text-xs sm:inline ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}

function Testimonials() {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const total = allTestimonials.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (delta > 50) prev();
    else if (delta < -50) next();
    setTouchStart(null);
  }

  return (
    <section id="depoimentos" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">
          Amado por quem cuida do carro
        </h2>
        <p className="mt-3 text-muted-foreground">
          Mais de {total}+ clientes satisfeitos compartilharam suas experiências.
        </p>
      </div>
      <div className="relative mx-auto mt-12 max-w-2xl">
        <div
          className="overflow-hidden rounded-3xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {allTestimonials.map((t) => (
              <div key={t.name} className="w-full shrink-0 px-1">
                <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-base leading-relaxed md:text-lg">
                    "{t.text}"
                  </p>
                  <div className="mt-6 border-t border-border pt-4">
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.car}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prev}
          aria-label="Depoimento anterior"
          className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur hover:border-primary/40 hover:text-primary md:-translate-x-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Próximo depoimento"
          className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/90 shadow-md backdrop-blur hover:border-primary/40 hover:text-primary md:translate-x-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {allTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para depoimento ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contato" className="border-t border-border/50 bg-card/40 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)]">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-black">Lava Jato Silveira</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Lava-rápido em Belo Horizonte/MG. Nota 4,5 no Google com mais de 170
            avaliações.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Horário: Seg. a Sáb. a partir das 08:30
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Contato
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary"
          >
            <MessageCircle className="h-4 w-4 text-primary" />
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className="flex items-center gap-2 hover:text-primary"
          >
            <Phone className="h-4 w-4 text-primary" />
            {WHATSAPP_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary"
          >
            <Instagram className="h-4 w-4 text-primary" />
            @lavajatosilveira
          </a>
        </div>
        <div className="space-y-3 text-sm">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Endereço
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-primary"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{ADDRESS}</span>
          </a>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-border/50 px-4 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lava Jato Silveira · Belo Horizonte/MG
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[oklch(0.72_0.19_150)] px-4 py-3 text-sm font-bold text-black shadow-[0_10px_30px_-5px_oklch(0.72_0.19_150_/_0.6)] transition hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
