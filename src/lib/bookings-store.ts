import { useSyncExternalStore } from "react";

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

const seed: Booking[] = [
  {
    id: "b1",
    service: "Lavagem Completa",
    price: 60,
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    plate: "ABC-1D23",
    model: "Honda Civic",
    name: "Carlos Silva",
    phone: "(11) 98888-1234",
    status: "Pendente",
    createdAt: Date.now() - 3600_000,
  },
  {
    id: "b2",
    service: "Lavagem Detalhada",
    price: 150,
    date: new Date().toISOString().slice(0, 10),
    time: "11:00",
    plate: "XYZ-4E56",
    model: "Toyota Corolla",
    name: "Marina Souza",
    phone: "(11) 97777-4321",
    status: "Em Lavagem",
    createdAt: Date.now() - 7200_000,
  },
];

let bookings: Booking[] = [...seed];
let blockedSlots: Record<string, string[]> = {}; // date -> [time]

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useBookings() {
  return useSyncExternalStore(
    subscribe,
    () => bookings,
    () => bookings,
  );
}

export function useBlockedSlots() {
  return useSyncExternalStore(
    subscribe,
    () => blockedSlots,
    () => blockedSlots,
  );
}

export function addBooking(b: Omit<Booking, "id" | "status" | "createdAt">) {
  const booking: Booking = {
    ...b,
    id: `b${Date.now()}`,
    status: "Pendente",
    createdAt: Date.now(),
  };
  bookings = [booking, ...bookings];
  emit();
  return booking;
}

export function updateStatus(id: string, status: BookingStatus) {
  bookings = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  emit();
}

export function toggleBlockedSlot(date: string, time: string) {
  const cur = blockedSlots[date] ?? [];
  const next = cur.includes(time) ? cur.filter((t) => t !== time) : [...cur, time];
  blockedSlots = { ...blockedSlots, [date]: next };
  emit();
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

export function isSlotTaken(date: string, time: string) {
  const taken = bookings.some(
    (b) => b.date === date && b.time === time && b.status !== "Concluído",
  );
  const blocked = (blockedSlots[date] ?? []).includes(time);
  return taken || blocked;
}