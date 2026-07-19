import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export type BookingStatus = "Pendente" | "Em Lavagem" | "Concluído";

export interface Booking {
  id: string;
  service: string;
  price: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  plate: string;
  model: string;
  name: string;
  phone: string;
  status: BookingStatus;
  createdAt: number;
}

interface BookingRow {
  id: string;
  service: string;
  price: number;
  date: string;
  time: string;
  plate: string;
  model: string;
  name: string;
  phone: string;
  status: BookingStatus;
  created_at: string;
}

function mapRow(row: BookingRow): Booking {
  return {
    id: row.id,
    service: row.service,
    price: row.price,
    date: row.date,
    time: row.time,
    plate: row.plate,
    model: row.model,
    name: row.name,
    phone: row.phone,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
  };
}

async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as BookingRow[]).map(mapRow);
}

export function useBookings() {
  const { data } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    refetchInterval: 15_000,
  });
  return data ?? [];
}

export async function addBooking(
  b: Omit<Booking, "id" | "status" | "createdAt">,
): Promise<Booking> {
  const id = crypto.randomUUID();
  const { error } = await supabase.from("bookings").insert({
    id,
    service: b.service,
    price: b.price,
    date: b.date,
    time: b.time,
    plate: b.plate,
    model: b.model,
    name: b.name,
    phone: b.phone,
  });
  if (error) throw error;
  return {
    id,
    ...b,
    status: "Pendente",
    createdAt: Date.now(),
  };
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };
}

async function fetchBlockedSlots(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase.from("blocked_slots").select("date, time");
  if (error) throw error;
  const map: Record<string, string[]> = {};
  for (const row of data as { date: string; time: string }[]) {
    map[row.date] = [...(map[row.date] ?? []), row.time];
  }
  return map;
}

export function useBlockedSlots() {
  const { data } = useQuery({
    queryKey: ["blocked-slots"],
    queryFn: fetchBlockedSlots,
    refetchInterval: 15_000,
  });
  return data ?? {};
}

export function useToggleBlockedSlot() {
  const queryClient = useQueryClient();
  return async (date: string, time: string, isCurrentlyBlocked: boolean) => {
    if (isCurrentlyBlocked) {
      const { error } = await supabase
        .from("blocked_slots")
        .delete()
        .eq("date", date)
        .eq("time", time);
      if (error) throw error;
    } else {
      // upsert + ignoreDuplicates: se o horário já estiver bloqueado
      // (ex: clique duplo antes da tela atualizar), não gera erro.
      const { error } = await supabase
        .from("blocked_slots")
        .upsert({ date, time }, { onConflict: "date,time", ignoreDuplicates: true });
      if (error) throw error;
    }
    queryClient.invalidateQueries({ queryKey: ["blocked-slots"] });
  };
}

export const ALL_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function isSlotTaken(
  bookings: Booking[],
  blockedSlots: Record<string, string[]>,
  date: string,
  time: string,
) {
  const taken = bookings.some(
    (b) => b.date === date && b.time === time && b.status !== "Concluído",
  );
  const blocked = (blockedSlots[date] ?? []).includes(time);
  return taken || blocked;
}
