import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Droplets, ArrowLeft, Clock, CheckCircle2, PlayCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ALL_SLOTS,
  type BookingStatus,
  toggleBlockedSlot,
  updateStatus,
  useBlockedSlots,
  useBookings,
} from "@/lib/bookings-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — AquaShine" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUS_COLORS: Record<BookingStatus, string> = {
  Pendente: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Em Lavagem": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Concluído: "bg-primary/15 text-primary border-primary/30",
};

function AdminPage() {
  const bookings = useBookings();
  const blocked = useBlockedSlots();
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );

  const todayList = useMemo(
    () =>
      bookings
        .filter((b) => b.date === dateFilter)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [bookings, dateFilter],
  );

  const counts = useMemo(() => {
    const c = { Pendente: 0, "Em Lavagem": 0, Concluído: 0 } as Record<BookingStatus, number>;
    todayList.forEach((b) => (c[b.status] += 1));
    return c;
  }, [todayList]);

  const dates = useMemo(() => {
    const out: { value: string; label: string; weekday: string }[] = [];
    for (let i = -1; i < 7; i++) {
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

  const blockedForDate = blocked[dateFilter] ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-card/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)]">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-black">AquaShine</div>
              <div className="text-xs text-muted-foreground">Painel administrativo</div>
            </div>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            <span className="inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao site
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-black">Agendamentos</h1>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map((d) => {
              const active = dateFilter === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => setDateFilter(d.value)}
                  className={`flex min-w-[72px] shrink-0 flex-col items-center rounded-2xl border p-3 transition ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-xs uppercase text-muted-foreground">
                    {d.weekday}
                  </span>
                  <span className="mt-1 text-lg font-bold">{d.label.split(" ")[0]}</span>
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {d.label.split(" ")[1]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Pendentes" value={counts.Pendente} icon={<Clock className="h-4 w-4" />} />
            <StatCard label="Em lavagem" value={counts["Em Lavagem"]} icon={<PlayCircle className="h-4 w-4" />} />
            <StatCard label="Concluídos" value={counts.Concluído} icon={<CheckCircle2 className="h-4 w-4" />} />
          </div>

          <div className="mt-6 space-y-3">
            {todayList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
                Nenhum agendamento para esta data.
              </div>
            )}
            {todayList.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-border bg-card p-4 md:p-5"
              >
                <div className="grid gap-4 md:grid-cols-[80px_1fr_auto] md:items-center">
                  <div className="text-center">
                    <div className="text-2xl font-black text-primary">{b.time}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">horário</div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{b.service}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {b.model} · <span className="font-mono">{b.plate}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {b.name} · {b.phone} · R${b.price}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <StatusButton
                      current={b.status}
                      target="Pendente"
                      onClick={() => updateStatus(b.id, "Pendente")}
                    />
                    <StatusButton
                      current={b.status}
                      target="Em Lavagem"
                      onClick={() => updateStatus(b.id, "Em Lavagem")}
                    />
                    <StatusButton
                      current={b.status}
                      target="Concluído"
                      onClick={() => updateStatus(b.id, "Concluído")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Bloquear horários</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Clique para bloquear/liberar horários no dia selecionado.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-9">
            {ALL_SLOTS.map((t) => {
              const isBlocked = blockedForDate.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleBlockedSlot(dateFilter, t)}
                  className={`flex items-center justify-center gap-1 rounded-xl border p-2 text-sm font-medium transition ${
                    isBlocked
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {isBlocked && <Ban className="h-3 w-3" />}
                  {t}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}

function StatusButton({
  current,
  target,
  onClick,
}: {
  current: BookingStatus;
  target: BookingStatus;
  onClick: () => void;
}) {
  const active = current === target;
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={`rounded-full text-xs ${
        active
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-transparent"
      }`}
    >
      {target}
    </Button>
  );
}