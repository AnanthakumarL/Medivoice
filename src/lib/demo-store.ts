// Lightweight localStorage-backed demo store for frontend-only operation
import { demoDoctors, demoPatients, demoLabs } from "./demo-data";

const KEYS = {
  seeded: "demo.seeded",
  user: "demo.user",
  appointments: "demo.appointments",
  notifications: "demo.notifications",
  doctors: "demo.doctors",
  patients: "demo.patients",
  labs: "demo.labs",
} as const;

// Helpers
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export type DemoUser = {
  role: "patient" | "doctor" | "lab" | "admin";
  name?: string;
  email?: string;
  meta?: Record<string, any>;
};

export type DemoAppointment = {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "phone";
  reason: string;
  status: "confirmed" | "completed" | "cancelled" | "rescheduled";
  cost: string;
  doctorPhone?: string;
  doctorEmail?: string;
  doctorAddress?: string;
  doctorRating?: number;
};

export function seedDemoData() {
  const alreadySeeded = localStorage.getItem(KEYS.seeded);
  if (alreadySeeded) return;

  // Base entities
  write(KEYS.doctors, demoDoctors);
  write(KEYS.patients, demoPatients);
  write(KEYS.labs, demoLabs);

  // Starter appointments
  const starter: DemoAppointment[] = [
    {
      id: "apt-001",
      doctor: demoDoctors[0].name,
      specialty: demoDoctors[0].specialty,
      hospital: demoDoctors[0].hospital,
      date: new Date().toISOString().slice(0, 10),
      time: "2:00 PM",
      type: "in-person",
      reason: "Follow-up consultation",
      status: "confirmed",
      cost: demoDoctors[0].consultationFee,
      doctorPhone: demoDoctors[0].phone,
      doctorEmail: demoDoctors[0].email,
      doctorAddress: demoDoctors[0].address,
      doctorRating: demoDoctors[0].rating,
    },
  ];
  write(KEYS.appointments, starter);

  // Starter notifications
  write(KEYS.notifications, [
    { id: Date.now(), message: "Welcome to MediVoice Demo!", urgent: false, time: "Just now", type: "info" },
  ]);

  localStorage.setItem(KEYS.seeded, "1");
}

export const demoStore = {
  seed: seedDemoData,

  // User
  setCurrentUser(user: DemoUser) {
    write(KEYS.user, user);
  },
  getCurrentUser(): DemoUser | null {
    return read<DemoUser | null>(KEYS.user, null);
  },
  clearUser() {
    localStorage.removeItem(KEYS.user);
  },

  // Appointments
  getAppointments(): DemoAppointment[] {
    return read<DemoAppointment[]>(KEYS.appointments, []);
  },
  addAppointment(appt: DemoAppointment) {
    const items = read<DemoAppointment[]>(KEYS.appointments, []);
    // dedupe by id
    const exists = items.some(a => a.id === appt.id);
    const updated = exists ? items.map(a => (a.id === appt.id ? appt : a)) : [appt, ...items];
    write(KEYS.appointments, updated);
    return updated;
  },
  updateAppointment(id: string, patch: Partial<DemoAppointment>) {
    const items = read<DemoAppointment[]>(KEYS.appointments, []);
    const updated = items.map(a => (a.id === id ? { ...a, ...patch } : a));
    write(KEYS.appointments, updated);
    return updated;
  },

  // Notifications
  getNotifications() {
    return read<any[]>(KEYS.notifications, []);
  },
  addNotification(n: any) {
    const items = read<any[]>(KEYS.notifications, []);
    const updated = [n, ...items].slice(0, 20);
    write(KEYS.notifications, updated);
    return updated;
  },

  // Entities
  getDoctors() { return read(KEYS.doctors, demoDoctors); },
  getPatients() { return read(KEYS.patients, demoPatients); },
  getLabs() { return read(KEYS.labs, demoLabs); },
};